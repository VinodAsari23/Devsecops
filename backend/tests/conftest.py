"""Test fixtures. MSc Cloud DevOpsSec - Research Paper Annotation Tool"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.database import Base, get_db
from app.auth import hash_password, create_access_token
from app.models import User, UserRole, Paper

engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db():
    s = TestSession()
    try: yield s
    finally: s.close()

@pytest.fixture
def client(db):
    def override():
        try: yield db
        finally: pass
    app.dependency_overrides[get_db] = override
    with TestClient(app) as c: yield c
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(db):
    u = User(username="testuser", email="test@test.com", password_hash=hash_password("password123"), role=UserRole.RESEARCHER)
    db.add(u); db.commit(); db.refresh(u); return u

@pytest.fixture
def auth_headers(test_user):
    return {"Authorization": f"Bearer {create_access_token(data={'sub': test_user.username, 'role': 'RESEARCHER'})}"}

@pytest.fixture
def test_paper(db, test_user):
    p = Paper(title="Test Paper Title Here", authors="Author One, Author Two", abstract="Test abstract",
              publication_url="https://example.com", publication_year=2024, owner_id=test_user.id)
    db.add(p); db.commit(); db.refresh(p); return p
