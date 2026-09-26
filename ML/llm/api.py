from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from llm.answer_score import score_answer
from llm.schemas import AnswerScoreSchema

app = FastAPI(
    title="SMART-HIRE LLM Service",
    version="1.0.0"
)

class ScoreRequest(BaseModel):
    question_data: dict
    candidate_answer: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/score-answer", response_model=AnswerScoreSchema)
def score(request: ScoreRequest):
    try:
        return score_answer(
            request.question_data,
            request.candidate_answer
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Scoring failed: {str(e)}"
        )