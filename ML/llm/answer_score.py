from typing import Dict, Any
from llm.llm_client import llm_client
from llm.prompts import ANSWER_SCORE_SYSTEM_PROMPT, ANSWER_SCORE_USER_PROMPT
from llm.schemas import AnswerScoreSchema

def score_answer(question_data: Dict[str, Any], candidate_answer: str) -> AnswerScoreSchema:
    """
    Scores a single free-text screening answer against question rubric and reference answer using Gemini.
    Returns score (0-5), justification, confidence (0-1), and rubric hits.
    """
    rubric = question_data.get("rubric", {})
    
    user_prompt = ANSWER_SCORE_USER_PROMPT.format(
        question_text=question_data.get("text", ""),
        reference_answer=question_data.get("reference_answer", ""),
        rubric_score_5=rubric.get("score_5", "N/A"),
        rubric_score_3=rubric.get("score_3", "N/A"),
        rubric_score_0=rubric.get("score_0", "N/A"),
        candidate_answer=candidate_answer
    )

    result: AnswerScoreSchema = llm_client.call(
        system_prompt=ANSWER_SCORE_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        schema=AnswerScoreSchema
    )
    return result