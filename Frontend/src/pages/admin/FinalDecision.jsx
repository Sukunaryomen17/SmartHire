import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Badge from "../../components/common/Badge"
import Card from "../../components/common/Card"
import DashboardLayout from "../../components/layout/DashboardLayout"
import PageHeader from "../../components/layout/PageHeader"

const candidates = [
  {
    id: 1,
    name: "Aarav Kumar",
    role: "Frontend Developer",
    resumeScore: 86,
    qaScore: 82,
    interviewScore: 88,
    overallScore: 85,
    confidence: 0.92,
    interviewerDecision: "Accepted",
    currentStatus: "Interview Completed",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Java Backend Developer",
    resumeScore: 91,
    qaScore: 87,
    interviewScore: 90,
    overallScore: 89,
    confidence: 0.94,
    interviewerDecision: "Accepted",
    currentStatus: "Interview Completed",
  },
  {
    id: 3,
    name: "Rahul Raj",
    role: "Python Developer",
    resumeScore: 74,
    qaScore: 68,
    interviewScore: 65,
    overallScore: 69,
    confidence: 0.61,
    interviewerDecision: "On-Hold",
    currentStatus: "Interview Completed",
  },
  {
    id: 4,
    name: "Karthik M",
    role: "Java Backend Developer",
    resumeScore: 82,
    qaScore: 79,
    interviewScore: 76,
    overallScore: 79,
    confidence: 0.81,
    interviewerDecision: "Accepted",
    currentStatus: "Interview Completed",
  },
]

