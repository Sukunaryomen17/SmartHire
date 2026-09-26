from typing import Dict, Any
from llm.llm_client import llm_client
from llm.prompts import RESUME_MATCH_SYSTEM_PROMPT, RESUME_MATCH_USER_PROMPT
from llm.schemas import ResumeMatchSchema

def score_resume(jd_data: Dict[str, Any], resume_text: str) -> ResumeMatchSchema:
    """
    Auto-scores candidate resume against a given Job Description using Gemini.
    Returns score (0-100), matched skills, gaps, and summary.
    """
    user_prompt = RESUME_MATCH_USER_PROMPT.format(
        title=jd_data.get("title", "N/A"),
        must_have=", ".join(jd_data.get("must_have", [])),
        nice_to_have=", ".join(jd_data.get("nice_to_have", [])),
        experience_years=jd_data.get("experience_years", "N/A"),
        education=jd_data.get("education", "N/A"),
        jd_summary=jd_data.get("summary", ""),
        resume_text=resume_text
    )

    result: ResumeMatchSchema = llm_client.call(
        system_prompt=RESUME_MATCH_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        schema=ResumeMatchSchema
    )
    return result