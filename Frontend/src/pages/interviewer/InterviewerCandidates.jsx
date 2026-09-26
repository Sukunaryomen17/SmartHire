import { useNavigate } from "react-router-dom"

import Badge from "../../components/common/Badge"
import Card from "../../components/common/Card"
import InterviewerSidebar from "../../components/layout/InterviewerSidebar"
import PageHeader from "../../components/layout/PageHeader"
import Topbar from "../../components/layout/Topbar"

const assignedCandidates = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Java Backend Developer",
    date: "28 Sep 2026",
    time: "10:00 AM",
    status: "Interview",
  },
  {
    id: 2,
    name: "Karthik M",
    role: "Java Backend Developer",
    date: "28 Sep 2026",
    time: "11:30 AM",
    status: "Interview",
  },
  {
    id: 3,
    name: "Aarav Kumar",
    role: "Frontend Developer",
    date: "29 Sep 2026",
    time: "02:00 PM",
    status: "Interview",
  },
]

function InterviewerCandidates() {
  const navigate = useNavigate()

  const handleViewCandidate = (candidate) => {
    navigate("/interviewer/evaluation", {
      state: {
        candidate,
      },
    })
  }

  return (
    <div className="dashboard-canvas flex min-h-screen flex-col text-[#292d28] lg:flex-row">
      <InterviewerSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title="Interviewer Portal"
          subtitle="Review your assigned candidates and interview schedule"
        />

        <main className="min-w-0 flex-1 p-5 sm:p-6 lg:p-8">
          <PageHeader
            title="Assigned Candidates"
            description="Candidates assigned to you for interview evaluation."
          />

          {/* Summary cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-5">
              <p className="text-sm text-[#747b71]">
                Assigned Candidates
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                {assignedCandidates.length}
              </p>
            </Card>

            <Card className="p-5">
              <p className="text-sm text-[#747b71]">
                Upcoming Interviews
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                {assignedCandidates.length}
              </p>
            </Card>

            <Card className="p-5">
              <p className="text-sm text-[#747b71]">
                Completed
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                0
              </p>
            </Card>
          </div>

          {/* Candidate table */}
          <Card className="mt-6 overflow-hidden">
            <div className="border-b border-[#e0e4dc] px-5 py-4">
              <h2 className="text-lg font-semibold text-[#292d28]">
                Interview Schedule
              </h2>

              <p className="mt-1 text-sm text-[#747b71]">
                Review candidate details before conducting the interview.
              </p>
            </div>

            {/* Desktop table */}
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
                  {assignedCandidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="border-b border-[#e1e5dd] last:border-b-0"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-[#292d28]">
                          {candidate.name}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-[#697066]">
                        {candidate.role}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#697066]">
                        {candidate.date}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#697066]">
                        {candidate.time}
                      </td>

                      <td className="px-5 py-4">
                        <Badge>{candidate.status}</Badge>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleViewCandidate(candidate)}
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

            {/* Mobile cards */}
            <div className="space-y-4 p-4 md:hidden">
              {assignedCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="rounded-xl border border-[#e0e4dc] bg-[#f8f9f6] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#292d28]">
                        {candidate.name}
                      </p>

                      <p className="mt-1 text-sm text-[#697066]">
                        {candidate.role}
                      </p>
                    </div>

                    <Badge>{candidate.status}</Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-[#838a7f]">
                        Date
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#292d28]">
                        {candidate.date}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#838a7f]">
                        Time
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#292d28]">
                        {candidate.time}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleViewCandidate(candidate)}
                    className="mt-4 w-full rounded-lg border border-[#d6dcd2] px-4 py-2.5 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee]"
                  >
                    View Candidate
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default InterviewerCandidates