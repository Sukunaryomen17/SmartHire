from typing import Any, List, Optional
from pydantic import BaseModel, Field

class ResumeMatchSchema(BaseModel):
    score: int = Field(..., ge=0, le=100)
    matched_skills: List[str]
    gaps: List[str]
    summary: str

class AnswerScoreSchema(BaseModel):
    score: int = Field(..., ge=0, le=5)
    justification: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    rubric_hits: List[str]

class JobDescription(BaseModel):
    title: str = ""
    must_have: List[str] = Field(default_factory=list)
    nice_to_have: List[str] = Field(default_factory=list)
    experience_years: Optional[float] = None
    education: str = ""
    location: str = ""
    summary: str = ""

class ResumeMatchRequest(BaseModel):
    candidate_id: str
    jd_id: str
    job_description: JobDescription
    resume: str = Field(..., min_length=1)

class ResumeMatchResponse(BaseModel):
    candidate_id: str
    jd_id: str
    score: int = Field(..., ge=0, le=100)
    matched_skills: List[str]
    gaps: List[str]
    summary: str

class AnswerScoreRequest(BaseModel):
    question_data: dict[str, Any]
    candidate_answer: str

class ResumeRequirement(BaseModel):
    name: str
    category: str
    status: str
    evidence: str = ""

class ExperienceAnalysis(BaseModel):
    required_years: float = 0
    candidate_years: float = 0
    evidence: str = ""

class EducationAnalysis(BaseModel):
    status: str = "not_applicable"
    evidence: str = ""

class ResponsibilityAnalysis(BaseModel):
    name: str
    status: str
    evidence: str = ""

class ResumeAnalysis(BaseModel):
    requirements: List[ResumeRequirement] = Field(default_factory=list)
    experience: ExperienceAnalysis = Field(default_factory=ExperienceAnalysis)
    education: EducationAnalysis = Field(default_factory=EducationAnalysis)
    responsibility_alignment: List[ResponsibilityAnalysis] = Field(default_factory=list)
    summary: str = ""
