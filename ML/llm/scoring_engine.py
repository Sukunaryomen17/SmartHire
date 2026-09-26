from typing import Any

STATUS_MULTIPLIER = {
    "demonstrated": 1.0,
    "mentioned": 0.3,
    "weak": 0.1,
    "missing": 0.0,
}

def calculate_score(analysis: dict[str, Any], jd_data: dict[str, Any]) -> int:
    requirements = analysis.get("requirements", [])
    must = [r for r in requirements if r.get("category") == "must_have"]
    nice = [r for r in requirements if r.get("category") == "nice_to_have"]

    def category_points(items: list[dict], weight: float) -> float:
        if not items:
            return weight
        per_item = weight / len(items)
        return sum(per_item * STATUS_MULTIPLIER.get(r.get("status", "missing"), 0.0) for r in items)

    score = category_points(must, 40) + category_points(nice, 15)

    exp_data = analysis.get("experience", {})
    required_years = float(jd_data.get("experience_years") or exp_data.get("required_years") or 0)
    candidate_years = float(exp_data.get("candidate_years") or 0)
    if required_years <= 0:
        score += 20
    else:
        score += 20 * min(candidate_years / required_years, 1.0)

    education = analysis.get("education", {})
    edu_status = education.get("status", "not_applicable")
    score += 10 * STATUS_MULTIPLIER.get(edu_status, 1.0 if edu_status == "not_applicable" else 0.0)

    responsibilities = analysis.get("responsibility_alignment", [])
    if not responsibilities:
        score += 0
    else:
        avg = sum(STATUS_MULTIPLIER.get(item.get("status", "missing"), 0.0) for item in responsibilities) / len(responsibilities)
        score += 15 * avg

    return max(0, min(100, round(score)))
