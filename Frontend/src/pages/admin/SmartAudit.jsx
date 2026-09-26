import { useState } from "react"

import Badge from "../../components/common/Badge"
import Card from "../../components/common/Card"
import DashboardLayout from "../../components/layout/DashboardLayout"
import PageHeader from "../../components/layout/PageHeader"

function SmartAudit() {
  const [actionFilter, setActionFilter] = useState("All Actions")
  const [roleFilter, setRoleFilter] = useState("All Roles")

  const auditLogs = [
    {
      id: 1,
      time: "26 Sep 2026, 10:42 AM",
      user: "Admin User",
      role: "Admin",
      action: "Resume Scored",
      candidate: "Priya Sharma",
      details: "AI resume screening completed",
      status: "Completed",
    },
    {
      id: 2,
      time: "26 Sep 2026, 10:35 AM",
      user: "Admin User",
      role: "Admin",
      action: "Candidate Promoted",
      candidate: "Priya Sharma",
      details: "Candidate moved to screening test",
      status: "Completed",
    },
    {
      id: 3,
      time: "26 Sep 2026, 10:20 AM",
      user: "AI Screening",
      role: "System",
      action: "Answer Scored",
      candidate: "Karthik M",
      details: "Screening answer evaluation completed",
      status: "Completed",
    },
    {
      id: 4,
      time: "26 Sep 2026, 09:55 AM",
      user: "Rahul Kumar",
      role: "Interviewer",
      action: "Interview Decision",
      candidate: "Aarav Kumar",
      details: "Candidate marked On-Hold",
      status: "Completed",
    },
    {
      id: 5,
      time: "26 Sep 2026, 09:40 AM",
      user: "Admin User",
      role: "Admin",
      action: "Interviewer Assigned",
      candidate: "Karthik M",
      details: "Ananya Rao assigned for interview",
      status: "Completed",
    },
    {
      id: 6,
      time: "26 Sep 2026, 09:15 AM",
      user: "AI Screening",
      role: "System",
      action: "Low Confidence Flag",
      candidate: "Rahul Raj",
      details: "AI confidence below configured threshold",
      status: "Review",
    },
  ]

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction =
      actionFilter === "All Actions" || log.action === actionFilter

    const matchesRole =
      roleFilter === "All Roles" || log.role === roleFilter

    return matchesAction && matchesRole
  })

  const totalEvents = auditLogs.length

  const aiEvents = auditLogs.filter(
    (log) => log.role === "System"
  ).length

  const reviewEvents = auditLogs.filter(
    (log) => log.status === "Review"
  ).length

  return (
    <DashboardLayout topbarTitle="Smart Audit">
      <PageHeader
        description="Track important candidate, interview, and AI screening activities"
        eyebrow="Audit & activity"
        title="Smart Audit"
      />

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Total Events
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {totalEvents}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Recorded activities
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            AI Events
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {aiEvents}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            AI screening activities
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Needs Review
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {reviewEvents}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Events requiring attention
          </p>
        </Card>

      </div>

      {/* Filters */}
      <Card className="mb-6 p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          <select
            aria-label="Filter audit actions"
            value={actionFilter}
            onChange={(event) => setActionFilter(event.target.value)}
            className="min-h-11 rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#434a40] outline-none transition-colors hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
          >
            <option>All Actions</option>
            <option>Resume Scored</option>
            <option>Candidate Promoted</option>
            <option>Answer Scored</option>
            <option>Interview Decision</option>
            <option>Interviewer Assigned</option>
            <option>Low Confidence Flag</option>
          </select>

          <select
            aria-label="Filter audit roles"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="min-h-11 rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#434a40] outline-none transition-colors hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
          >
            <option>All Roles</option>
            <option>Admin</option>
            <option>Interviewer</option>
            <option>System</option>
          </select>

        </div>
      </Card>

      {/* Audit table */}
      <Card className="overflow-hidden">

        <div className="border-b border-[#e0e4dc] px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-[#292d28]">
            Activity Log
          </h2>

          <p className="mt-1 text-sm text-[#697066]">
            Timestamped record of important system activities.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">

            <thead className="border-b border-[#dfe4db] bg-[#edf0ea]">
              <tr>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Time
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  User
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Action
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Candidate
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Details
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-[#747b71] sm:px-6">
                  Status
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-[#e7eae3]">

              {filteredLogs.map((log) => (

                <tr
                  key={log.id}
                  className="transition-colors hover:bg-[#f0f3ed]"
                >

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-[#697066] sm:px-6">
                    {log.time}
                  </td>

                  <td className="px-5 py-4 sm:px-6">
                    <p className="font-medium text-[#292d28]">
                      {log.user}
                    </p>

                    <p className="mt-1 text-xs text-[#838a7f]">
                      {log.role}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-[#59684c] sm:px-6">
                    {log.action}
                  </td>

                  <td className="px-5 py-4 text-sm text-[#697066] sm:px-6">
                    {log.candidate}
                  </td>

                  <td className="max-w-xs px-5 py-4 text-sm text-[#697066] sm:px-6">
                    {log.details}
                  </td>

                  <td className="px-5 py-4 sm:px-6">
                    <Badge status={log.status}>
                      {log.status}
                    </Badge>
                  </td>

                </tr>

              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-10 text-center text-sm text-[#697066]"
                  >
                    No audit events found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        </div>

      </Card>
    </DashboardLayout>
  )
}

export default SmartAudit