"""
CLI utility to create or update an administrator account without hardcoded credentials.

Usage:
    python create_admin.py
    python create_admin.py --username <username> --password <password>
"""

import argparse
import getpass
import sys
from auth import hash_password
from database import SessionLocal
from models import User


def main():
    parser = argparse.ArgumentParser(description="Create or update an Auryvex administrator user.")
    parser.add_argument("--username", "-u", type=str, help="Administrator username")
    parser.add_argument("--password", "-p", type=str, help="Administrator password")

    args = parser.parse_args()

    username = args.username
    password = args.password

    # If username not provided, prompt interactively
    if not username:
        try:
            username = input("Enter admin username: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nAborted.")
            sys.exit(1)

    if not username:
        print("Error: Username cannot be empty.", file=sys.stderr)
        sys.exit(1)

    # If password not provided, prompt securely interactively
    if not password:
        try:
            password = getpass.getpass("Enter admin password: ")
            confirm = getpass.getpass("Confirm admin password: ")
            if password != confirm:
                print("Error: Passwords do not match.", file=sys.stderr)
                sys.exit(1)
        except (KeyboardInterrupt, EOFError):
            print("\nAborted.")
            sys.exit(1)

    if len(password) < 8:
        print("Error: Password must be at least 8 characters long.", file=sys.stderr)
        sys.exit(1)

    # Database operation
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        hashed = hash_password(password)

        if user:
            user.hashed_password = hashed
            action = "updated"
        else:
            user = User(username=username, hashed_password=hashed)
            db.add(user)
            action = "created"

        db.commit()
        print(f"Success: Administrator user '{username}' has been {action}.")
    except Exception as e:
        db.rollback()
        print(f"Error: Failed to save user: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
