import { useEffect, useMemo, useState } from "react"

import API from "../../api"

import Badge from "../../components/common/Badge"
import Card from "../../components/common/Card"
import DashboardLayout from "../../components/layout/DashboardLayout"
import PageHeader from "../../components/layout/PageHeader"

function FinalDecision() {
  const [candidates, setCandidates] = useState([])
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  const [decision, setDecision] = useState("")
  const [notes, setNotes] = useState("")

  const [loading, setLoading] = useState(true)
  const [loadingEvaluation, setLoadingEvaluation] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadCandidates()
  }, [])

  const loadCandidates = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await API.get("/candidates")

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.candidates || []

      setCandidates(data)
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ||
          "Unable to load candidates."
      )
    } finally {
      setLoading(false)
    }
  }

  const getJobTitle = (candidate) => {
    if (candidate.appliedJobId?.title) {
      return candidate.appliedJobId.title
    }

    if (candidate.appliedJob?.title) {
      return candidate.appliedJob.title
    }

    return "Position not available"
  }

  const getEvaluation = (candidate) => {
    return candidate.evaluation || null
  }

  const openCandidate = async (candidate) => {
    setSelectedCandidate(candidate)
    setDecision("")
    setNotes("")
    setSaved(false)
    setError("")

    try {
      setLoadingEvaluation(true)

      const response = await API.post(
        `/evaluations/application/${candidate._id}/calculate`,
        {
          resumeScore: candidate.resumeScore,
        }
      )

      const evaluation =
        response.data?.data || response.data

      setSelectedCandidate({
        ...candidate,
        evaluation,
      })
    } catch (err) {
      console.error(err)

      /*
       * Calculation requires:
       * resume + submitted test + completed interview.
       *
       * If those are not available yet, we still show the
       * candidate's existing information.
       */
      setSelectedCandidate({
        ...candidate,
        evaluation: null,
      })

      setError(
        err.response?.data?.message ||
          "Final evaluation is not available yet. Resume, test and interview scores are required."
      )
    } finally {
      setLoadingEvaluation(false)
    }
  }

  const closeCandidate = () => {
    setSelectedCandidate(null)
    setDecision("")
    setNotes("")
    setSaved(false)
    setError("")
  }

  const handleSaveDecision = async () => {
    if (!decision || !selectedCandidate) {
      return
    }

    const evaluation = getEvaluation(selectedCandidate)

    if (!evaluation?._id && !evaluation?.finalScore) {
      setError(
        "Final evaluation must be calculated before recording the final decision."
      )
      return
    }

    try {
      setSaving(true)
      setSaved(false)
      setError("")

      const backendDecision =
        decision === "PASS"
          ? "SELECTED"
          : "REJECTED"

      const response = await API.patch(
        `/evaluations/application/${selectedCandidate._id}/decision`,
        {
          decision: backendDecision,
        }
      )

      const updatedEvaluation =
        response.data?.data || response.data

      setSelectedCandidate((current) => ({
        ...current,
        evaluation: updatedEvaluation,
      }))

      setCandidates((current) =>
        current.map((candidate) =>
          candidate._id === selectedCandidate._id
            ? {
                ...candidate,
                evaluation: updatedEvaluation,
              }
            : candidate
        )
      )

      setSaved(true)
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ||
          "Unable to save final decision."
      )
    } finally {
      setSaving(false)
    }
  }

  const awaitingDecision = useMemo(() => {
    return candidates.filter(
      (candidate) =>
        candidate.screeningStatus === "shortlisted"
    )
  }, [candidates])

  const selectedCount = candidates.filter(
    (candidate) =>
      candidate.evaluation?.decision === "SELECTED"
  ).length

  const rejectedCount = candidates.filter(
    (candidate) =>
      candidate.evaluation?.decision === "REJECTED"
  ).length

  const scores = candidates
    .map((candidate) => candidate.evaluation?.finalScore)
    .filter(
      (score) =>
        typeof score === "number" && Number.isFinite(score)
    )

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) /
            scores.length
        )
      : 0

  return (
    <DashboardLayout topbarTitle="Final decision">
      <PageHeader
        eyebrow="Hiring manager"
        title="Final Hiring Decision"
        description="Review completed candidate assessments and record the final hiring decision."
      />

      {error && (
        <div className="mb-6 rounded-lg border border-[#e2d4c6] bg-[#faf4ed] px-4 py-3">
          <p className="text-sm text-[#7a5c42]">
            {error}
          </p>
        </div>
      )}

      {!selectedCandidate ? (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="p-5">
              <p className="text-sm text-[#697066]">
                Awaiting Decision
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                {awaitingDecision.length}
              </p>

              <p className="mt-1 text-xs text-[#838a7f]">
                Shortlisted candidates
              </p>
            </Card>

            <Card className="p-5">
              <p className="text-sm text-[#697066]">
                Selected
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                {selectedCount}
              </p>

              <p className="mt-1 text-xs text-[#838a7f]">
                Final evaluations
              </p>
            </Card>

            <Card className="p-5">
              <p className="text-sm text-[#697066]">
                Rejected
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                {rejectedCount}
              </p>

              <p className="mt-1 text-xs text-[#838a7f]">
                Final evaluations
              </p>
            </Card>

            <Card className="p-5">
              <p className="text-sm text-[#697066]">
                Average Final Score
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                {averageScore}
              </p>

              <p className="mt-1 text-xs text-[#838a7f]">
                Calculated evaluations
              </p>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <div className="border-b border-[#e1e5dd] px-5 py-5 sm:px-6">
              <h2 className="text-lg font-semibold text-[#292d28]">
                Candidates awaiting final decision
              </h2>

              <p className="mt-1 text-sm text-[#697066]">
                Review the complete assessment before recording the final outcome.
              </p>
            </div>

            {loading ? (
              <div className="px-6 py-12 text-center text-sm text-[#697066]">
                Loading candidates...
              </div>
            ) : awaitingDecision.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-[#697066]">
                No shortlisted candidates are currently awaiting a final decision.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
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
                        Test
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                        Interview
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                        Final
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                        Decision
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#e7eae3]">
                    {awaitingDecision.map((candidate) => {
                      const evaluation =
                        getEvaluation(candidate)

                      return (
                        <tr
                          key={candidate._id}
                          className="transition-colors hover:bg-[#f0f3ed]"
                        >
                          <td className="px-5 py-4 sm:px-6">
                            <p className="font-medium text-[#292d28]">
                              {candidate.name}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm text-[#697066] sm:px-6">
                            {getJobTitle(candidate)}
                          </td>

                          <td className="px-5 py-4 text-sm font-medium text-[#292d28] sm:px-6">
                            {candidate.resumeScore ?? "-"}
                          </td>

                          <td className="px-5 py-4 text-sm font-medium text-[#292d28] sm:px-6">
                            {evaluation?.testScore ?? candidate.testScore ?? "-"}
                          </td>

                          <td className="px-5 py-4 text-sm font-medium text-[#292d28] sm:px-6">
                            {evaluation?.interviewScore ??
                              candidate.interviewScore ??
                              "-"}
                          </td>

                          <td className="px-5 py-4 text-sm font-semibold text-[#59684c] sm:px-6">
                            {evaluation?.finalScore ?? "-"}
                          </td>

                          <td className="px-5 py-4 sm:px-6">
                            <Badge
                              status={
                                evaluation?.decision === "SELECTED"
                                  ? "Completed"
                                  : evaluation?.decision === "REJECTED"
                                  ? "Review"
                                  : "Pending"
                              }
                            >
                              {evaluation?.decision || "PENDING"}
                            </Badge>
                          </td>

                          <td className="px-5 py-4 sm:px-6">
                            <button
                              type="button"
                              onClick={() =>
                                openCandidate(candidate)
                              }
                              className="rounded-lg border border-[#d6dcd2] px-4 py-2 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee]"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      ) : (
        <>
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
                  {getJobTitle(selectedCandidate)}
                </p>
              </div>

              <Badge status="Review">
                {selectedCandidate.screeningStatus || "Shortlisted"}
              </Badge>
            </div>
          </Card>

          {loadingEvaluation ? (
            <Card className="mb-6 p-6">
              <p className="text-sm text-[#697066]">
                Calculating final evaluation...
              </p>
            </Card>
          ) : (
            <>
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-5">
                  <p className="text-sm text-[#697066]">
                    Resume Score
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                    {selectedCandidate.resumeScore ?? "-"}
                  </p>

                  <p className="mt-1 text-xs text-[#838a7f]">
                    Resume screening
                  </p>
                </Card>

                <Card className="p-5">
                  <p className="text-sm text-[#697066]">
                    Test Score
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                    {getEvaluation(selectedCandidate)?.testScore ??
                      selectedCandidate.testScore ??
                      "-"}
                  </p>

                  <p className="mt-1 text-xs text-[#838a7f]">
                    Screening test
                  </p>
                </Card>

                <Card className="p-5">
                  <p className="text-sm text-[#697066]">
                    Interview Score
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                    {getEvaluation(selectedCandidate)?.interviewScore ??
                      selectedCandidate.interviewScore ??
                      "-"}
                  </p>

                  <p className="mt-1 text-xs text-[#838a7f]">
                    Interview assessment
                  </p>
                </Card>

                <Card className="p-5">
                  <p className="text-sm text-[#697066]">
                    Final Score
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-[#59684c]">
                    {getEvaluation(selectedCandidate)?.finalScore ?? "-"}
                  </p>

                  <p className="mt-1 text-xs text-[#838a7f]">
                    30% resume + 30% test + 40% interview
                  </p>
                </Card>
              </div>

              <Card className="p-5 sm:p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
                    Hiring manager decision
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-[#292d28]">
                    Record final outcome
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[#697066]">
                    Select the final outcome based on the completed assessment.
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
                            "Select the candidate."}

                          {option === "HOLD" &&
                            "Keep the candidate under review."}

                          {option === "REJECT" &&
                            "Reject the candidate."}
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
                    disabled={!decision || saving}
                    onClick={handleSaveDecision}
                    className="rounded-lg bg-[#59684c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d5b42] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : "Save Final Decision"}
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
                      {selectedCandidate.name} has been marked as{" "}
                      {decision}.
                    </p>
                  </div>
                )}
              </Card>
            </>
          )}
        </>
      )}
    </DashboardLayout>
  )
}

export default FinalDecision