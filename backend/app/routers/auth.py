"""Auth router. MSc Cloud DevOpsSec - Research Paper Annotation Tool"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserRole
from app.schemas import SignupRequest, LoginRequest, AuthResponse, MessageResponse
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup", response_model=MessageResponse, status_code=201)
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    # Store username in title case for proper display
    display_name = req.username.title()
    # Check uniqueness case-insensitively
    if db.query(User).filter(User.username.ilike(req.username)).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    db.add(User(username=display_name, email=req.email, password_hash=hash_password(req.password), role=UserRole.RESEARCHER))
    db.commit()
    return {"message": "User registered successfully"}

@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # Case-insensitive login lookup
    user = db.query(User).filter(User.username.ilike(req.username)).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"token": create_access_token(data={"sub": user.username, "role": user.role.value}), "username": user.username, "role": user.role.value}
