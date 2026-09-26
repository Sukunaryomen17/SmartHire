import { useNavigate } from "react-router-dom"

import Badge from "../../components/common/Badge"
import Card from "../../components/common/Card"
import CandidateSidebar from "../../components/layout/CandidateSidebar"
import PageHeader from "../../components/layout/PageHeader"
import Topbar from "../../components/layout/Topbar"

function CandidateResult() {
  const navigate = useNavigate()

  const result = {
    candidateName: "Aarav Kumar",
    role: "Frontend Developer",
    resumeScore: 86,
    qaScore: 82,
    overallScore: 84,
    status: "PASS",
    nextStage: "Interview",
  }

  return (
    <div className="dashboard-canvas flex min-h-screen flex-col text-[#292d28] lg:flex-row">
      <CandidateSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title="Application result"
          topbarContent={
            <span className="ml-2 border-l border-[#d6dcd2] pl-4 text-sm text-[#697066]">
              Candidate portal
            </span>
          }
        />

        <main className="min-w-0 flex-1 p-5 sm:p-6 lg:p-8">

          <PageHeader
            eyebrow="Candidate portal"
            title="Application Result"
            description="View the current outcome of your screening process."
          />

          {/* Result status */}
          <Card className="mb-6 p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">

              <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
                Screening outcome
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#292d28]">
                Your application has progressed
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#697066]">
                Your screening results have been evaluated and your application
                has progressed to the next stage.
              </p>

              <div className="mt-5">
                <Badge status={result.status}>
                  {result.status}
                </Badge>
              </div>

            </div>
          </Card>

          {/* Application information */}
          <Card className="mb-6 p-5 sm:p-6">

            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[#292d28]">
                Application
              </h2>

              <p className="mt-1 text-sm text-[#697066]">
                Screening information for your current application.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#838a7f]">
                  Candidate
                </p>

                <p className="mt-1 text-sm font-medium text-[#292d28]">
                  {result.candidateName}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#838a7f]">
                  Position
                </p>

                <p className="mt-1 text-sm font-medium text-[#292d28]">
                  {result.role}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#838a7f]">
                  Next Stage
                </p>

                <p className="mt-1 text-sm font-medium text-[#292d28]">
                  {result.nextStage}
                </p>
              </div>

            </div>

          </Card>

          {/* Score summary */}
          <Card className="mb-6 p-5 sm:p-6">

            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[#292d28]">
                Screening Summary
              </h2>

              <p className="mt-1 text-sm text-[#697066]">
                Your screening scores are shown as a summary.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              {/* Resume */}
              <div className="rounded-xl border border-[#e0e4dc] bg-[#f1f3ee] p-5">
                <p className="text-sm text-[#697066]">
                  Resume Score
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                  {result.resumeScore}
                </p>

                <p className="mt-1 text-xs text-[#838a7f]">
                  Out of 100
                </p>
              </div>

              {/* Q&A */}
              <div className="rounded-xl border border-[#e0e4dc] bg-[#f1f3ee] p-5">
                <p className="text-sm text-[#697066]">
                  Screening Test
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#292d28]">
                  {result.qaScore}
                </p>

                <p className="mt-1 text-xs text-[#838a7f]">
                  Out of 100
                </p>
              </div>

              {/* Overall */}
              <div className="rounded-xl border border-[#d6dcd2] bg-[#e9ede5] p-5">
                <p className="text-sm text-[#697066]">
                  Overall Score
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#59684c]">
                  {result.overallScore}
                </p>

                <p className="mt-1 text-xs text-[#838a7f]">
                  Combined screening result
                </p>
              </div>

            </div>

          </Card>

          {/* Next stage */}
          <Card className="p-5 sm:p-6">

            <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
              Next stage
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#292d28]">
              Interview
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#697066]">
              Your screening process is complete. Your next stage is the
              interview. Interview details will be available in your candidate
              portal.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() => navigate("/candidate/interview")}
                className="rounded-lg bg-[#59684c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d5b42]"
              >
                View Interview
              </button>

              <button
                type="button"
                onClick={() => navigate("/candidate")}
                className="rounded-lg border border-[#d6dcd2] px-4 py-2.5 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee]"
              >
                Back to Dashboard
              </button>

            </div>

          </Card>

        </main>
      </div>
    </div>
  )
}

export default CandidateResult