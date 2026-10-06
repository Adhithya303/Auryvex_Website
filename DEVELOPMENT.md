# Auryvex — Developer Documentation

Welcome to the development documentation for the Auryvex company website and customer enquiry portal.

---

## Architecture Overview

- **Frontend**: React 18, TypeScript, Vite, React Router 6, Vanilla CSS design tokens.
- **Backend**: FastAPI, SQLAlchemy 2.0 (synchronous), Pydantic v2, Python-Jose (JWT), Passlib / Bcrypt.
- **Database**: SQLite (local dev & single-server prod) with Write-Ahead Logging (WAL) enabled.
- **Authentication**: Stateless signed JWT stored in an HttpOnly, SameSite=Strict cookie.
- **CSRF Protection**: Double-submit CSRF cookie read and submitted via `X-CSRF-Token` header on state-changing requests (`POST`, `PATCH`).
- **Rate Limiting**: In-memory rate limiting per client IP on login attempts (5 fails / 15 mins) and enquiry submissions (1 / 60 seconds).

---

## Local Startup Commands

### Terminal 1 — Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate        # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env            # On Windows PowerShell: Copy-Item .env.example .env

# Apply database migrations
alembic upgrade head

# Start API server on port 8000
uvicorn main:app --reload --port 8000
```

The API will be available at `http://127.0.0.1:8000`.  
Interactive OpenAPI documentation is available at `http://127.0.0.1:8000/api/docs`.

### Terminal 2 — Frontend

```bash
cd frontend

# Install Node dependencies
npm install

# Configure environment
cp .env.example .env.local      # On Windows PowerShell: Copy-Item .env.example .env.local

# Start Vite dev server
npm run dev
```

Visit `http://localhost:5173` in your browser. All requests to `/api` are automatically proxied to the backend at `http://127.0.0.1:8000`.

---

## Database Migrations (Alembic)

When modifying or adding SQLAlchemy models in `backend/models.py`:

```bash
cd backend
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# Generate migration revision automatically from models
alembic revision --autogenerate -m "describe the change"

# Apply all pending migrations to the database
alembic upgrade head

# Roll back the most recent migration step
alembic downgrade -1
```

---

## Running Tests and Validation

### Backend Tests
```bash
cd backend
python -m pytest -q
```

All 10 integration and unit tests verify:
- API health check
- Admin login with HttpOnly session and CSRF cookie issuance
- Failed login rejection and brute-force rate limiting
- Protected endpoint rejection on unauthenticated or tampered sessions
- Enquiry creation with server-side validation and no PII leakage in responses
- Enquiry submission rate limiting
- Full admin enquiry management (list, detail, CSRF-protected PATCH update, logout)

### Frontend Build & Type Check
```bash
cd frontend
npm run build
```

---

## Design System & Brand Configuration

- **Brand settings**: Located at `frontend/src/config/brand.ts`. Single source of truth for company name, tagline, email, confirmed services, budget brackets, and concept projects.
- **Design system CSS**: Defined in `frontend/src/index.css`. Uses strict CSS variables for typography scale (Inter font), 8px-based spacing tokens (`--space-1` through `--space-24`), and color tokens (`--color-accent`, surface, text, and alert tokens).
- **Reduced motion**: All micro-animations and transitions respect `@media (prefers-reduced-motion: no-preference)`.

---

## Future Considerations

### Future: Prerendering
Currently, the public marketing pages are rendered by Vite as a single-page application (SPA). For improved SEO and initial paint performance on slow connections, future phases can evaluate:
1. Static Site Generation (SSG) via `vite-plugin-ssr` / `vike`.
2. Migrating marketing routes to a framework like Next.js or Astro while keeping the FastAPI backend for enquiries and administrative functions.

### Future: PostgreSQL Migration
The SQLAlchemy database layer uses standard synchronous operations compatible with PostgreSQL. When ready to scale beyond a single server or when concurrent write volumes require a multi-worker setup:
1. Install `psycopg2-binary`.
2. Update `DATABASE_URL` in `.env` to `postgresql+psycopg2://user:password@host/auryvex`.
3. Use `pgloader` to migrate existing SQLite data without schema friction.
4. Increase Uvicorn workers (`--workers 4`).  
See `HOSTING.md` Section 9 for step-by-step instructions.
