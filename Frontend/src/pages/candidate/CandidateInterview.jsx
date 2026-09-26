import { useNavigate } from "react-router-dom"

import Badge from "../../components/common/Badge"
import Card from "../../components/common/Card"
import CandidateSidebar from "../../components/layout/CandidateSidebar"
import PageHeader from "../../components/layout/PageHeader"
import Topbar from "../../components/layout/Topbar"

function CandidateInterview() {
  const navigate = useNavigate()

  const interview = {
    role: "Frontend Developer",
    interviewer: "Rahul Kumar",
    interviewerRole: "Senior Java Engineer",
    date: "29 Sep 2026",
    time: "02:00 PM",
    mode: "Online",
    status: "Scheduled",
  }

  return (
    <div className="dashboard-canvas flex min-h-screen flex-col text-[#292d28] lg:flex-row">
      <CandidateSidebar />

      <div className="min-w-0 flex-1">
        <Topbar
          title="Interview"
          subtitle="View your interview schedule and current application status"
        />

        <main className="min-w-0 p-5 sm:p-6 lg:p-8">
          <PageHeader
            eyebrow="Candidate portal"
            title="Interview details"
            description="Your interview has been scheduled. Review the details below."
          />

          {/* Current status */}
          <Card className="mb-6 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-[#697066]">
                  Current application status
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[#292d28]">
                  Interview Scheduled
                </h2>

                <p className="mt-1 text-sm text-[#838a7f]">
                  Your screening process has been completed successfully.
                </p>
              </div>

              <Badge status="Scheduled">
                Scheduled
              </Badge>
            </div>
          </Card>

          {/* Interview information */}
          <Card className="mb-6 p-5 sm:p-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-[#292d28]">
                Interview information
              </h2>

              <p className="mt-1 text-sm text-[#697066]">
                Please review the scheduled interview details.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#838a7f]">
                  Position
                </p>

                <p className="mt-1 text-sm font-medium text-[#292d28]">
                  {interview.role}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#838a7f]">
                  Interviewer
                </p>

                <p className="mt-1 text-sm font-medium text-[#292d28]">
                  {interview.interviewer}
                </p>

                <p className="mt-1 text-xs text-[#697066]">
                  {interview.interviewerRole}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#838a7f]">
                  Date
                </p>

                <p className="mt-1 text-sm font-medium text-[#292d28]">
                  {interview.date}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#838a7f]">
                  Time
                </p>

                <p className="mt-1 text-sm font-medium text-[#292d28]">
                  {interview.time}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#838a7f]">
                  Interview mode
                </p>

                <p className="mt-1 text-sm font-medium text-[#292d28]">
                  {interview.mode}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#838a7f]">
                  Status
                </p>

                <div className="mt-1">
                  <Badge status={interview.status}>
                    {interview.status}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Interview preparation */}
          <Card className="mb-6 p-5 sm:p-6">
            <h2 className="text-base font-semibold text-[#292d28]">
              Interview preparation
            </h2>

            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4">
                <p className="text-sm font-medium text-[#292d28]">
                  Be ready a few minutes before the scheduled time
                </p>

                <p className="mt-1 text-sm text-[#697066]">
                  Keep your system, internet connection, and required
                  interview materials ready.
                </p>
              </div>

              <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4">
                <p className="text-sm font-medium text-[#292d28]">
                  Review your application
                </p>

                <p className="mt-1 text-sm text-[#697066]">
                  Make sure you are familiar with the experience and skills
                  included in your application.
                </p>
              </div>

              <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4">
                <p className="text-sm font-medium text-[#292d28]">
                  Prepare for the technical discussion
                </p>

                <p className="mt-1 text-sm text-[#697066]">
                  Be prepared to discuss your projects, technical skills,
                  problem-solving approach, and experience.
                </p>
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/candidate")}
              className="rounded-lg border border-[#d6dcd2] px-4 py-2.5 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee]"
            >
              Back to Dashboard
            </button>

            <button
              type="button"
              onClick={() => navigate("/candidate/result")}
              className="rounded-lg bg-[#59684c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d5b42]"
            >
              View Application Result
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CandidateInterview