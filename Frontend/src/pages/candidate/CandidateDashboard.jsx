import { useNavigate } from "react-router-dom"

import Badge from "../../components/common/Badge"
import Card from "../../components/common/Card"
import CandidateSidebar from "../../components/layout/CandidateSidebar"
import PageHeader from "../../components/layout/PageHeader"
import Topbar from "../../components/layout/Topbar"

const applicationSteps = [
  {
    title: "Application Submitted",
    description: "Your application has been successfully received.",
    status: "Completed",
  },
  {
    title: "Resume Screening",
    description: "Your resume has been evaluated for this position.",
    status: "Completed",
  },
  {
    title: "Screening Test",
    description: "Your screening test has been completed.",
    status: "Completed",
  },
  {
    title: "Interview",
    description: "Your interview has been scheduled. View the interview details below.",
    status: "Scheduled",
  },
]

function CandidateDashboard() {
  const navigate = useNavigate()

  return (
    <div className="dashboard-canvas flex min-h-screen flex-col text-[#292d28] lg:flex-row">
      <CandidateSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title="Candidate dashboard"
          topbarContent={
            <span className="ml-2 border-l border-[#d6dcd2] pl-4 text-sm text-[#697066]">
              Candidate portal
            </span>
          }
        />

        <main className="min-w-0 flex-1 p-5 sm:p-6 lg:p-8">
          <PageHeader
            description="Track your application and screening progress."
            eyebrow="Candidate portal"
            title="Candidate Dashboard"
          />

          {/* Current Application */}
          <Card
            as="section"
            className="mb-6 p-5 sm:p-6"
            aria-labelledby="current-application-title"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-[#747b71]">
                  Current Application
                </p>

                <h2
                  id="current-application-title"
                  className="mt-2 text-2xl font-semibold text-[#292d28]"
                >
                  Frontend Developer
                </h2>

                <div className="mt-3 flex flex-wrap gap-2 text-sm text-[#697066]">
                  <span className="rounded-md border border-[#e0e4dc] bg-[#f1f3ee] px-3 py-1.5">
                    Mumbai
                  </span>

                  <span className="rounded-md border border-[#e0e4dc] bg-[#f1f3ee] px-3 py-1.5">
                    2+ Years Experience
                  </span>
                </div>
              </div>

              <Badge status="Scheduled">
                Interview Scheduled
              </Badge>
            </div>
          </Card>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">

            {/* Application Progress */}
            <Card
              as="section"
              className="p-5 sm:p-6"
              aria-labelledby="application-progress-title"
            >
              <div className="mb-5">
                <h2
                  id="application-progress-title"
                  className="text-xl font-semibold text-[#292d28]"
                >
                  Application Progress
                </h2>

                <p className="mt-1 text-sm text-[#697066]">
                  Follow the progress of your application.
                </p>
              </div>

              <ol className="divide-y divide-[#e1e5dd]">
                {applicationSteps.map((step, index) => {
                  const isComplete = step.status === "Completed"
                  const isCurrent = step.status === "Scheduled"

                  return (
                    <li
                      key={step.title}
                      className="flex gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-semibold ${
                          isComplete
                            ? "border-[#879276] bg-[#879276] text-white"
                            : isCurrent
                              ? "border-[#59684c] bg-[#59684c] text-white"
                              : "border-[#d4d9d0] bg-[#f1f3ee] text-[#838a7f]"
                        }`}
                      >
                        {isComplete ? "✓" : index + 1}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                          <h3
                            className={`font-medium ${
                              step.status === "Pending"
                                ? "text-[#697066]"
                                : "text-[#292d28]"
                            }`}
                          >
                            {step.title}
                          </h3>

                          <span
                            className={`text-xs font-medium ${
                              isCurrent
                                ? "text-[#59684c]"
                                : "text-[#838a7f]"
                            }`}
                          >
                            {step.status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm leading-6 text-[#697066]">
                          {step.description}
                        </p>

                        {/* Interview button */}
                        {step.title === "Interview" && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate("/candidate/interview")
                            }
                            className="mt-3 rounded-lg border border-[#d6dcd2] px-4 py-2 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee]"
                          >
                            View Interview Details
                          </button>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </Card>

            {/* Next Step */}
            <Card
              as="section"
              className="p-5 sm:p-6"
              aria-labelledby="next-steps-title"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
                Next step
              </p>

              <h2
                id="next-steps-title"
                className="mt-2 text-lg font-semibold text-[#292d28]"
              >
                Prepare for your interview
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#697066]">
                Your interview has been scheduled. Review the interview
                details and make sure you are ready before the scheduled
                time.
              </p>

              <button
                type="button"
                onClick={() => navigate("/candidate/interview")}
                className="mt-5 w-full rounded-lg bg-[#59684c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d5b42]"
              >
                View Interview
              </button>
            </Card>
          </div>

          {/* Interview Status */}
          <Card
            as="section"
            className="mt-6 p-5 sm:p-6"
            aria-labelledby="interview-status-title"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
                  Current stage
                </p>

                <h2
                  id="interview-status-title"
                  className="mt-2 text-xl font-semibold text-[#292d28]"
                >
                  Interview Scheduled
                </h2>

                <p className="mt-1 text-sm text-[#697066]">
                  Your next stage is the technical interview for the Frontend
                  Developer position.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] px-4 py-3">
                  <p className="text-xs text-[#838a7f]">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#292d28]">
                    29 Sep 2026
                  </p>
                </div>

                <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] px-4 py-3">
                  <p className="text-xs text-[#838a7f]">
                    Time
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#292d28]">
                    02:00 PM
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/candidate/interview")}
                  className="rounded-lg border border-[#d6dcd2] px-4 py-2.5 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee]"
                >
                  Interview Details
                </button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default CandidateDashboard