import logging
from fastapi import FastAPI, HTTPException
from llm.answer_score import score_answer
from llm.resume_match import score_resume
from llm.schemas import (
    AnswerScoreRequest, AnswerScoreSchema,
    ResumeMatchRequest, ResumeMatchResponse,
)

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="SMART-HIRE LLM Service",
    description="Gemini-powered resume screening and interview assessment service",
    version="1.0.0",
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/llm/resume-match", response_model=ResumeMatchResponse)
def resume_match(request: ResumeMatchRequest):
    try:
        result = score_resume(
            jd_data=request.job_description.model_dump(),
            resume_text=request.resume,
        )
        return ResumeMatchResponse(
            candidate_id=request.candidate_id,
            jd_id=request.jd_id,
            **result,
        )
    except ValueError:
        logging.exception("Resume matching validation failed.")
        raise HTTPException(status_code=502, detail="Gemini returned an invalid resume assessment.")
    except Exception:
        logging.exception("Resume matching failed.")
        raise HTTPException(status_code=502, detail="Unable to complete resume matching. Please try again.")

@app.post("/score-answer", response_model=AnswerScoreSchema)
def score(request: AnswerScoreRequest):
    try:
        return score_answer(request.question_data, request.candidate_answer)
    except Exception:
        logging.exception("Answer scoring failed.")
        raise HTTPException(status_code=502, detail="Unable to complete answer scoring. Please try again.")
