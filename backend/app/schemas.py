"""Pydantic Schemas. MSc Cloud DevOpsSec - Research Paper Annotation Tool"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

class SignupRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)

class AuthResponse(BaseModel):
    token: str
    username: str
    role: str

class MessageResponse(BaseModel):
    message: str

class PaperRequest(BaseModel):
    title: str = Field(..., min_length=5, max_length=300)
    authors: str = Field(..., min_length=2, max_length=500)
    abstract: Optional[str] = ""
    publicationUrl: Optional[str] = ""
    publicationYear: int = Field(..., ge=1900, le=2030)

class PaperResponse(BaseModel):
    id: int
    title: str
    authors: str
    abstract: Optional[str] = None
    publicationUrl: Optional[str] = None
    publicationYear: int
    createdAt: Optional[datetime] = None
    annotationCount: Optional[int] = 0

class AnnotationRequest(BaseModel):
    highlightedText: str = Field(..., min_length=3, max_length=2000)
    annotationNote: str = Field(..., min_length=2, max_length=5000)
    category: str = Field(default="OTHER")
    pageNumber: Optional[int] = Field(default=None, ge=1, le=10000)

class AnnotationResponse(BaseModel):
    id: int
    highlightedText: str
    annotationNote: str
    category: str
    pageNumber: Optional[int] = None
    createdAt: Optional[datetime] = None
    paperId: int

class SearchResponse(BaseModel):
    papers: List[PaperResponse]
    query: str
    totalResults: int
