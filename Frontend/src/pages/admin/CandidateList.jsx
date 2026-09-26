import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../../api"
import Badge from "../../components/common/Badge"
import Card from "../../components/common/Card"
import Input from "../../components/common/Input"
import DashboardLayout from "../../components/layout/DashboardLayout"
import PageHeader from "../../components/layout/PageHeader"

function CandidateList() {
  const navigate = useNavigate()

  const [candidates, setCandidates] = useState([])
  const [search, setSearch] = useState("")

  // Apply By filters
  const [jobFilter, setJobFilter] = useState("All Jobs")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [candidateFilter, setCandidateFilter] = useState("All Candidates")

  // Score sorting
  const [resumeSort, setResumeSort] = useState(null)
  const [qaSort, setQaSort] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    API.get("/candidates")
      .then((response) => {
        setCandidates(response.data.candidates || [])
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Unable to load candidates."
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Get unique jobs for the Job dropdown
  const jobs = useMemo(() => {
    const uniqueJobs = new Map()

    candidates.forEach((candidate) => {
      const job = candidate.appliedJobId

      if (job && typeof job === "object" && job._id) {
        uniqueJobs.set(job._id, job.title || "Untitled Job")
      }
    })

    return Array.from(uniqueJobs.entries())
  }, [candidates])

  const getQaScore = (candidate) => {
    return candidate.qaScore ?? candidate.testScore ?? null
  }

  const filtered = useMemo(() => {
    let result = candidates.filter((candidate) => {
      const jobTitle =
        typeof candidate.appliedJobId === "object"
          ? candidate.appliedJobId?.title || ""
          : ""

      const jobId =
        typeof candidate.appliedJobId === "object"
          ? candidate.appliedJobId?._id
          : candidate.appliedJobId

      const searchText = `
        ${candidate.name || ""}
        ${candidate.email || ""}
        ${jobTitle}
      `.toLowerCase()

      const matchesSearch = searchText.includes(search.toLowerCase())

      const matchesJob =
        jobFilter === "All Jobs" || jobId === jobFilter

      const matchesStatus =
        statusFilter === "All Status" ||
        candidate.screeningStatus === statusFilter

      let matchesCandidateFilter = true

      if (candidateFilter === "Needs Review") {
        matchesCandidateFilter =
          candidate.screeningStatus === "pending"
      }

      if (candidateFilter === "Low Confidence") {
        matchesCandidateFilter =
          candidate.screeningResult?.confidence !== undefined &&
          Number(candidate.screeningResult.confidence) < 0.7
      }

      if (candidateFilter === "Score Disagreement") {
        const resumeScore = candidate.resumeScore
        const qaScore = getQaScore(candidate)

        matchesCandidateFilter =
          resumeScore !== null &&
          qaScore !== null &&
          Math.abs(Number(resumeScore) - Number(qaScore)) >= 20
      }

      return (
        matchesSearch &&
        matchesJob &&
        matchesStatus &&
        matchesCandidateFilter
      )
    })

    // Resume score sorting
    if (resumeSort) {
      result = [...result].sort((a, b) => {
        const aScore = a.resumeScore ?? -1
        const bScore = b.resumeScore ?? -1

        return resumeSort === "asc"
          ? aScore - bScore
          : bScore - aScore
      })
    }

    // Q&A score sorting
    if (qaSort) {
      result = [...result].sort((a, b) => {
        const aScore = getQaScore(a) ?? -1
        const bScore = getQaScore(b) ?? -1

        return qaSort === "asc"
          ? aScore - bScore
          : bScore - aScore
      })
    }

    return result
  }, [
    candidates,
    search,
    jobFilter,
    statusFilter,
    candidateFilter,
    resumeSort,
    qaSort,
  ])

  const handleResumeSort = () => {
    setQaSort(null)

    if (resumeSort === null) {
      setResumeSort("desc")
    } else if (resumeSort === "desc") {
      setResumeSort("asc")
    } else {
      setResumeSort(null)
    }
  }

  const handleQaSort = () => {
    setResumeSort(null)

    if (qaSort === null) {
      setQaSort("desc")
    } else if (qaSort === "desc") {
      setQaSort("asc")
    } else {
      setQaSort(null)
    }
  }

  const SortArrow = ({ direction }) => {
    if (direction === "desc") {
      return <span className="ml-1 text-xs">↓</span>
    }

    if (direction === "asc") {
      return <span className="ml-1 text-xs">↑</span>
    }

    return <span className="ml-1 text-xs text-[#a0a69d]">↕</span>
  }

  return (
    <DashboardLayout topbarTitle="Candidate management">
      <PageHeader
        description="Review candidate applications and AI screening results."
        eyebrow="Candidate management"
        title="Candidates"
      />

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Search and Apply By */}
      <Card className="mb-6 p-4 sm:p-5">
        <div className="mb-4">
          <p className="text-sm font-semibold text-[#30362e]">
            Apply By
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Input
            placeholder="Search candidate or job..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={jobFilter}
            onChange={(event) => setJobFilter(event.target.value)}
            className="min-h-11 rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#30362e] outline-none"
          >
            <option>All Jobs</option>

            {jobs.map(([jobId, jobTitle]) => (
              <option key={jobId} value={jobId}>
                {jobTitle}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="min-h-11 rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#30362e] outline-none"
          >
            <option>All Status</option>
            <option value="pending">Pending</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={candidateFilter}
            onChange={(event) => setCandidateFilter(event.target.value)}
            className="min-h-11 rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#30362e] outline-none"
          >
            <option>All Candidates</option>
            <option value="Needs Review">Needs Review</option>
            <option value="Low Confidence">Low Confidence</option>
            <option value="Score Disagreement">
              Score Disagreement
            </option>
          </select>
        </div>
      </Card>

      {loading ? (
        <Card className="p-8 text-center text-sm text-[#697066]">
          Loading candidates...
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center text-sm text-[#697066]">
          No candidate applications found.
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b border-[#e0e4dc] bg-[#f7f8f3] text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#697066]">
                    Candidate
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#697066]">
                    Job
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#697066]">
                    <button
                      type="button"
                      onClick={handleResumeSort}
                      className="inline-flex items-center hover:text-[#59684c]"
                    >
                      Resume Score
                      <SortArrow direction={resumeSort} />
                    </button>
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#697066]">
                    <button
                      type="button"
                      onClick={handleQaSort}
                      className="inline-flex items-center hover:text-[#59684c]"
                    >
                      Q&amp;A Score
                      <SortArrow direction={qaSort} />
                    </button>
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#697066]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#697066]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((candidate) => {
                  const jobTitle =
                    typeof candidate.appliedJobId === "object"
                      ? candidate.appliedJobId?.title ||
                        "Job unavailable"
                      : "Job unavailable"

                  const qaScore = getQaScore(candidate)

                  return (
                    <tr
                      key={candidate._id}
                      className="border-b border-[#edf0ea] last:border-b-0 hover:bg-[#fbfcf8]"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-[#30362e]">
                            {candidate.name}
                          </p>

                          <p className="mt-1 text-xs text-[#838a7f]">
                            {candidate.email}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-[#596158]">
                        {jobTitle}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-[#30362e]">
                          {candidate.resumeScore ?? "Pending"}
                        </span>

                        {candidate.resumeScore !== null &&
                          candidate.resumeScore !== undefined && (
                            <span className="text-xs text-[#838a7f]">
                              /100
                            </span>
                          )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-[#30362e]">
                          {qaScore ?? "Pending"}
                        </span>

                        {qaScore !== null && qaScore !== undefined && (
                          <span className="text-xs text-[#838a7f]">
                            /100
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <Badge status={candidate.screeningStatus}>
                          {candidate.screeningStatus}
                        </Badge>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/candidates/${candidate._id}`
                            )
                          }
                          className="rounded-lg border border-[#d6dcd2] px-3 py-2 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f4ed]"
                        >
                          View
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
