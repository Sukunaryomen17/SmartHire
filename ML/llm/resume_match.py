from typing import Any, Dict
from llm.llm_client import llm_client
from llm.prompts import RESUME_MATCH_SYSTEM_PROMPT, RESUME_MATCH_USER_PROMPT
from llm.schemas import ResumeAnalysis
from llm.scoring_engine import calculate_score

def score_resume(jd_data: Dict[str, Any], resume_text: str) -> dict:
    user_prompt = RESUME_MATCH_USER_PROMPT.format(
        title=jd_data.get("title", "N/A"),
        must_have=", ".join(jd_data.get("must_have", [])),
        nice_to_have=", ".join(jd_data.get("nice_to_have", [])),
        experience_years=jd_data.get("experience_years", "N/A"),
        education=jd_data.get("education", "N/A"),
        location=jd_data.get("location", "N/A"),
        jd_summary=jd_data.get("summary", ""),
        resume_text=resume_text,
    )
    analysis: ResumeAnalysis = llm_client.call(
        system_prompt=RESUME_MATCH_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        schema=ResumeAnalysis,
    )
    raw = analysis.model_dump()
    score = calculate_score(raw, jd_data)
    matched = [
        item.name for item in analysis.requirements
        if item.status == "demonstrated"
    ]
    gaps = [
        item.name for item in analysis.requirements
        if item.status in {"missing", "weak"}
    ]
    if analysis.education.status in {"missing", "weak"} and jd_data.get("education"):
        gaps.append(f"Education: {jd_data.get('education')}")
    return {
        "score": score,
        "matched_skills": matched,
        "gaps": gaps,
        "summary": analysis.summary,
    }
