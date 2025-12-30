from fastapi import FastAPI
from pydantic import BaseModel
from grok_client import qualify_lead, generate_outreach

app = FastAPI()

class Lead(BaseModel):
    name: str
    company: str
    title: str
    linkedin: str | None

@app.post("/qualify")
def qualify(lead: Lead, icp: str):
    result = qualify_lead(lead.dict(), icp)
    # Save to DB...
    return result
