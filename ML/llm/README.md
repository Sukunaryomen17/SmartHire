# SmartHire LLM service

## Features
- Resume matching: `POST /api/llm/resume-match`
- Existing interview answer scoring: `POST /score-answer`
- Health check: `GET /health`

## Run (PowerShell)
```powershell
cd ML\llm
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
# Add your Gemini API key to .env
python -m uvicorn llm.api:app --app-dir .. --host 0.0.0.0 --port 8000
```

Open `http://127.0.0.1:8000/docs`.

## Resume match request
```json
{
  "candidate_id": "candidate-001",
  "jd_id": "job-001",
  "job_description": {
    "title": "Backend Developer",
    "must_have": ["Python", "FastAPI", "SQL"],
    "nice_to_have": ["Docker"],
    "experience_years": 2,
    "education": "Bachelor's degree",
    "location": "Remote",
    "summary": "Build and maintain backend APIs."
  },
  "resume": "Paste plain-text resume here"
}
```

Keep `.env` private and never commit your API key.
