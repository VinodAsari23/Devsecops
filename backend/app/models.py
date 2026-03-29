"""SQLAlchemy Models - User, Paper, Annotation. MSc Cloud DevOpsSec - Research Paper Annotation Tool"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Enum, Boolean
from sqlalchemy.orm import relationship
import enum
from app.database import Base

class UserRole(str, enum.Enum):
    RESEARCHER = "RESEARCHER"
    ADMIN = "ADMIN"

class AnnotationCategory(str, enum.Enum):
    KEY_FINDING = "KEY_FINDING"
    METHODOLOGY = "METHODOLOGY"
    QUESTION = "QUESTION"
    CRITIQUE = "CRITIQUE"
    REFERENCE = "REFERENCE"
    OTHER = "OTHER"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.RESEARCHER, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    papers = relationship("Paper", back_populates="owner", cascade="all, delete-orphan")

class Paper(Base):
    __tablename__ = "papers"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    authors = Column(String(500), nullable=False)
    abstract = Column(Text, nullable=True)
    publication_url = Column(String(500), nullable=True)
    publication_year = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="papers")
    annotations = relationship("Annotation", back_populates="paper", cascade="all, delete-orphan")

class Annotation(Base):
    __tablename__ = "annotations"
    id = Column(Integer, primary_key=True, index=True)
    highlighted_text = Column(Text, nullable=False)
    annotation_note = Column(Text, nullable=False)
    category = Column(Enum(AnnotationCategory), default=AnnotationCategory.OTHER, nullable=False)
    page_number = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    paper_id = Column(Integer, ForeignKey("papers.id"), nullable=False)
    paper = relationship("Paper", back_populates="annotations")
