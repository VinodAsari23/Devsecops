"""Auth tests."""
def test_signup(client):
    assert client.post("/api/auth/signup", json={"username":"newuser","email":"new@test.com","password":"Pass@123"}).status_code == 201
def test_signup_dup(client, test_user):
    assert client.post("/api/auth/signup", json={"username":"testuser","email":"x@test.com","password":"Pass@123"}).status_code == 400
def test_signup_bad_email(client):
    assert client.post("/api/auth/signup", json={"username":"newuser","email":"bad","password":"Pass@123"}).status_code == 422
def test_login(client, test_user):
    r = client.post("/api/auth/login", json={"username":"testuser","password":"Password@123"})
    assert r.status_code == 200 and "token" in r.json()
def test_login_wrong(client, test_user):
    assert client.post("/api/auth/login", json={"username":"testuser","password":"Wrong@pass123"}).status_code == 401
