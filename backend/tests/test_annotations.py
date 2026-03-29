"""Annotation CRUD tests."""
def test_create(client, auth_headers, test_paper):
    r = client.post(f"/api/papers/{test_paper.id}/annotations", json={
        "highlightedText":"Important finding here","annotationNote":"This is significant","category":"KEY_FINDING","pageNumber":5
    }, headers=auth_headers)
    assert r.status_code == 201 and r.json()["category"] == "KEY_FINDING"
def test_list(client, auth_headers, test_paper):
    assert client.get(f"/api/papers/{test_paper.id}/annotations", headers=auth_headers).status_code == 200
def test_update(client, auth_headers, test_paper):
    cr = client.post(f"/api/papers/{test_paper.id}/annotations", json={
        "highlightedText":"Old text here","annotationNote":"Old note","category":"OTHER"
    }, headers=auth_headers)
    aid = cr.json()["id"]
    r = client.put(f"/api/papers/{test_paper.id}/annotations/{aid}", json={
        "highlightedText":"Updated text here","annotationNote":"Updated note","category":"CRITIQUE"
    }, headers=auth_headers)
    assert r.status_code == 200 and r.json()["category"] == "CRITIQUE"
def test_delete(client, auth_headers, test_paper):
    cr = client.post(f"/api/papers/{test_paper.id}/annotations", json={
        "highlightedText":"Delete this text","annotationNote":"To delete","category":"OTHER"
    }, headers=auth_headers)
    assert client.delete(f"/api/papers/{test_paper.id}/annotations/{cr.json()['id']}", headers=auth_headers).status_code == 204
def test_not_found(client, auth_headers, test_paper):
    assert client.get(f"/api/papers/{test_paper.id}/annotations").status_code in [401, 403]
