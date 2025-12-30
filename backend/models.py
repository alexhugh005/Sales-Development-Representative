from sqlalchemy import create_engine, Column, Integer, String, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import enum

DATABASE_URL = "sqlite:///./leads.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class LeadStatus(str, enum.Enum):
    new = "New"
    qualified = "Qualified"
    contacted = "Contacted"
    meeting_booked = "Meeting Booked"

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    company = Column(String)
    title = Column(String)
    linkedin = Column(String, nullable=True)
    status = Column(Enum(LeadStatus), default=LeadStatus.new)
    qualification_score = Column(Integer, nullable=True)
    qualification_reason = Column(String, nullable=True)

Base.metadata.create_all(bind=engine)