function FinalDecision() {
  const navigate = useNavigate()

  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [decision, setDecision] = useState("")
  const [notes, setNotes] = useState("")
  const [saved, setSaved] = useState(false)

  const openCandidate = (candidate) => {
    setSelectedCandidate(candidate)
    setDecision("")
    setNotes("")
    setSaved(false)
  }

  const closeCandidate = () => {
    setSelectedCandidate(null)
    setDecision("")
    setNotes("")
    setSaved(false)
  }

  const handleSaveDecision = () => {
    if (!decision) return

    setSaved(true)
  }

  return (
    <DashboardLayout topbarTitle="Final decision">

      <PageHeader
        eyebrow="Hiring manager"
        title="Final Hiring Decision"
        description="Review completed candidate assessments and record the final hiring decision."
      />

      {!selectedCandidate ? (
        <>
          {/* Summary */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <Card className="p-5">
              <p className="text-sm text-[#697066]">
                Awaiting Decision
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                {candidates.length}
              </p>

              <p className="mt-1 text-xs text-[#838a7f]">
                Interviews completed
              </p>
            </Card>

            <Card className="p-5">
              <p className="text-sm text-[#697066]">
                Accepted by Interviewer
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                {
                  candidates.filter(
                    (candidate) =>
                      candidate.interviewerDecision === "Accepted"
                  ).length
                }
              </p>

              <p className="mt-1 text-xs text-[#838a7f]">
                Ready for final review
              </p>
            </Card>

            <Card className="p-5">
              <p className="text-sm text-[#697066]">
                On Hold
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                {
                  candidates.filter(
                    (candidate) =>
                      candidate.interviewerDecision === "On-Hold"
                  ).length
                }
              </p>

              <p className="mt-1 text-xs text-[#838a7f]">
                Requires review
              </p>
            </Card>

            <Card className="p-5">
              <p className="text-sm text-[#697066]">
                Average Overall Score
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                {Math.round(
                  candidates.reduce(
                    (total, candidate) =>
                      total + candidate.overallScore,
                    0
                  ) / candidates.length
                )}
              </p>

              <p className="mt-1 text-xs text-[#838a7f]">
                Resume + Q&A + interview
              </p>
            </Card>

          </div>

          {/* Candidate list */}
          <Card className="overflow-hidden">

            <div className="border-b border-[#e1e5dd] px-5 py-5 sm:px-6">

              <h2 className="text-lg font-semibold text-[#292d28]">
                Candidates awaiting final decision
              </h2>

              <p className="mt-1 text-sm text-[#697066]">
                Review the complete assessment before recording the final outcome.
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px] text-left">

                <thead className="border-b border-[#dfe4db] bg-[#edf0ea]">

                  <tr>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                      Candidate
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                      Position
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                      Resume
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                      Q&A
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                      Interview
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                      Overall
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                      Interviewer
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-[#e7eae3]">

                  {candidates.map((candidate) => (

                    <tr
                      key={candidate.id}
                      className="transition-colors hover:bg-[#f0f3ed]"
                    >

                      <td className="px-5 py-4 sm:px-6">

                        <p className="font-medium text-[#292d28]">
                          {candidate.name}
                        </p>

                      </td>

                      <td className="px-5 py-4 text-sm text-[#697066] sm:px-6">
                        {candidate.role}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-[#292d28] sm:px-6">
                        {candidate.resumeScore}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-[#292d28] sm:px-6">
                        {candidate.qaScore}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-[#292d28] sm:px-6">
                        {candidate.interviewScore}
                      </td>

                      <td className="px-5 py-4 sm:px-6">

                        <span className="font-semibold text-[#59684c]">
                          {candidate.overallScore}
                        </span>

                      </td>

                      <td className="px-5 py-4 sm:px-6">

                        <Badge
                          status={
                            candidate.interviewerDecision === "Accepted"
                              ? "Completed"
                              : "Review"
                          }
                        >
                          {candidate.interviewerDecision}
                        </Badge>

                      </td>

                      <td className="px-5 py-4 sm:px-6">

                        <button
                          type="button"
                          onClick={() => openCandidate(candidate)}
                          className="rounded-lg border border-[#d6dcd2] px-4 py-2 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee]"
                        >
                          Review
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </Card>
        </>
      ) : (
        <>
          {/* Candidate detail */}
          <div className="mb-5">

            <button
              type="button"
              onClick={closeCandidate}
              className="text-sm font-medium text-[#59684c] hover:underline"
            >
              ← Back to candidates
            </button>

          </div>

          <Card className="mb-6 p-5 sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
                  Final review
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-[#292d28]">
                  {selectedCandidate.name}
                </h2>

                <p className="mt-1 text-sm text-[#697066]">
                  {selectedCandidate.role}
                </p>

              </div>

              <Badge
                status={
                  selectedCandidate.interviewerDecision === "Accepted"
                    ? "Completed"
                    : "Review"
                }
              >
                Interview: {selectedCandidate.interviewerDecision}
              </Badge>

            </div>

          </Card>

          {/* Score summary */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Card className="p-5">

              <p className="text-sm text-[#697066]">
                Resume Score
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                {selectedCandidate.resumeScore}
              </p>

              <p className="mt-1 text-xs text-[#838a7f]">
                Resume screening
              </p>

            </Card>

            <Card className="p-5">

              <p className="text-sm text-[#697066]">
                Q&A Score
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                {selectedCandidate.qaScore}
              </p>

              <p className="mt-1 text-xs text-[#838a7f]">
                Screening answers
              </p>

            </Card>

            <Card className="p-5">

              <p className="text-sm text-[#697066]">
                Interview Score
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                {selectedCandidate.interviewScore}
              </p>

              <p className="mt-1 text-xs text-[#838a7f]">
                Interview assessment
              </p>

            </Card>

            <Card className="p-5">

              <p className="text-sm text-[#697066]">
                Overall Score
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#59684c]">
                {selectedCandidate.overallScore}
              </p>

              <p className="mt-1 text-xs text-[#838a7f]">
                Combined assessment
              </p>

            </Card>

          </div>

          {/* AI confidence */}
          <Card className="mb-6 p-5 sm:p-6">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-semibold text-[#292d28]">
                  Assessment confidence
                </h2>

                <p className="mt-1 text-sm text-[#697066]">
                  AI confidence recorded during candidate assessment.
                </p>

              </div>

              <span className="text-xl font-semibold text-[#59684c]">
                {Math.round(selectedCandidate.confidence * 100)}%
              </span>

            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e1e5dd]">

              <div
                className="h-full rounded-full bg-[#879276]"
                style={{
                  width: `${selectedCandidate.confidence * 100}%`,
                }}
              />

            </div>

          </Card>

          {/* Final decision */}
          <Card className="p-5 sm:p-6">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
                Hiring manager decision
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#292d28]">
                Record final outcome
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#697066]">
                Consider the assessment evidence and interviewer decision before recording the final outcome.
              </p>

            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

              {["PASS", "HOLD", "REJECT"].map((option) => {

                const isSelected = decision === option

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setDecision(option)
                      setSaved(false)
                    }}
                    className={`rounded-lg border px-4 py-4 text-left transition ${
                      isSelected
                        ? "border-[#59684c] bg-[#f1f3ee]"
                        : "border-[#d6dcd2] bg-white hover:bg-[#f1f3ee]"
                    }`}
                  >

                    <p
                      className={`text-sm font-semibold ${
                        isSelected
                          ? "text-[#59684c]"
                          : "text-[#292d28]"
                      }`}
                    >
                      {option}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#697066]">

                      {option === "PASS" &&
                        "Move the candidate forward in the hiring process."}

                      {option === "HOLD" &&
                        "Keep the candidate for additional review."}

                      {option === "REJECT" &&
                        "Close the candidate application."}

                    </p>

                  </button>
                )
              })}

            </div>

            <div className="mt-6">

              <label
                htmlFor="decision-notes"
                className="text-sm font-medium text-[#434a40]"
              >
                Hiring manager notes
              </label>

              <textarea
                id="decision-notes"
                value={notes}
                onChange={(event) => {
                  setNotes(event.target.value)
                  setSaved(false)
                }}
                rows={5}
                placeholder="Add a short explanation for the final decision..."
                className="mt-2 w-full rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-4 py-3 text-sm text-[#292d28] outline-none transition-colors placeholder:text-[#9aa095] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
              />

            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">

              <button
                type="button"
                disabled={!decision}
                onClick={handleSaveDecision}
                className="rounded-lg bg-[#59684c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d5b42] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save Final Decision
              </button>

              <button
                type="button"
                onClick={closeCandidate}
                className="rounded-lg border border-[#d6dcd2] px-5 py-2.5 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee]"
              >
                Cancel
              </button>

            </div>

            {saved && (
              <div className="mt-5 rounded-lg border border-[#cfd8c8] bg-[#eef2eb] px-4 py-3">

                <p className="text-sm font-medium text-[#59684c]">
                  Final decision saved successfully.
                </p>

                <p className="mt-1 text-xs text-[#697066]">
                  {selectedCandidate.name} has been marked as {decision}.
                </p>

              </div>
            )}

          </Card>

          {/* Candidate status note */}
          <Card className="mt-6 p-5">

            <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
              Candidate visibility
            </p>

            <p className="mt-2 text-sm leading-6 text-[#697066]">
              The final candidate-facing status will be updated when the backend is connected. Candidates should see their final status without internal AI justifications.
            </p>

          </Card>

        </>
      )}

    </DashboardLayout>
  )
}

export default FinalDecision