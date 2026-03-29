"""Annotations router - CRUD per paper. MSc Cloud DevOpsSec - Research Paper Annotation Tool"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Paper, Annotation, AnnotationCategory, User
from app.schemas import AnnotationRequest, AnnotationResponse
from app.auth import get_current_user

router = APIRouter(prefix="/api/papers/{paper_id}/annotations", tags=["Annotations"])

def to_response(a: Annotation) -> dict:
    return {"id": a.id, "highlightedText": a.highlighted_text, "annotationNote": a.annotation_note,
            "category": a.category.value, "pageNumber": a.page_number, "createdAt": a.created_at, "paperId": a.paper_id}

def get_user_paper(paper_id: int, db: Session, user: User) -> Paper:
    p = db.query(Paper).filter(Paper.id == paper_id, Paper.owner_id == user.id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paper not found")
    return p

@router.get("", response_model=List[AnnotationResponse])
def get_annotations(paper_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    p = get_user_paper(paper_id, db, user)
    return [to_response(a) for a in p.annotations]

@router.post("", response_model=AnnotationResponse, status_code=201)
def create_annotation(paper_id: int, req: AnnotationRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    p = get_user_paper(paper_id, db, user)
    cat = AnnotationCategory.OTHER
    if req.category in [c.value for c in AnnotationCategory]:
        cat = AnnotationCategory(req.category)
    a = Annotation(highlighted_text=req.highlightedText, annotation_note=req.annotationNote,
                   category=cat, page_number=req.pageNumber, paper_id=p.id)
    db.add(a)
    db.commit()
    db.refresh(a)
    return to_response(a)

@router.put("/{ann_id}", response_model=AnnotationResponse)
def update_annotation(paper_id: int, ann_id: int, req: AnnotationRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    p = get_user_paper(paper_id, db, user)
    a = db.query(Annotation).filter(Annotation.id == ann_id, Annotation.paper_id == p.id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Annotation not found")
    a.highlighted_text = req.highlightedText
    a.annotation_note = req.annotationNote
    if req.category in [c.value for c in AnnotationCategory]:
        a.category = AnnotationCategory(req.category)
    a.page_number = req.pageNumber
    db.commit()
    db.refresh(a)
    return to_response(a)

@router.delete("/{ann_id}", status_code=204)
def delete_annotation(paper_id: int, ann_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    p = get_user_paper(paper_id, db, user)
    a = db.query(Annotation).filter(Annotation.id == ann_id, Annotation.paper_id == p.id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Annotation not found")
    db.delete(a)
    db.commit()
