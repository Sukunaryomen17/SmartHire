import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import API from "../../api"

import Badge from "../../components/common/Badge"
import Card from "../../components/common/Card"
import InterviewerSidebar from "../../components/layout/InterviewerSidebar"
import PageHeader from "../../components/layout/PageHeader"
import Topbar from "../../components/layout/Topbar"

function InterviewerCandidates() {
  const navigate = useNavigate()

  const [candidates, setCandidates] = useState([])
  const [interviews, setInterviews] = useState({})

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

      const shortlisted = data.filter(
        (candidate) =>
          candidate.screeningStatus === "shortlisted"
      )

      setCandidates(shortlisted)

      const interviewResults = await Promise.all(
        shortlisted.map(async (candidate) => {
          try {
            const interviewResponse = await API.get(
              `/interviews/application/${candidate._id}`
            )

            const interviewData =
              interviewResponse.data?.data ||
              interviewResponse.data ||
              []

            return [
              candidate._id,
              Array.isArray(interviewData)
                ? interviewData
                : [interviewData],
            ]
          } catch (err) {
            console.error(
              `Unable to load interview for ${candidate._id}`,
              err
            )

            return [candidate._id, []]
          }
        })
      )

      setInterviews(
        Object.fromEntries(interviewResults)
      )
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ||
          "Unable to load assigned candidates."
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

  const getLatestInterview = (candidate) => {
    const candidateInterviews =
      interviews[candidate._id] || []

    if (candidateInterviews.length === 0) {
      return null
    }

    return [...candidateInterviews].sort(
      (a, b) =>
        new Date(b.scheduledAt) -
        new Date(a.scheduledAt)
    )[0]
  }

  const formatDate = (date) => {
    if (!date) {
      return "Not scheduled"
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

  const handleViewCandidate = (
    candidate,
    interview
  ) => {
    navigate("/interviewer/evaluation", {
      state: {
        candidate,
        interview,
      },
    })
  }

  const completedCount = candidates.filter(
    (candidate) =>
      getLatestInterview(candidate)?.status ===
      "COMPLETED"
  ).length

  const upcomingCount = candidates.filter(
    (candidate) =>
      getLatestInterview(candidate)?.status ===
      "SCHEDULED"
  ).length

  return (
    <div className="dashboard-canvas flex min-h-screen flex-col text-[#292d28] lg:flex-row">
      <InterviewerSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title="Interviewer Portal"
          subtitle="Review assigned candidates and interview schedule"
        />

        <main className="min-w-0 flex-1 p-5 sm:p-6 lg:p-8">
          <PageHeader
            title="Assigned Candidates"
            description="Candidates shortlisted for interview evaluation."
          />

          {error && (
            <div className="mt-6 rounded-lg border border-[#e2d4c6] bg-[#faf4ed] px-4 py-3">
              <p className="text-sm text-[#7a5c42]">
                {error}
              </p>
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-5">
              <p className="text-sm text-[#747b71]">
                Assigned Candidates
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                {candidates.length}
              </p>
            </Card>

            <Card className="p-5">
              <p className="text-sm text-[#747b71]">
                Upcoming Interviews
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                {upcomingCount}
              </p>
            </Card>

            <Card className="p-5">
              <p className="text-sm text-[#747b71]">
                Completed
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                {completedCount}
              </p>
            </Card>
          </div>

          <Card className="mt-6 overflow-hidden">
            <div className="border-b border-[#e0e4dc] px-5 py-4">
              <h2 className="text-lg font-semibold text-[#292d28]">
                Interview Schedule
              </h2>

              <p className="mt-1 text-sm text-[#747b71]">
                Review candidate details before conducting the interview.
              </p>
            </div>

            {loading ? (
              <div className="px-6 py-12 text-center text-sm text-[#697066]">
                Loading candidates...
              </div>
            ) : candidates.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-[#697066]">
                No shortlisted candidates available.
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left">
                    <thead className="border-b border-[#e0e4dc] bg-[#f1f3ee]">
                      <tr>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#737d68]">
                          Candidate
                        </th>

                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#737d68]">
                          Role
                        </th>

                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#737d68]">
                          Interview Date
                        </th>

                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#737d68]">
                          Time
                        </th>

                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#737d68]">
                          Status
                        </th>

                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#737d68]">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {candidates.map((candidate) => {
                        const interview =
                          getLatestInterview(candidate)

                        return (
                          <tr
                            key={candidate._id}
                            className="border-b border-[#e1e5dd] last:border-b-0"
                          >
                            <td className="px-5 py-4">
                              <p className="font-medium text-[#292d28]">
                                {candidate.name}
                              </p>
                            </td>

                            <td className="px-5 py-4 text-sm text-[#697066]">
                              {getJobTitle(candidate)}
                            </td>

                            <td className="px-5 py-4 text-sm text-[#697066]">
                              {formatDate(
                                interview?.scheduledAt
                              )}
                            </td>

                            <td className="px-5 py-4 text-sm text-[#697066]">
                              {formatTime(
                                interview?.scheduledAt
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <Badge>
                                {interview?.status ||
                                  "Not Scheduled"}
                              </Badge>
                            </td>

                            <td className="px-5 py-4 text-right">
                              <button
                                type="button"
                                disabled={!interview}
                                onClick={() =>
                                  handleViewCandidate(
                                    candidate,
                                    interview
                                  )
                                }
                                className="rounded-lg border border-[#d6dcd2] px-4 py-2 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee] disabled:cursor-not-allowed disabled:opacity-50"
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

                <div className="space-y-4 p-4 md:hidden">
                  {candidates.map((candidate) => {
                    const interview =
                      getLatestInterview(candidate)

                    return (
                      <div
                        key={candidate._id}
                        className="rounded-xl border border-[#e0e4dc] bg-[#f8f9f6] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[#292d28]">
                              {candidate.name}
                            </p>

                            <p className="mt-1 text-sm text-[#697066]">
                              {getJobTitle(candidate)}
                            </p>
                          </div>

                          <Badge>
                            {interview?.status ||
                              "Not Scheduled"}
                          </Badge>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-[#838a7f]">
                              Date
                            </p>

                            <p className="mt-1 text-sm font-medium text-[#292d28]">
                              {formatDate(
                                interview?.scheduledAt
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-[#838a7f]">
                              Time
                            </p>

                            <p className="mt-1 text-sm font-medium text-[#292d28]">
                              {formatTime(
                                interview?.scheduledAt
                              )}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={!interview}
                          onClick={() =>
                            handleViewCandidate(
                              candidate,
                              interview
                            )
                          }
                          className="mt-4 w-full rounded-lg border border-[#d6dcd2] px-4 py-2.5 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          View Candidate
                        </button>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </Card>
        </main>
      </div>
    </div>
  )
}

export default InterviewerCandidates