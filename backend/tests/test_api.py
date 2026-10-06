import pytest
from fastapi.testclient import TestClient


def test_health(client: TestClient):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_login_success(client: TestClient):
    res = client.post("/api/auth/login", json={"username": "admin", "password": "adminpassword123"})
    assert res.status_code == 200
    assert res.json() == {"ok": True}
    assert "session" in res.cookies
    assert "csrf_token" in res.cookies


def test_login_failure(client: TestClient):
    res = client.post("/api/auth/login", json={"username": "admin", "password": "wrongpassword"})
    assert res.status_code == 401


def test_login_rate_limiting(client: TestClient):
    headers = {"X-Forwarded-For": "192.168.1.100"}
    for _ in range(5):
        res = client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "wrongpassword"},
            headers=headers,
        )
        assert res.status_code == 401

    # 6th attempt should be blocked
    res_blocked = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "wrongpassword"},
        headers=headers,
    )
    assert res_blocked.status_code == 429


def test_unauthenticated_access_rejected(client: TestClient):
    res = client.get("/api/enquiries")
    assert res.status_code == 401

    res_me = client.get("/api/auth/me")
    assert res_me.status_code == 401


def test_tampered_session_cookie(client: TestClient):
    client.cookies.set("session", "invalid.jwt.token")
    res = client.get("/api/enquiries")
    assert res.status_code == 401


def test_enquiry_submission_valid(client: TestClient):
    payload = {
        "name": "Sarah Connor",
        "email": "sarah@example.com",
        "company": "Cyberdyne Systems",
        "service": "Custom Web Applications",
        "message": "We need a secure internal workflow management system for our engineering team.",
        "budget": "20k_50k",
        "timeline": "1_3_months",
    }
    res = client.post("/api/enquiries", json=payload, headers={"X-Forwarded-For": "10.0.0.1"})
    assert res.status_code == 201
    data = res.json()
    assert "id" in data
    assert "created_at" in data
    # Must not leak PII in response
    assert "name" not in data
    assert "email" not in data
    assert "message" not in data


def test_enquiry_submission_validation(client: TestClient):
    # Missing required name
    res = client.post(
        "/api/enquiries",
        json={"name": "", "email": "valid@email.com", "message": "This is a sufficiently long message."},
        headers={"X-Forwarded-For": "10.0.0.2"},
    )
    assert res.status_code == 422

    # Invalid email
    res = client.post(
        "/api/enquiries",
        json={"name": "Alice", "email": "not-an-email", "message": "This is a sufficiently long message."},
        headers={"X-Forwarded-For": "10.0.0.3"},
    )
    assert res.status_code == 422

    # Short message (< 20 chars)
    res = client.post(
        "/api/enquiries",
        json={"name": "Alice", "email": "alice@test.com", "message": "Too short"},
        headers={"X-Forwarded-For": "10.0.0.4"},
    )
    assert res.status_code == 422


def test_enquiry_submission_rate_limiting(client: TestClient):
    payload = {
        "name": "Bob Dylan",
        "email": "bob@example.com",
        "message": "This is the first enquiry which is at least 20 chars long.",
    }
    ip_headers = {"X-Forwarded-For": "10.0.0.5"}

    res1 = client.post("/api/enquiries", json=payload, headers=ip_headers)
    assert res1.status_code == 201

    # Second immediate submission from same IP should be rate limited
    res2 = client.post("/api/enquiries", json=payload, headers=ip_headers)
    assert res2.status_code == 429


def test_admin_enquiries_management_flow(client: TestClient):
    # 1. Submit an enquiry
    submit_res = client.post(
        "/api/enquiries",
        json={
            "name": "Jane Developer",
            "email": "jane@dev.com",
            "company": "Dev Co",
            "service": "Internal Tools & Automation",
            "message": "Looking for a custom dashboard tool to monitor our operational queues.",
        },
        headers={"X-Forwarded-For": "10.0.0.6"},
    )
    assert submit_res.status_code == 201
    enquiry_id = submit_res.json()["id"]

    # 2. Login as admin
    login_res = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "adminpassword123"},
        headers={"X-Forwarded-For": "10.0.0.7"},
    )
    assert login_res.status_code == 200
    csrf_token = login_res.cookies.get("csrf_token")
    assert csrf_token is not None

    # 3. List enquiries
    list_res = client.get("/api/enquiries")
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert list_data["total"] >= 1
    found = next((item for item in list_data["items"] if item["id"] == enquiry_id), None)
    assert found is not None
    assert found["name"] == "Jane Developer"
    assert "message" not in found  # List view must not return message body

    # 4. Get enquiry detail
    detail_res = client.get(f"/api/enquiries/{enquiry_id}")
    assert detail_res.status_code == 200
    detail_data = detail_res.json()
    assert detail_data["message"] == "Looking for a custom dashboard tool to monitor our operational queues."
    assert detail_data["status"] == "new"

    # 5. Patch enquiry without CSRF token -> 403
    patch_no_csrf = client.patch(
        f"/api/enquiries/{enquiry_id}",
        json={"status": "in_progress", "notes": "Contacted client by email."},
    )
    assert patch_no_csrf.status_code == 403

    # 6. Patch enquiry with CSRF mismatch -> 403
    patch_bad_csrf = client.patch(
        f"/api/enquiries/{enquiry_id}",
        json={"status": "in_progress"},
        headers={"X-CSRF-Token": "bad-csrf-token"},
    )
    assert patch_bad_csrf.status_code == 403

    # 7. Patch enquiry with valid CSRF header -> 200
    patch_ok = client.patch(
        f"/api/enquiries/{enquiry_id}",
        json={"status": "in_progress", "notes": "First discovery call scheduled."},
        headers={"X-CSRF-Token": csrf_token},
    )
    assert patch_ok.status_code == 200
    updated_data = patch_ok.json()
    assert updated_data["status"] == "in_progress"
    assert updated_data["notes"] == "First discovery call scheduled."

    # 8. Logout
    logout_res = client.post("/api/auth/logout")
    assert logout_res.status_code == 200

    # 9. Verify unauthenticated after logout
    after_logout = client.get("/api/enquiries")
    assert after_logout.status_code == 401
