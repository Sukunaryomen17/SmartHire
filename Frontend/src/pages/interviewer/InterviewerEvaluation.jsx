import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Card from "../../components/common/Card"
import PageHeader from "../../components/layout/PageHeader"
import Topbar from "../../components/layout/Topbar"

const defaultCandidate = {
  id: 1,
  name: "Priya Sharma",
  role: "Java Backend Developer",
  experience: "3+ Years",
  location: "Bengaluru",
  interviewDate: "28 Sep 2026",
  interviewTime: "10:00 AM",
  resumeScore: 91,
  qaScore: 87,
  confidence: 0.91,
  status: "Interview",
}

function InterviewerEvaluation() {
  const location = useLocation()
  const navigate = useNavigate()

  const candidateFromList = location.state?.candidate

  const candidate = candidateFromList
    ? {
        ...defaultCandidate,
        ...candidateFromList,
        interviewDate: candidateFromList.date,
        interviewTime: candidateFromList.time,
      }
    : defaultCandidate

  const [decision, setDecision] = useState("")
  const [notes, setNotes] = useState("")
  const [saved, setSaved] = useState(false)

  const handleSaveDecision = () => {
    if (!decision) {
      return
    }

    setSaved(true)
  }

  return (
    <div className="dashboard-canvas min-h-screen text-[#292d28]">
      <Topbar
        title="Candidate Evaluation"
        subtitle="Review candidate evidence and record your interview decision"
      />

      <main className="min-w-0 flex-1 p-5 sm:p-6 lg:p-8">
        <PageHeader
          title="Interview Evaluation"
          description="Review the candidate information before recording your decision."
        />

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/interviewer")}
          className="mt-5 rounded-lg border border-[#d6dcd2] px-4 py-2 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee]"
        >
          ← Back to Assigned Candidates
        </button>

        {/* Candidate details */}
        <Card className="mt-6 p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm text-[#747b71]">Candidate</p>

              <h2 className="mt-1 text-2xl font-semibold text-[#292d28]">
                {candidate.name}
              </h2>

              <p className="mt-1 text-sm text-[#697066]">
                {candidate.role}
              </p>
            </div>

            <div className="rounded-xl bg-[#f1f3ee] px-4 py-3">
              <p className="text-xs text-[#838a7f]">Interview</p>

              <p className="mt-1 text-sm font-semibold text-[#59684c]">
                {candidate.interviewDate}
              </p>

              <p className="text-sm text-[#697066]">
                {candidate.interviewTime}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#e0e4dc] p-4">
              <p className="text-xs text-[#838a7f]">Experience</p>

              <p className="mt-1 font-medium text-[#292d28]">
                {candidate.experience}
              </p>
            </div>

            <div className="rounded-xl border border-[#e0e4dc] p-4">
              <p className="text-xs text-[#838a7f]">Location</p>

              <p className="mt-1 font-medium text-[#292d28]">
                {candidate.location}
              </p>
            </div>

            <div className="rounded-xl border border-[#e0e4dc] p-4">
              <p className="text-xs text-[#838a7f]">Current Stage</p>

              <p className="mt-1 font-medium text-[#59684c]">
                {candidate.status}
              </p>
            </div>
          </div>
        </Card>

        {/* AI evidence */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="p-5">
            <p className="text-sm text-[#747b71]">Resume Score</p>

            <p className="mt-2 text-3xl font-semibold text-[#292d28]">
              {candidate.resumeScore}
            </p>

            <p className="mt-1 text-xs text-[#838a7f]">
              Resume screening score
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-[#747b71]">Q&A Score</p>

            <p className="mt-2 text-3xl font-semibold text-[#292d28]">
              {candidate.qaScore}
            </p>

            <p className="mt-1 text-xs text-[#838a7f]">
              Screening test score
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-[#747b71]">AI Confidence</p>

            <p className="mt-2 text-3xl font-semibold text-[#292d28]">
              {Math.round(candidate.confidence * 100)}%
            </p>

            <p className="mt-1 text-xs text-[#838a7f]">
              Average AI confidence
            </p>
          </Card>
        </div>

        {/* Interview notes */}
        <Card className="mt-6 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-[#292d28]">
            Interview Notes
          </h2>

          <p className="mt-1 text-sm text-[#747b71]">
            Add your observations and feedback from the interview.
          </p>

          <textarea
            value={notes}
            onChange={(event) => {
              setNotes(event.target.value)
              setSaved(false)
            }}
            placeholder="Enter interview notes..."
            rows={6}
            className="mt-4 w-full resize-none rounded-xl border border-[#d6dcd2] bg-white px-4 py-3 text-sm text-[#292d28] outline-none transition placeholder:text-[#9aa197] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
          />
        </Card>

        {/* Decision */}
        <Card className="mt-6 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-[#292d28]">
            Interview Decision
          </h2>

          <p className="mt-1 text-sm text-[#747b71]">
            Select the appropriate status after reviewing the candidate.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["Accepted", "Rejected", "On-Hold", "No-Show"].map((option) => (
              <label
                key={option}
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  decision === option
                    ? "border-[#879276] bg-[#f1f3ee]"
                    : "border-[#e0e4dc] hover:bg-[#f8f9f6]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="decision"
                    value={option}
                    checked={decision === option}
                    onChange={(event) => {
                      setDecision(event.target.value)
                      setSaved(false)
                    }}
                    className="h-4 w-4 accent-[#59684c]"
                  />

                  <span className="text-sm font-medium text-[#292d28]">
                    {option}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleSaveDecision}
              disabled={!decision}
              className="rounded-lg bg-[#59684c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4e5c44] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Decision
            </button>

            {saved && (
              <p className="text-sm font-medium text-[#59684c]">
                Decision saved successfully.
              </p>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}

export default InterviewerEvaluation