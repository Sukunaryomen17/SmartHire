import { useState } from "react"

import Badge from "../../components/common/Badge"
import Card from "../../components/common/Card"
import CandidateSidebar from "../../components/layout/CandidateSidebar"
import PageHeader from "../../components/layout/PageHeader"
import Topbar from "../../components/layout/Topbar"

function CandidateApplication() {
  const [resume, setResume] = useState(null)
  const [uploaded, setUploaded] = useState(false)

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setResume(file)
    setUploaded(false)
  }

  const handleUpload = () => {
    if (!resume) {
      return
    }

    // Frontend demo only.
    // Actual backend upload will be connected later.
    setUploaded(true)
  }

  const removeResume = () => {
    setResume(null)
    setUploaded(false)
  }

  return (
    <div className="dashboard-canvas flex min-h-screen flex-col text-[#292d28] lg:flex-row">

      <CandidateSidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        <Topbar
          title="My application"
          topbarContent={
            <span className="ml-2 border-l border-[#d6dcd2] pl-4 text-sm text-[#697066]">
              Candidate portal
            </span>
          }
        />

        <main className="min-w-0 flex-1 p-5 sm:p-6 lg:p-8">

          <PageHeader
            eyebrow="Candidate portal"
            title="My Application"
            description="Complete your application and submit your resume."
          />

          {/* Job Details */}
          <Card
            as="section"
            className="mb-6 p-5 sm:p-6"
            aria-labelledby="application-title"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-medium text-[#747b71]">
                  Applying for
                </p>

                <h2
                  id="application-title"
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

              <Badge status="SCREENING">
                Screening
              </Badge>

            </div>
          </Card>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">

            {/* Resume Upload */}
            <Card
              as="section"
              className="p-5 sm:p-6"
              aria-labelledby="resume-title"
            >

              <div className="mb-6">

                <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
                  Application document
                </p>

                <h2
                  id="resume-title"
                  className="mt-2 text-xl font-semibold text-[#292d28]"
                >
                  Upload Resume
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#697066]">
                  Upload the resume you want to use for this application.
                </p>

              </div>

              {!resume ? (
                <label
                  htmlFor="resume-upload"
                  className="block cursor-pointer"
                >
                  <div className="rounded-xl border border-dashed border-[#cfd5ca] bg-[#f8f9f6] px-6 py-12 text-center transition hover:border-[#879276] hover:bg-[#f1f3ee]">

                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-[#d9ded5] bg-white text-[#59684c]">
                      <span className="text-xl font-semibold">
                        ↑
                      </span>
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-[#292d28]">
                      Choose your resume
                    </h3>

                    <p className="mt-2 text-sm text-[#697066]">
                      Click here to select your resume
                    </p>

                    <p className="mt-2 text-xs text-[#838a7f]">
                      PDF or DOCX
                    </p>

                  </div>

                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="hidden"
                  />

                </label>
              ) : (
                <div className="rounded-xl border border-[#dfe4db] bg-[#f8f9f6] p-5">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex min-w-0 items-center gap-4">

                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[#d9ded5] bg-white text-[#59684c]">
                        <span className="text-xs font-semibold">
                          CV
                        </span>
                      </div>

                      <div className="min-w-0">

                        <p className="break-all text-sm font-semibold text-[#292d28]">
                          {resume.name}
                        </p>

                        <p className="mt-1 text-xs text-[#838a7f]">
                          {(resume.size / 1024).toFixed(1)} KB
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={removeResume}
                      className="rounded-md px-3 py-2 text-sm font-medium text-[#697066] hover:bg-white hover:text-[#292d28]"
                    >
                      Remove
                    </button>

                  </div>

                </div>
              )}

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="max-w-lg text-xs leading-5 text-[#838a7f]">
                  Your resume will be used for the application screening
                  process.
                </p>

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!resume || uploaded}
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                    resume && !uploaded
                      ? "bg-[#59684c] text-white hover:bg-[#4e5c43]"
                      : "cursor-not-allowed bg-[#e4e8e0] text-[#9aa095]"
                  }`}
                >
                  {uploaded ? "Resume Submitted" : "Submit Resume"}
                </button>

              </div>

              {uploaded && (
                <div className="mt-5 rounded-xl border border-[#cfd8c7] bg-[#eef2ea] p-4">

                  <p className="text-sm font-semibold text-[#59684c]">
                    Resume submitted successfully.
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#697066]">
                    Your resume is now ready for screening.
                  </p>

                </div>
              )}

            </Card>

            {/* Screening Status */}
            <Card
              as="section"
              className="p-5 sm:p-6"
              aria-labelledby="screening-title"
            >

              <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
                Current stage
              </p>

              <h2
                id="screening-title"
                className="mt-2 text-lg font-semibold text-[#292d28]"
              >
                Resume Screening
              </h2>

              <div className="mt-5 rounded-xl border border-[#dfe4db] bg-[#f8f9f6] p-4">

                <div className="flex items-center gap-3">

                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#59684c] text-sm font-semibold text-white">
                    2
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-[#292d28]">
                      In Progress
                    </p>

                    <p className="mt-1 text-xs text-[#697066]">
                      Your application is currently being reviewed.
                    </p>
                  </div>

                </div>

              </div>

              <div className="mt-5">

                <p className="text-sm font-medium text-[#292d28]">
                  What happens next?
                </p>

                <p className="mt-2 text-sm leading-6 text-[#697066]">
                  If your application meets the screening requirements, you
                  will be promoted to the screening test.
                </p>

              </div>

            </Card>

          </div>

        </main>

      </div>

    </div>
  )
}

export default CandidateApplication