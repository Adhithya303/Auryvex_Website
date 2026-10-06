# Auryvex — Production Hosting Guide

This guide describes how to deploy, configure, and maintain Auryvex on a single Linux production server (Ubuntu 22.04 LTS or 24.04 LTS).

---

## 1. Prerequisites

Ensure the following packages are installed on the host:

- **Node.js**: ≥ 20.x LTS
- **Python**: ≥ 3.11
- **nginx**: ≥ 1.24
- **Certbot**: for automated Let's Encrypt TLS certificates
- **systemd**: for service supervision
- **sqlite3**: command-line tool for backups and inspection

Install base utilities on Ubuntu/Debian:
```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip nginx certbot python3-certbot-nginx sqlite3 curl git
```

---

## 2. Environment Variables

### Backend (`/srv/auryvex/backend/.env`)
Create this file from `.env.example`. Do **not** commit `.env` to source control.

```bash
DATABASE_URL=sqlite:////var/lib/auryvex/auryvex.db
SECRET_KEY=<generate with: openssl rand -hex 32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALLOWED_ORIGINS=https://auryvex.com,https://www.auryvex.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<generate-a-strong-password>
ENVIRONMENT=production
```

### Frontend (`/srv/auryvex/frontend/.env.production`)
```bash
VITE_API_BASE_URL=/api
```

---

## 3. Directory Layout and Permissions

We recommend placing the application under `/srv/auryvex` and the persistent SQLite database under `/var/lib/auryvex`:

```bash
# Create application user
sudo useradd --system --shell /usr/sbin/nologin auryvex

# Create persistent database folder
sudo mkdir -p /var/lib/auryvex
sudo chown -R auryvex:auryvex /var/lib/auryvex
sudo chmod 750 /var/lib/auryvex

# Set up code directories
sudo mkdir -p /srv/auryvex
sudo chown -R auryvex:auryvex /srv/auryvex
```

---

## 4. Frontend Build & Static Serving

The frontend compiles to static assets served directly by nginx.

```bash
cd /srv/auryvex/frontend
npm ci
npm run build
# Output directory: /srv/auryvex/frontend/dist
```

Ensure permissions permit nginx to read the files:
```bash
sudo chmod -R o+rX /srv/auryvex/frontend/dist
```

---

## 5. Backend Service Setup

Create the Python virtual environment and install production requirements:

```bash
cd /srv/auryvex/backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
alembic upgrade head
```

### systemd Service Unit: `/etc/systemd/system/auryvex-backend.service`

```ini
[Unit]
Description=Auryvex FastAPI Backend
After=network.target

[Service]
Type=simple
User=auryvex
Group=auryvex
WorkingDirectory=/srv/auryvex/backend
EnvironmentFile=/srv/auryvex/backend/.env
ExecStart=/srv/auryvex/backend/.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --workers 1 --no-access-log
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable auryvex-backend
sudo systemctl start auryvex-backend
sudo systemctl status auryvex-backend
```

---

## 6. nginx Configuration

Place the configuration at `/etc/nginx/sites-available/auryvex`:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name auryvex.com www.auryvex.com;
    return 301 https://auryvex.com$request_uri;
}

