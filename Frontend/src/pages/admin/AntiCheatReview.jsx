import { useEffect, useMemo, useState } from "react"

import API from "../../api"

import Badge from "../../components/common/Badge"
import Card from "../../components/common/Card"
import DashboardLayout from "../../components/layout/DashboardLayout"
import PageHeader from "../../components/layout/PageHeader"

function AntiCheatReview() {
  const [candidates, setCandidates] = useState([])
  const [reviewFilter, setReviewFilter] = useState("All")
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  const [loading, setLoading] = useState(true)
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
          "Unable to load candidate activity."
      )
    } finally {
      setLoading(false)
    }
  }

  const getJobTitle = (candidate) => {
    return (
      candidate.appliedJobId?.title ||
      candidate.appliedJob?.title ||
      "Position not available"
    )
  }

  const getTestStatus = (candidate) => {
    if (candidate.testScore != null) {
      return "Completed"
    }

    return "Not available"
  }

  const filteredCandidates = useMemo(() => {
    if (reviewFilter === "Needs Review") {
      return candidates.filter(
        (candidate) => candidate.testScore != null
      )
    }

    if (reviewFilter === "Clear") {
      return candidates.filter(
        (candidate) => candidate.testScore == null
      )
    }

    return candidates
  }, [candidates, reviewFilter])

  const completedTests = candidates.filter(
    (candidate) => candidate.testScore != null
  ).length

  return (
    <DashboardLayout topbarTitle="Anti-cheat review">
      <PageHeader
        eyebrow="Candidate monitoring"
        title="Anti-Cheat Review"
        description="Review screening-test information recorded for candidate assessments."
      />

      {error && (
        <div className="mb-6 rounded-lg border border-[#e2d4c6] bg-[#faf4ed] px-4 py-3">
          <p className="text-sm text-[#7a5c42]">
            {error}
          </p>
        </div>
      )}

      <div className="mb-6 rounded-lg border border-[#d6dcd2] bg-[#f1f3ee] px-4 py-3">
        <p className="text-sm font-medium text-[#59684c]">
          Anti-cheat event tracking is not stored by the current backend.
        </p>

        <p className="mt-1 text-xs leading-5 text-[#697066]">
          TestAttempt currently stores test answers, score, timestamps and status,
          but it does not contain tab-switch, paste or fullscreen-exit fields.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Candidates
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {candidates.length}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Loaded from MongoDB
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Tests Completed
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {completedTests}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Based on stored test scores
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Tab Switches
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            —
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Not currently stored
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Paste Attempts
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            —
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Not currently stored
          </p>
        </Card>
      </div>

      <Card className="mb-6 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#292d28]">
              Test activity
            </h2>

            <p className="mt-1 text-sm text-[#697066]">
              Review the screening-test information available from the backend.
            </p>
          </div>

          <select
            aria-label="Filter anti-cheat review"
            value={reviewFilter}
            onChange={(event) =>
              setReviewFilter(event.target.value)
            }
            className="min-h-11 rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#434a40] outline-none transition-colors hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
          >
            <option value="All">
              All Candidates
            </option>

            <option value="Needs Review">
              Test Completed
            </option>

            <option value="Clear">
              Test Not Completed
            </option>
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
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
                  Test Status
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Test Score
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Tab Switches
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Paste Attempts
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Review
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e7eae3]">
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-10 text-center text-sm text-[#697066]"
                  >
                    Loading candidates...
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-10 text-center text-sm text-[#697066]"
                  >
                    No candidates found.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((candidate) => (
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

                    <td className="px-5 py-4 sm:px-6">
                      <Badge
                        status={
                          candidate.testScore != null
                            ? "Completed"
                            : "Review"
                        }
                      >
                        {getTestStatus(candidate)}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-[#292d28] sm:px-6">
                      {candidate.testScore ?? "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#697066] sm:px-6">
                      Not tracked
                    </td>

                    <td className="px-5 py-4 text-sm text-[#697066] sm:px-6">
                      Not tracked
                    </td>

                    <td className="px-5 py-4 sm:px-6">
                      <Badge status="Review">
                        Manual Review
                      </Badge>
                    </td>

                    <td className="px-5 py-4 sm:px-6">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedCandidate(candidate)
                        }
                        className="rounded-lg border border-[#d6dcd2] px-4 py-2 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee]"
                      >
                        View Activity
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedCandidate && (
        <Card className="mt-6 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
                Activity details
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#292d28]">
                {selectedCandidate.name}
              </h2>

              <p className="mt-1 text-sm text-[#697066]">
                {getJobTitle(selectedCandidate)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCandidate(null)}
              className="rounded-lg border border-[#d6dcd2] px-4 py-2 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee]"
            >
              Close
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4">
              <p className="text-xs text-[#838a7f]">
                Test status
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#292d28]">
                {getTestStatus(selectedCandidate)}
              </p>
            </div>

            <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4">
              <p className="text-xs text-[#838a7f]">
                Test score
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#292d28]">
                {selectedCandidate.testScore ?? "-"}
              </p>
            </div>

            <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4">
              <p className="text-xs text-[#838a7f]">
                Anti-cheat events
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#292d28]">
                Not tracked
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-[#d6dcd2] bg-[#f1f3ee] p-4">
            <p className="text-sm font-medium text-[#292d28]">
              Administrative review
            </p>

            <p className="mt-1 text-sm leading-6 text-[#697066]">
              The current TestAttempt backend stores answers, score,
              timestamps and submission status. It does not currently
              store browser activity such as tab switches, paste attempts
              or fullscreen exits.
            </p>
          </div>
        </Card>
      )}
    </DashboardLayout>
  )
}

export default AntiCheatReview