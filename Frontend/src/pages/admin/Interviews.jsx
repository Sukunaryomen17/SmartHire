import { useNavigate } from "react-router-dom"

import Badge from "../../components/common/Badge"
import Card from "../../components/common/Card"
import DashboardLayout from "../../components/layout/DashboardLayout"
import PageHeader from "../../components/layout/PageHeader"

function Interviews() {
  const navigate = useNavigate()

  const interviews = [
    {
      id: 1,
      candidateId: 2,
      candidate: "Priya Sharma",
      job: "Java Backend Developer",
      interviewer: "Rahul Kumar",
      date: "28 Sep 2026",
      time: "10:00 AM",
      status: "Scheduled",
    },
    {
      id: 2,
      candidateId: 5,
      candidate: "Karthik M",
      job: "Java Backend Developer",
      interviewer: "Ananya Rao",
      date: "28 Sep 2026",
      time: "11:30 AM",
      status: "Scheduled",
    },
    {
      id: 3,
      candidateId: 1,
      candidate: "Aarav Kumar",
      job: "Frontend Developer",
      interviewer: "Rahul Kumar",
      date: "29 Sep 2026",
      time: "02:00 PM",
      status: "Scheduled",
    },
    {
      id: 4,
      candidateId: 3,
      candidate: "Rahul Raj",
      job: "Python Developer",
      interviewer: "Not Assigned",
      date: "Not Scheduled",
      time: "-",
      status: "Pending",
    },
  ]

  const scheduledCount = interviews.filter(
    (interview) => interview.status === "Scheduled"
  ).length

  const pendingCount = interviews.filter(
    (interview) => interview.status === "Pending"
  ).length

  const assignedCount = interviews.filter(
    (interview) => interview.interviewer !== "Not Assigned"
  ).length

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

              {interviews.map((interview) => (

                <tr
                  key={interview.id}
                  className="transition-colors hover:bg-[#f0f3ed]"
                >

                  <td className="px-5 py-4 sm:px-6">
                    <p className="font-medium text-[#292d28]">
                      {interview.candidate}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-[#697066] sm:px-6">
                    {interview.job}
                  </td>

                  <td className="px-5 py-4 text-sm text-[#697066] sm:px-6">
                    {interview.interviewer}
                  </td>

                  <td className="px-5 py-4 text-sm text-[#697066] sm:px-6">
                    {interview.date}
                  </td>

                  <td className="px-5 py-4 text-sm text-[#697066] sm:px-6">
                    {interview.time}
                  </td>

                  <td className="px-5 py-4 sm:px-6">
                    <Badge status={interview.status}>
                      {interview.status}
                    </Badge>
                  </td>

                  <td className="px-5 py-4 sm:px-6">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/candidates/${interview.candidateId}`
                        )
                      }
                      className="rounded-lg border border-[#d6dcd2] px-4 py-2 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee]"
                    >
                      View Candidate
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}

export default Interviews