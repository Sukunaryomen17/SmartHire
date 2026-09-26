import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import Badge from "../../components/common/Badge"
import Card from "../../components/common/Card"
import DashboardLayout from "../../components/layout/DashboardLayout"
import PageHeader from "../../components/layout/PageHeader"
import API from "../../api"

function Interviews() {
  const navigate = useNavigate()

  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await API.get("/candidates")

        const data =
          response.data?.candidates ||
          response.data?.data ||
          response.data ||
          []

        setCandidates(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Failed to load candidates:", err)
        setError("Unable to load candidate data.")
        setCandidates([])
      } finally {
        setLoading(false)
      }
    }

    loadCandidates()
  }, [])

  /*
   * Only candidates who have passed resume screening
   * are considered for the interview stage.
   *
   * The actual candidate/job information comes from MongoDB.
   */
  const interviewCandidates = candidates.filter(
    (candidate) =>
      candidate.screeningStatus === "shortlisted"
  )

  const scheduledCount = interviewCandidates.filter(
    (candidate) =>
      candidate.interviewStatus === "Scheduled"
  ).length

  const pendingCount = interviewCandidates.filter(
    (candidate) =>
      candidate.interviewStatus !== "Scheduled"
  ).length

  const assignedCount = interviewCandidates.filter(
    (candidate) =>
      candidate.interviewer &&
      candidate.interviewer !== "Not Assigned"
  ).length

  const getCandidateName = (candidate) => {
    return candidate.name || "Unnamed Candidate"
  }

  const getJobTitle = (candidate) => {
    return (
      candidate.appliedJobId?.title ||
      "Job unavailable"
    )
  }

  const getInterviewer = (candidate) => {
    return candidate.interviewer || "Not Assigned"
  }

  const getInterviewDate = (candidate) => {
    if (!candidate.interviewDate) {
      return "Not Scheduled"
    }

    const date = new Date(candidate.interviewDate)

    if (Number.isNaN(date.getTime())) {
      return candidate.interviewDate
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const getInterviewTime = (candidate) => {
    if (!candidate.interviewTime) {
      return "-"
    }

    return candidate.interviewTime
  }

  const getInterviewStatus = (candidate) => {
    return candidate.interviewStatus || "Pending"
  }

  return (
    <DashboardLayout topbarTitle="Interview management">
      <PageHeader
        description="Manage interview schedules, interviewers, and candidate interviews"
        eyebrow="Interview management"
        title="Interviews"
      />

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Scheduled Interviews
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {scheduledCount}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Upcoming interviews
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Pending Interviews
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {pendingCount}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Candidates awaiting scheduling
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Assigned Interviewers
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {assignedCount}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Candidates with an interviewer
          </p>
        </Card>

      </div>

      {/* Error */}
      {error && (
        <Card className="mb-6 border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </Card>
      )}

      {/* Interview table */}
      <Card className="overflow-hidden">

        <div className="border-b border-[#e0e4dc] px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-[#292d28]">
            Interview Schedule
          </h2>

          <p className="mt-1 text-sm text-[#697066]">
            Review upcoming interviews and candidate assignments.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">

            <thead className="border-b border-[#dfe4db] bg-[#edf0ea]">
              <tr>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Candidate
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Job
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Interviewer
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Date
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Time
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

              {loading && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-10 text-center text-sm text-[#697066]"
                  >
                    Loading interview candidates...
                  </td>
                </tr>
              )}

              {!loading && interviewCandidates.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-10 text-center text-sm text-[#697066]"
                  >
                    No shortlisted candidates are available for interviews.
                  </td>
                </tr>
              )}

              {!loading &&
                interviewCandidates.map((candidate) => {

                  const status =
                    getInterviewStatus(candidate)

                  return (
                    <tr
                      key={candidate._id}
                      className="transition-colors hover:bg-[#f0f3ed]"
                    >

                      <td className="px-5 py-4 sm:px-6">
                        <p className="font-medium text-[#292d28]">
                          {getCandidateName(candidate)}
                        </p>

                        {candidate.email && (
                          <p className="mt-1 text-xs text-[#838a7f]">
                            {candidate.email}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#697066] sm:px-6">
                        {getJobTitle(candidate)}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#697066] sm:px-6">
                        {getInterviewer(candidate)}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#697066] sm:px-6">
                        {getInterviewDate(candidate)}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#697066] sm:px-6">
                        {getInterviewTime(candidate)}
                      </td>

                      <td className="px-5 py-4 sm:px-6">
                        <Badge status={status}>
                          {status}
                        </Badge>
                      </td>

                      <td className="px-5 py-4 sm:px-6">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/candidates/${candidate._id}`
                            )
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
    </DashboardLayout>
  )
}

export default Interviews