# Redirect www to apex domain
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.auryvex.com;

    ssl_certificate     /etc/letsencrypt/live/auryvex.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/auryvex.com/privkey.pem;

    return 301 https://auryvex.com$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name auryvex.com;

    ssl_certificate     /etc/letsencrypt/live/auryvex.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/auryvex.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    root /srv/auryvex/frontend/dist;
    index index.html;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # API reverse proxy — defined before SPA fallback
    location /api/ {
        proxy_pass         http://127.0.0.1:8000;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
    }

    # Static assets caching
    location ~* \.(?:css|js|woff2?|svg|png|jpg|ico|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable site and test:
```bash
sudo ln -s /etc/nginx/sites-available/auryvex /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 7. SQLite Deployment Assumptions & Concurrency

1. **Single Worker (`--workers 1`)**:
   We deliberately configure Uvicorn with `--workers 1`. Multiple worker processes writing simultaneously to SQLite can trigger lock contention (`SQLITE_BUSY` errors). A single worker serialises write requests cleanly while handling high asynchronous request concurrency via Starlette/FastAPI.
2. **Persistent Location**:
   The SQLite file is located at `/var/lib/auryvex/auryvex.db` — outside the code directory — ensuring deployments and git pulls do not touch the database file.
3. **WAL Mode**:
   Write-Ahead Logging is automatically activated in `database.py` via `PRAGMA journal_mode=WAL;`. This permits concurrent reads while a write is occurring.
4. **Maintenance Windows for Migrations**:
   Run schema migrations (`alembic upgrade head`) during low-traffic maintenance windows.

---

## 8. Backup and Restore Procedures

### Automated Daily Backup (`/etc/cron.daily/auryvex-backup`)
Create `/etc/cron.daily/auryvex-backup` with permissions `750`:

```bash
#!/bin/bash
set -euo pipefail

DATE=$(date +%Y-%m-%d_%H%M%S)
DB="/var/lib/auryvex/auryvex.db"
DEST="/var/backups/auryvex"

mkdir -p "$DEST"

# SQLite online backup API ensures safe backup during active operations
sqlite3 "$DB" ".backup '$DEST/auryvex-$DATE.db'"
chmod 600 "$DEST/auryvex-$DATE.db"

# Retain backups for 30 days
find "$DEST" -name "auryvex-*.db" -mtime +30 -delete
```

### Restore Procedure

```bash
# 1. Stop backend service
sudo systemctl stop auryvex-backend

# 2. Select backup file
RESTORE_FILE="/var/backups/auryvex/auryvex-2026-01-01_020000.db"

# 3. Overwrite active database file
sudo cp "$RESTORE_FILE" /var/lib/auryvex/auryvex.db
sudo chown auryvex:auryvex /var/lib/auryvex/auryvex.db
sudo chmod 660 /var/lib/auryvex/auryvex.db

# 4. Verify integrity
sqlite3 /var/lib/auryvex/auryvex.db "PRAGMA integrity_check;"
sqlite3 /var/lib/auryvex/auryvex.db "SELECT count(*) FROM enquiries;"

# 5. Restart backend service
sudo systemctl start auryvex-backend
```

---

## 9. Future: SQLite → PostgreSQL Migration Plan

The codebase uses **synchronous SQLAlchemy 2.0**. Transitioning to PostgreSQL requires **no asynchronous rewrite** — only a driver and connection string swap.

### Step 1: Install PostgreSQL Driver
```bash
source .venv/bin/activate
pip install psycopg2-binary
```

### Step 2: Configure PostgreSQL
Create database and user:
```bash
sudo -u postgres psql -c "CREATE DATABASE auryvex;"
sudo -u postgres psql -c "CREATE USER auryvex WITH ENCRYPTED PASSWORD 'secret';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE auryvex TO auryvex;"
```

### Step 3: Data Migration via `pgloader`
```bash
sudo apt install -y pgloader
pgloader sqlite:///var/lib/auryvex/auryvex.db postgresql://auryvex:secret@localhost/auryvex
```

### Step 4: Verification
```bash
# Compare row counts
sqlite3 /var/lib/auryvex/auryvex.db "SELECT count(*) FROM enquiries;"
psql -U auryvex -d auryvex -c "SELECT count(*) FROM enquiries;"
```

### Step 5: Switch Application Connection
Update `backend/.env`:
```bash
DATABASE_URL=postgresql+psycopg2://auryvex:secret@localhost/auryvex
```
In `database.py`, SQLite-specific arguments (`check_same_thread`, `PRAGMA journal_mode=WAL`) are already conditionally applied only when `sqlite` is detected in `DATABASE_URL`.

### Step 6: Scaling after PostgreSQL
Once on PostgreSQL, increase Uvicorn workers in `/etc/systemd/system/auryvex-backend.service`:
```ini
ExecStart=/srv/auryvex/backend/.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --workers 4
```
Restart service with `sudo systemctl daemon-reload && sudo systemctl restart auryvex-backend`.
