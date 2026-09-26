from typing import List
from pydantic import BaseModel, Field

class ResumeMatchSchema(BaseModel):
    score: int = Field(
        ..., 
        ge=0, 
        le=100, 
        description="Overall resume ATS compatibility score between 0 and 100"
    )
    matched_skills: List[str] = Field(
        ..., 
        description="List of skills explicitly present in both the candidate resume and JD"
    )
    gaps: List[str] = Field(
        ..., 
        description="List of required or nice-to-have skills/qualifications missing from the resume"
    )
    summary: str = Field(
        ..., 
        description="A concise 2-3 sentence overview explaining the score and key strengths/weaknesses"
    )

class AnswerScoreSchema(BaseModel):
    score: int = Field(
        ..., 
        ge=0, 
        le=5, 
        description="Score awarded for the answer from 0 to 5 based on the rubric"
    )
    justification: str = Field(
        ..., 
        description="1-2 sentence concise technical justification explaining why this score was awarded"
    )
    confidence: float = Field(
        ..., 
        ge=0.0, 
        le=1.0, 
        description="Confidence level of the LLM evaluation between 0.0 and 1.0"
    )
    rubric_hits: List[str] = Field(
        ..., 
        description="Specific rubric key criteria points met or missed by the response"
    )