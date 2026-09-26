import { useMemo, useState } from "react"
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
    testStatus: "Completed",
    tabSwitches: 0,
    pasteAttempts: 0,
    fullscreenExits: 0,
    reviewStatus: "Clear",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Java Backend Developer",
    testStatus: "Completed",
    tabSwitches: 1,
    pasteAttempts: 0,
    fullscreenExits: 0,
    reviewStatus: "Clear",
  },
  {
    id: 3,
    name: "Rahul Raj",
    role: "Python Developer",
    testStatus: "Completed",
    tabSwitches: 3,
    pasteAttempts: 2,
    fullscreenExits: 1,
    reviewStatus: "Needs Review",
  },
  {
    id: 4,
    name: "Ananya S",
    role: "Frontend Developer",
    testStatus: "Completed",
    tabSwitches: 5,
    pasteAttempts: 3,
    fullscreenExits: 2,
    reviewStatus: "Needs Review",
  },
  {
    id: 5,
    name: "Karthik M",
    role: "Java Backend Developer",
    testStatus: "Completed",
    tabSwitches: 0,
    pasteAttempts: 1,
    fullscreenExits: 0,
    reviewStatus: "Clear",
  },
]

function AntiCheatReview() {
  const navigate = useNavigate()

  const [reviewFilter, setReviewFilter] = useState("All")
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  const getTotalSignals = (candidate) => {
    return (
      candidate.tabSwitches +
      candidate.pasteAttempts +
      candidate.fullscreenExits
    )
  }

  const filteredCandidates = useMemo(() => {
    if (reviewFilter === "Needs Review") {
      return candidates.filter(
        (candidate) => candidate.reviewStatus === "Needs Review"
      )
    }

    if (reviewFilter === "Clear") {
      return candidates.filter(
        (candidate) => candidate.reviewStatus === "Clear"
      )
    }

    return candidates
  }, [reviewFilter])

  const reviewCount = candidates.filter(
    (candidate) => candidate.reviewStatus === "Needs Review"
  ).length

  const totalTabSwitches = candidates.reduce(
    (total, candidate) => total + candidate.tabSwitches,
    0
  )

  const totalPasteAttempts = candidates.reduce(
    (total, candidate) => total + candidate.pasteAttempts,
    0
  )

  return (
    <DashboardLayout topbarTitle="Anti-cheat review">
      <PageHeader
        eyebrow="Candidate monitoring"
        title="Anti-Cheat Review"
        description="Review screening-test activity recorded during candidate assessments."
      />

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Candidates Reviewed
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {candidates.length}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Screening activity records
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Needs Review
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {reviewCount}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Candidates with activity signals
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Tab Switches
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {totalTabSwitches}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Recorded during tests
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Paste Attempts
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {totalPasteAttempts}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Recorded during tests
          </p>
        </Card>

      </div>

      {/* Filters */}
      <Card className="mb-6 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-base font-semibold text-[#292d28]">
              Test activity
            </h2>

            <p className="mt-1 text-sm text-[#697066]">
              Review candidate activity before making a decision.
            </p>
          </div>

          <select
            aria-label="Filter anti-cheat review"
            value={reviewFilter}
            onChange={(event) => setReviewFilter(event.target.value)}
            className="min-h-11 rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#434a40] outline-none transition-colors hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
          >
            <option value="All">
              All Candidates
            </option>

            <option value="Needs Review">
              Needs Review
            </option>

            <option value="Clear">
              Clear
            </option>
          </select>

        </div>
      </Card>

      {/* Candidate activity table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px] text-left">

            <thead className="border-b border-[#dfe4db] bg-[#edf0ea]">
              <tr>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Candidate
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Position
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Tab Switches
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Paste Attempts
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Fullscreen Exits
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Total Signals
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

              {filteredCandidates.map((candidate) => {
                const totalSignals = getTotalSignals(candidate)

                return (
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

                    <td className="px-5 py-4 text-sm text-[#292d28] sm:px-6">
                      {candidate.tabSwitches}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#292d28] sm:px-6">
                      {candidate.pasteAttempts}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#292d28] sm:px-6">
                      {candidate.fullscreenExits}
                    </td>

                    <td className="px-5 py-4 sm:px-6">
                      <span
                        className={`text-sm font-medium ${
                          totalSignals > 0
                            ? "text-[#7a5c42]"
                            : "text-[#59684c]"
                        }`}
                      >
                        {totalSignals}
                      </span>
                    </td>

                    <td className="px-5 py-4 sm:px-6">
                      <Badge
                        status={
                          candidate.reviewStatus === "Needs Review"
                            ? "Review"
                            : "Completed"
                        }
                      >
                        {candidate.reviewStatus}
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
                )
              })}

              {filteredCandidates.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-10 text-center text-sm text-[#697066]"
                  >
                    No candidates found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </Card>

      {/* Activity detail */}
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
                {selectedCandidate.role}
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
                Tab switches
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#292d28]">
                {selectedCandidate.tabSwitches}
              </p>

              <p className="mt-1 text-xs text-[#697066]">
                Times the test tab lost visibility
              </p>
            </div>

            <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4">
              <p className="text-xs text-[#838a7f]">
                Paste attempts
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#292d28]">
                {selectedCandidate.pasteAttempts}
              </p>

              <p className="mt-1 text-xs text-[#697066]">
                Paste events detected
              </p>
            </div>

            <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4">
              <p className="text-xs text-[#838a7f]">
                Fullscreen exits
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#292d28]">
                {selectedCandidate.fullscreenExits}
              </p>

              <p className="mt-1 text-xs text-[#697066]">
                Fullscreen exit events
              </p>
            </div>

          </div>

          <div className="mt-6 rounded-lg border border-[#d6dcd2] bg-[#f1f3ee] p-4">

            <p className="text-sm font-medium text-[#292d28]">
              Administrative review
            </p>

            <p className="mt-1 text-sm leading-6 text-[#697066]">
              These signals are provided as review information. They do not
              automatically determine the candidate's result.
            </p>

          </div>

          <div className="mt-5 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/admin/candidates/${selectedCandidate.id}`
                )
              }
              className="rounded-lg bg-[#59684c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d5b42]"
            >
              View Candidate
            </button>

          </div>

        </Card>
      )}

    </DashboardLayout>
  )
}

export default AntiCheatReview