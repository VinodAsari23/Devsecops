"""Papers router - CRUD + search. MSc Cloud DevOpsSec - Research Paper Annotation Tool"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from app.database import get_db
from app.models import Paper, User
from app.schemas import PaperRequest, PaperResponse, SearchResponse
from app.auth import get_current_user

router = APIRouter(prefix="/api/papers", tags=["Papers"])

def to_response(p: Paper) -> dict:
    return {"id": p.id, "title": p.title, "authors": p.authors, "abstract": p.abstract or "",
            "publicationUrl": p.publication_url or "", "publicationYear": p.publication_year,
            "createdAt": p.created_at, "annotationCount": len(p.annotations) if p.annotations else 0}

@router.get("", response_model=List[PaperResponse])
def get_papers(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return [to_response(p) for p in db.query(Paper).filter(Paper.owner_id == user.id).order_by(Paper.created_at.desc()).all()]

@router.get("/search", response_model=SearchResponse)
def search_papers(q: str = Query(..., min_length=1), db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Search papers by title or authors (non-CRUD functionality)."""
    results = db.query(Paper).filter(Paper.owner_id == user.id, or_(Paper.title.ilike(f"%{q}%"), Paper.authors.ilike(f"%{q}%"))).all()
    return {"papers": [to_response(p) for p in results], "query": q, "totalResults": len(results)}

@router.get("/{pid}", response_model=PaperResponse)
def get_paper(pid: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    p = db.query(Paper).filter(Paper.id == pid, Paper.owner_id == user.id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paper not found")
    return to_response(p)

@router.post("", response_model=PaperResponse, status_code=201)
def create_paper(req: PaperRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    dup = db.query(Paper).filter(Paper.owner_id == user.id, Paper.title == req.title).first()
    if dup:
        raise HTTPException(status_code=409, detail="A paper with this title already exists")
    p = Paper(title=req.title, authors=req.authors, abstract=req.abstract or "", publication_url=req.publicationUrl or "",
              publication_year=req.publicationYear, owner_id=user.id)
    db.add(p)
    db.commit()
    db.refresh(p)
    return to_response(p)

@router.put("/{pid}", response_model=PaperResponse)
def update_paper(pid: int, req: PaperRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    p = db.query(Paper).filter(Paper.id == pid, Paper.owner_id == user.id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paper not found")
    p.title = req.title
    p.authors = req.authors
    p.abstract = req.abstract or ""
    p.publication_url = req.publicationUrl or ""
    p.publication_year = req.publicationYear
    db.commit()
    db.refresh(p)
    return to_response(p)

@router.delete("/{pid}", status_code=204)
def delete_paper(pid: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    p = db.query(Paper).filter(Paper.id == pid, Paper.owner_id == user.id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paper not found")
    db.delete(p)
    db.commit()
