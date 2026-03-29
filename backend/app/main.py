"""FastAPI Entry Point with demo data seeding. MSc Cloud DevOpsSec - Research Paper Annotation Tool"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import User, Paper, Annotation, UserRole, AnnotationCategory
from app.auth import hash_password
from app.routers import auth, papers, annotations

app = FastAPI(title=settings.APP_NAME, version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(auth.router)
app.include_router(papers.router)
app.include_router(annotations.router)

def seed_demo_data():
    db = SessionLocal()
    try:
        if db.query(User).filter(User.username == "examiner").first():
            return
        admin = User(username="examiner", email="examiner@nci.ie",
                     password_hash=hash_password("Research@Tool2024"), role=UserRole.ADMIN)
        db.add(admin)
        db.flush()

        p1 = Paper(title="DevSecOps: A Multivocal Literature Review",
                   authors="Myrbakken, T. and Colomo-Palacios, R.",
                   abstract="This paper presents a systematic multivocal literature review of DevSecOps practices and their adoption in modern software development.",
                   publication_url="https://doi.org/10.1007/978-3-319-67383-7_2",
                   publication_year=2017, owner_id=admin.id)
        p2 = Paper(title="Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation",
                   authors="Humble, J. and Farley, D.",
                   abstract="This book sets out principles and practices that enable rapid incremental delivery of high-quality software.",
                   publication_url="https://www.oreilly.com/library/view/continuous-delivery/9780321601919/",
                   publication_year=2010, owner_id=admin.id)
        p3 = Paper(title="The NIST Definition of Cloud Computing",
                   authors="Mell, P. and Grance, T.",
                   abstract="Cloud computing is a model for enabling ubiquitous, convenient, on-demand network access to a shared pool of configurable computing resources.",
                   publication_url="https://doi.org/10.6028/NIST.SP.800-145",
                   publication_year=2011, owner_id=admin.id)
        db.add_all([p1, p2, p3])
        db.flush()

        anns = [
            Annotation(highlighted_text="DevSecOps integrates security practices within the DevOps pipeline",
                       annotation_note="Core definition - security as integral part of CI/CD, not bolted on afterwards",
                       category=AnnotationCategory.KEY_FINDING, page_number=3, paper_id=p1.id),
            Annotation(highlighted_text="shifting security left in the development lifecycle",
                       annotation_note="Key concept - earlier detection reduces remediation cost by orders of magnitude",
                       category=AnnotationCategory.METHODOLOGY, page_number=5, paper_id=p1.id),
            Annotation(highlighted_text="How does automated security scanning compare to manual code review?",
                       annotation_note="Open research question for further investigation",
                       category=AnnotationCategory.QUESTION, page_number=12, paper_id=p1.id),
            Annotation(highlighted_text="Every change should trigger the feedback process",
                       annotation_note="Foundation principle of continuous delivery - fast feedback loops",
                       category=AnnotationCategory.KEY_FINDING, page_number=24, paper_id=p2.id),
            Annotation(highlighted_text="deployment pipeline as a central part of the build process",
                       annotation_note="Pipeline-as-code concept that predates GitHub Actions",
                       category=AnnotationCategory.REFERENCE, page_number=106, paper_id=p2.id),
            Annotation(highlighted_text="five essential characteristics of cloud computing",
                       annotation_note="On-demand self-service, broad network access, resource pooling, rapid elasticity, measured service",
                       category=AnnotationCategory.KEY_FINDING, page_number=2, paper_id=p3.id),
        ]
        db.add_all(anns)
        db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()

@app.on_event("startup")
def on_startup():
    try:
        Base.metadata.create_all(bind=engine)
        seed_demo_data()
    except Exception:
        pass

@app.get("/actuator/health")
def health_check():
    return {"status": "UP", "application": settings.APP_NAME}
