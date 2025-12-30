Pythonfrom fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import Lead, SessionLocal
from grok_client import qualify_lead, generate_outreach

app = FastAPI(title="Grok SDR Tool")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class LeadCreate(BaseModel):
    name: str
    company: str
    title: str
    linkedin: str | None = None

class LeadUpdate(BaseModel):
    status: str | None = None

class QualifyRequest(BaseModel):
    lead_id: int
    icp: str
    model: str = "grok-4"

class OutreachRequest(BaseModel):
    lead_id: int
    model: str = "grok-4"

@app.get("/leads")
def get_leads(db: Session = Depends(get_db)):
    return db.query(Lead).all()

@app.post("/leads")
def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    db_lead = Lead(**lead.dict(), status="New")
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@app.post("/qualify")
def qualify(request: QualifyRequest, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == request.lead_id).first()
    if not lead:
        return {"error": "Lead not found"}
    
    result = qualify_lead(lead.__dict__, request.icp, request.model)
    lead.qualification_score = result["score"]
    lead.qualification_reason = result["reason"]
    lead.status = "Qualified" if result["qualified"] else "New"
    db.commit()
    return {"lead": lead, "qualification": result}

@app.post("/outreach")
def outreach(request: OutreachRequest, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == request.lead_id).first()
    if not lead:
        return {"error": "Lead not found"}
    
    email = generate_outreach(lead.__dict__, request.model)
    return {"email": email}

@app.patch("/leads/{lead_id}")
def update_lead(lead_id: int, update: LeadUpdate, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if lead and update.status:
        lead.status = update.status
        db.commit()
    return lead
