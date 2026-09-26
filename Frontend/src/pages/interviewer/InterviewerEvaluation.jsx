import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import API from "../../api"

import Card from "../../components/common/Card"
import PageHeader from "../../components/layout/PageHeader"
import Topbar from "../../components/layout/Topbar"

function InterviewerEvaluation() {
  const location = useLocation()
  const navigate = useNavigate()

  const candidate = location.state?.candidate
  const interview = location.state?.interview

  const [technicalScore, setTechnicalScore] = useState(
    interview?.technicalScore ?? ""
  )

  const [problemSolvingScore, setProblemSolvingScore] =
    useState(interview?.problemSolvingScore ?? "")

  const [communicationScore, setCommunicationScore] =
    useState(interview?.communicationScore ?? "")

  const [behavioralScore, setBehavioralScore] =
    useState(interview?.behavioralScore ?? "")

  const [notes, setNotes] = useState(
    interview?.feedback || ""
  )

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(
    interview?.status === "COMPLETED"
  )
  const [error, setError] = useState("")

  if (!candidate || !interview) {
    return (
      <div className="dashboard-canvas min-h-screen text-[#292d28]">
        <Topbar
          title="Candidate Evaluation"
          subtitle="Interview evaluation"
        />

        <main className="p-5 sm:p-6 lg:p-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[#292d28]">
              Interview information unavailable
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#697066]">
              Open this page from the assigned-candidates screen so the
              selected candidate and interview record can be loaded.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/interviewer")
              }
              className="mt-5 rounded-lg bg-[#59684c] px-4 py-2.5 text-sm font-medium text-white"
            >
              Back to Assigned Candidates
            </button>
          </Card>
        </main>
      </div>
    )
  }

  const getJobTitle = () => {
    return (
      candidate.appliedJobId?.title ||
      candidate.appliedJob?.title ||
      "Position not available"
    )
  }

  const formatDate = (date) => {
    if (!date) {
      return "-"
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    )
  }

  const formatTime = (date) => {
    if (!date) {
      return "-"
    }

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )
  }

  const handleSaveDecision = async () => {
    const scores = [
      technicalScore,
      problemSolvingScore,
      communicationScore,
      behavioralScore,
    ]

    const invalidScore = scores.some(
      (score) =>
        score === "" ||
        !Number.isFinite(Number(score)) ||
        Number(score) < 0 ||
        Number(score) > 100
    )

    if (invalidScore) {
      setError(
        "All four interview scores must be between 0 and 100."
      )
      return
    }

    try {
      setSaving(true)
      setSaved(false)
      setError("")

      await API.post(
        `/interviews/${interview._id}/evaluate`,
        {
          technicalScore: Number(technicalScore),
          problemSolvingScore: Number(
            problemSolvingScore
          ),
          communicationScore: Number(
            communicationScore
          ),
          behavioralScore: Number(
            behavioralScore
          ),
          feedback: notes,
        }
      )

      setSaved(true)
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ||
          "Unable to save interview evaluation."
      )
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-[#d6dcd2] bg-white px-4 py-3 text-sm text-[#292d28] outline-none transition focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"

  return (
    <div className="dashboard-canvas min-h-screen text-[#292d28]">
      <Topbar
        title="Candidate Evaluation"
        subtitle="Review candidate evidence and record interview assessment"
      />

      <main className="min-w-0 flex-1 p-5 sm:p-6 lg:p-8">
        <PageHeader
          title="Interview Evaluation"
          description="Review the candidate information and record the interview assessment."
        />

        <button
          type="button"
          onClick={() =>
            navigate("/interviewer")
          }
          className="mt-5 rounded-lg border border-[#d6dcd2] px-4 py-2 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee]"
        >
          ← Back to Assigned Candidates
        </button>

        {error && (
          <div className="mt-6 rounded-lg border border-[#e2d4c6] bg-[#faf4ed] px-4 py-3">
            <p className="text-sm text-[#7a5c42]">
              {error}
            </p>
          </div>
        )}

        <Card className="mt-6 p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm text-[#747b71]">
                Candidate
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-[#292d28]">
                {candidate.name}
              </h2>

              <p className="mt-1 text-sm text-[#697066]">
                {getJobTitle()}
              </p>
            </div>

            <div className="rounded-xl bg-[#f1f3ee] px-4 py-3">
              <p className="text-xs text-[#838a7f]">
                Interview
              </p>

              <p className="mt-1 text-sm font-semibold text-[#59684c]">
                {formatDate(interview.scheduledAt)}
              </p>

              <p className="text-sm text-[#697066]">
                {formatTime(interview.scheduledAt)}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#e0e4dc] p-4">
              <p className="text-xs text-[#838a7f]">
                Experience
              </p>

              <p className="mt-1 font-medium text-[#292d28]">
                {candidate.experienceYears ?? 0} years
              </p>
            </div>

            <div className="rounded-xl border border-[#e0e4dc] p-4">
              <p className="text-xs text-[#838a7f]">
                Location
              </p>

              <p className="mt-1 font-medium text-[#292d28]">
                {candidate.location || "Not specified"}
              </p>
            </div>

            <div className="rounded-xl border border-[#e0e4dc] p-4">
              <p className="text-xs text-[#838a7f]">
                Interview Status
              </p>

              <p className="mt-1 font-medium text-[#59684c]">
                {interview.status}
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="p-5">
            <p className="text-sm text-[#747b71]">
              Resume Score
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#292d28]">
              {candidate.resumeScore ?? "-"}
            </p>

            <p className="mt-1 text-xs text-[#838a7f]">
              Resume screening score
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-[#747b71]">
              Test Score
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#292d28]">
              {candidate.testScore ?? "-"}
            </p>

            <p className="mt-1 text-xs text-[#838a7f]">
              Screening test score
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-[#747b71]">
              Interview Type
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#59684c]">
              {interview.type}
            </p>

            <p className="mt-1 text-xs text-[#838a7f]">
              Current interview
            </p>
          </Card>
        </div>

        <Card className="mt-6 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-[#292d28]">
            Interview Scores
          </h2>

          <p className="mt-1 text-sm text-[#747b71]">
            Enter scores from 0 to 100 for each interview assessment area.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[#434a40]">
                Technical Score
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={technicalScore}
                onChange={(event) => {
                  setTechnicalScore(event.target.value)
                  setSaved(false)
                }}
                className={inputClass}
                placeholder="0 - 100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#434a40]">
                Problem Solving Score
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={problemSolvingScore}
                onChange={(event) => {
                  setProblemSolvingScore(
                    event.target.value
                  )
                  setSaved(false)
                }}
                className={inputClass}
                placeholder="0 - 100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#434a40]">
                Communication Score
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={communicationScore}
                onChange={(event) => {
                  setCommunicationScore(
                    event.target.value
                  )
                  setSaved(false)
                }}
                className={inputClass}
                placeholder="0 - 100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#434a40]">
                Behavioral Score
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={behavioralScore}
                onChange={(event) => {
                  setBehavioralScore(
                    event.target.value
                  )
                  setSaved(false)
                }}
                className={inputClass}
                placeholder="0 - 100"
              />
            </div>
          </div>
        </Card>

        <Card className="mt-6 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-[#292d28]">
            Interview Notes
          </h2>

          <p className="mt-1 text-sm text-[#747b71]">
            Add observations and feedback from the interview.
          </p>

          <textarea
            value={notes}
            onChange={(event) => {
              setNotes(event.target.value)
              setSaved(false)
            }}
            placeholder="Enter interview feedback..."
            rows={6}
            className="mt-4 w-full resize-none rounded-xl border border-[#d6dcd2] bg-white px-4 py-3 text-sm text-[#292d28] outline-none transition placeholder:text-[#9aa197] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
          />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleSaveDecision}
              disabled={saving}
              className="rounded-lg bg-[#59684c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4e5c44] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Interview Evaluation"}
            </button>

            {saved && (
              <p className="text-sm font-medium text-[#59684c]">
                Interview evaluation saved successfully.
              </p>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}

export default InterviewerEvaluation