"""Paper CRUD + search tests."""
def test_create(client, auth_headers):
    r = client.post("/api/papers", json={"title":"My Research Paper","authors":"John Doe","publicationYear":2024}, headers=auth_headers)
    assert r.status_code == 201 and r.json()["title"] == "My Research Paper"
def test_list(client, auth_headers):
    assert client.get("/api/papers", headers=auth_headers).status_code == 200
def test_get(client, auth_headers, test_paper):
    assert client.get(f"/api/papers/{test_paper.id}", headers=auth_headers).status_code == 200
def test_update(client, auth_headers, test_paper):
    r = client.put(f"/api/papers/{test_paper.id}", json={"title":"Updated Title Paper","authors":"New Author","publicationYear":2025}, headers=auth_headers)
    assert r.status_code == 200 and r.json()["title"] == "Updated Title Paper"
def test_delete(client, auth_headers, test_paper):
    assert client.delete(f"/api/papers/{test_paper.id}", headers=auth_headers).status_code == 204
def test_not_found(client, auth_headers):
    assert client.get("/api/papers/99999", headers=auth_headers).status_code == 404
def test_duplicate_title(client, auth_headers, test_paper):
    r = client.post("/api/papers", json={"title":"Test Paper Title Here","authors":"Someone","publicationYear":2024}, headers=auth_headers)
    assert r.status_code == 409
def test_search(client, auth_headers, test_paper):
    r = client.get("/api/papers/search?q=Test", headers=auth_headers)
    assert r.status_code == 200 and r.json()["totalResults"] >= 1
def test_search_no_results(client, auth_headers):
    r = client.get("/api/papers/search?q=zzzznonexistent", headers=auth_headers)
    assert r.status_code == 200 and r.json()["totalResults"] == 0
def test_auth_required(client):
    assert client.get("/api/papers").status_code in [401, 403]
