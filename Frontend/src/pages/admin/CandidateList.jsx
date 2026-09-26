import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import Badge from "../../components/common/Badge"
import Card from "../../components/common/Card"
import Input from "../../components/common/Input"
import ScoreDisplay from "../../components/common/ScoreDisplay"
import StateMessage from "../../components/common/StateMessage"
import DashboardLayout from "../../components/layout/DashboardLayout"
import PageHeader from "../../components/layout/PageHeader"

function CandidateList() {
  const navigate = useNavigate()

  const candidates = [
    {
      id: 1,
      name: "Aarav Kumar",
      job: "Frontend Developer",
      score: 86,
      resumeScore: 86,
      qaScore: 82,
      confidence: 0.91,
      status: "Screening",
    },
    {
      id: 2,
      name: "Priya Sharma",
      job: "Java Backend Developer",
      score: 91,
      resumeScore: 91,
      qaScore: 87,
      confidence: 0.94,
      status: "Interview",
    },
    {
      id: 3,
      name: "Rahul Raj",
      job: "Python Developer",
      score: 74,
      resumeScore: 74,
      qaScore: 92,
      confidence: 0.88,
      status: "Screening",
    },
    {
      id: 4,
      name: "Ananya S",
      job: "Frontend Developer",
      score: 68,
      resumeScore: 68,
      qaScore: 61,
      confidence: 0.62,
      status: "Rejected",
    },
    {
      id: 5,
      name: "Karthik M",
      job: "Java Backend Developer",
      score: 79,
      resumeScore: 79,
      qaScore: 80,
      confidence: 0.89,
      status: "Interview",
    },
  ]

  const [search, setSearch] = useState("")
  const [jobFilter, setJobFilter] = useState("All Jobs")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [sortOrder, setSortOrder] = useState("none")
  const [flagFilter, setFlagFilter] = useState("All Candidates")

  /*
   * AI review rules for the frontend demo:
   *
   * Low Confidence:
   * AI confidence < 0.70
   *
   * Score Disagreement:
   * Difference between resume and Q&A score >= 15
   */
  const getFlags = (candidate) => {
    const flags = []

    if (candidate.confidence < 0.7) {
      flags.push("Low Confidence")
    }

    if (
      Math.abs(candidate.resumeScore - candidate.qaScore) >= 15
    ) {
      flags.push("Score Disagreement")
    }

    return flags
  }

  const filteredCandidates = useMemo(() => {
    return candidates
      .filter((candidate) =>
        candidate.name.toLowerCase().includes(search.toLowerCase())
      )
      .filter((candidate) => {
        if (jobFilter === "All Jobs") {
          return true
        }

        return candidate.job === jobFilter
      })
      .filter((candidate) => {
        if (statusFilter === "All Status") {
          return true
        }

        return candidate.status === statusFilter
      })
      .filter((candidate) => {
        const flags = getFlags(candidate)

        if (flagFilter === "All Candidates") {
          return true
        }

        if (flagFilter === "Needs Review") {
          return flags.length > 0
        }

        if (flagFilter === "Low Confidence") {
          return flags.includes("Low Confidence")
        }

        if (flagFilter === "Score Disagreement") {
          return flags.includes("Score Disagreement")
        }

        return true
      })
      .sort((a, b) => {
        if (sortOrder === "high") {
          return b.score - a.score
        }

        if (sortOrder === "low") {
          return a.score - b.score
        }

        return 0
      })
  }, [search, jobFilter, statusFilter, sortOrder, flagFilter])

  const reviewCount = candidates.filter(
    (candidate) => getFlags(candidate).length > 0
  ).length

  const lowConfidenceCount = candidates.filter(
    (candidate) => getFlags(candidate).includes("Low Confidence")
  ).length

  const disagreementCount = candidates.filter(
    (candidate) => getFlags(candidate).includes("Score Disagreement")
  ).length

  const clearFilters = () => {
    setSearch("")
    setJobFilter("All Jobs")
    setStatusFilter("All Status")
    setSortOrder("none")
    setFlagFilter("All Candidates")
  }

  return (
    <DashboardLayout topbarTitle="Candidate management">
      <PageHeader
        description="Review and manage candidate applications"
        eyebrow="Candidate management"
        title="Candidates"
      />

      {/* AI Review Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Candidates Needing Review
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {reviewCount}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            AI review indicators detected
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Low Confidence
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {lowConfidenceCount}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            AI confidence below threshold
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Score Disagreement
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {disagreementCount}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Resume and test scores differ
          </p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <Input
            aria-label="Search candidates"
            type="text"
            placeholder="Search candidate..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            aria-label="Filter candidates by job"
            value={jobFilter}
            onChange={(event) => setJobFilter(event.target.value)}
            className="min-h-11 rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#434a40] outline-none transition-colors hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
          >
            <option>All Jobs</option>
            <option>Frontend Developer</option>
            <option>Java Backend Developer</option>
            <option>Python Developer</option>
          </select>

          <select
            aria-label="Filter candidates by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="min-h-11 rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#434a40] outline-none transition-colors hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
          >
            <option>All Status</option>
            <option>Screening</option>
            <option>Interview</option>
            <option>Rejected</option>
          </select>

          <select
            aria-label="Sort candidates by score"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="min-h-11 rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#434a40] outline-none transition-colors hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
          >
            <option value="none">Sort by Score</option>
            <option value="high">Highest Score</option>
            <option value="low">Lowest Score</option>
          </select>

          <select
            aria-label="Filter candidates by AI review flag"
            value={flagFilter}
            onChange={(event) => setFlagFilter(event.target.value)}
            className="min-h-11 rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#434a40] outline-none transition-colors hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
          >
            <option>All Candidates</option>
            <option>Needs Review</option>
            <option>Low Confidence</option>
            <option>Score Disagreement</option>
          </select>
        </div>
      </Card>

      {/* Candidate Table / Empty State */}
      {filteredCandidates.length === 0 ? (
        <StateMessage
          type="empty"
          title="No candidates found"
          message="No candidates match the current search and filter settings."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead className="border-b border-[#dfe4db] bg-[#edf0ea]">
                <tr>
                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                    Candidate
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                    Job
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                    Resume Score
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                    Q&A Score
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                    AI Confidence
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                    AI Review
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e7eae3]">
                {filteredCandidates.map((candidate) => {
                  const flags = getFlags(candidate)

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
                        {candidate.job}
                      </td>

                      <td className="px-5 py-4 sm:px-6">
                        <ScoreDisplay
                          className="max-w-40"
                          score={candidate.resumeScore}
                        />
                      </td>

                      <td className="px-5 py-4 sm:px-6">
                        <ScoreDisplay
                          className="max-w-40"
                          score={candidate.qaScore}
                        />
                      </td>

                      <td className="px-5 py-4 sm:px-6">
                        <span
                          className={`text-sm font-medium ${
                            candidate.confidence < 0.7
                              ? "text-[#7a5c42]"
                              : "text-[#59684c]"
                          }`}
                        >
                          {Math.round(candidate.confidence * 100)}%
                        </span>
                      </td>

                      <td className="px-5 py-4 sm:px-6">
                        {flags.length === 0 ? (
                          <span className="text-sm text-[#59684c]">
                            No flags
                          </span>
                        ) : (
                          <div className="flex flex-col gap-1.5">
                            {flags.map((flag) => (
                              <span
                                key={flag}
                                className="inline-flex w-fit rounded-md border border-[#d6dcd2] bg-[#f1f3ee] px-2.5 py-1 text-xs font-medium text-[#59684c]"
                              >
                                {flag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4 sm:px-6">
                        <Badge status={candidate.status}>
                          {candidate.status}
                        </Badge>
                      </td>

                      <td className="px-5 py-4 sm:px-6">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/candidates/${candidate.id}`, {
                              state: {
                                candidate,
                              },
                            })
                          }
                          className="rounded-lg border border-[#d6dcd2] px-4 py-2 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee]"
                        >
                          View Candidate
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </DashboardLayout>
  )
}

export default CandidateList