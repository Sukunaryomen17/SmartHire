import React from "react"
import { useLocation, useNavigate } from "react-router-dom"

import Badge from "../../components/common/Badge"
import Card from "../../components/common/Card"
import DashboardLayout from "../../components/layout/DashboardLayout"
import PageHeader from "../../components/layout/PageHeader"

const interviewers = [
  {
    id: 1,
    name: "Rahul Kumar",
    role: "Senior Java Engineer",
  },
  {
    id: 2,
    name: "Ananya Rao",
    role: "Technical Interviewer",
  },
]

const nextStepOptions = [
  "Move to Interview",
  "Schedule Final Interview",
  "Hiring Manager Review",
  "Keep On-Hold",
  "Reject Candidate",
  "Mark as Selected",
]

const defaultCandidate = {
  id: 1,
  name: "Priya Sharma",
  email: "priya.sharma@example.com",
  role: "Java Backend Developer",
  experience: "3+ Years",
  location: "Bengaluru",
  resumeScore: 91,
  qaScore: 87,
  overallScore: 89,
  confidence: 0.91,
  status: "Interview",
  matchedSkills: [
    "Java",
    "Spring Boot",
    "REST APIs",
    "SQL",
    "Git",
  ],
  skillGaps: [
    "Microservices",
    "Docker",
  ],
  interviewer: "Not Assigned",
  interviewDate: "Not Scheduled",
  nextStep: "Interview",
}

function CandidateDetails() {
  const location = useLocation()
  const navigate = useNavigate()

  const candidateFromList = location.state?.candidate

  const candidate = candidateFromList
    ? {
        ...defaultCandidate,
        ...candidateFromList,
      }
    : defaultCandidate

  const [selectedInterviewer, setSelectedInterviewer] = React.useState(
    candidate.interviewer !== "Not Assigned"
      ? candidate.interviewer
      : ""
  )

  const [assignmentSaved, setAssignmentSaved] = React.useState(false)

  const [interviewDate, setInterviewDate] = React.useState("")
  const [interviewTime, setInterviewTime] = React.useState("")
  const [scheduleSaved, setScheduleSaved] = React.useState(false)

  const [nextStep, setNextStep] = React.useState("")
  const [nextStepSaved, setNextStepSaved] = React.useState(false)

  const [candidateAction, setCandidateAction] = React.useState("")
  const [actionSaved, setActionSaved] = React.useState(false)

  const [reviewStatus, setReviewStatus] = React.useState("")

  const handleAssignInterviewer = () => {
    if (!selectedInterviewer) return

    setAssignmentSaved(true)
  }

  const handleScheduleInterview = () => {
    if (!interviewDate || !interviewTime) return

    setScheduleSaved(true)
  }

  const handleSaveNextStep = () => {
    if (!nextStep) return

    setNextStepSaved(true)
  }

  const handleCandidateAction = () => {
    if (!candidateAction) return

    setActionSaved(true)
  }

  const handleReviewStatus = (status) => {
    setReviewStatus(status)
  }

  return (
    <DashboardLayout topbarTitle="Candidate details">
      <PageHeader
        eyebrow="Candidate management"
        title={candidate.name}
        description="Review candidate screening results and manage the next stage."
      />

      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/admin/candidates")}
        className="mb-6 rounded-lg border border-[#d6dcd2] px-4 py-2.5 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee]"
      >
        ← Back to Candidates
      </button>

      {/* Candidate Header */}
      <Card className="mb-6 p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
              Candidate
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-[#292d28]">
              {candidate.name}
            </h2>

            <p className="mt-1 text-sm text-[#697066]">
              {candidate.email}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-md border border-[#e0e4dc] bg-[#f1f3ee] px-3 py-1.5 text-sm text-[#697066]">
                {candidate.role}
              </span>

              <span className="rounded-md border border-[#e0e4dc] bg-[#f1f3ee] px-3 py-1.5 text-sm text-[#697066]">
                {candidate.experience}
              </span>

              <span className="rounded-md border border-[#e0e4dc] bg-[#f1f3ee] px-3 py-1.5 text-sm text-[#697066]">
                {candidate.location}
              </span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#838a7f]">
              Current Status
            </p>

            <Badge status={candidate.status}>
              {candidate.status}
            </Badge>
          </div>

        </div>
      </Card>

      {/* Score Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Resume Score
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {candidate.resumeScore}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Out of 100
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Q&A Score
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {candidate.qaScore}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Out of 100
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            Overall Score
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#59684c]">
            {candidate.overallScore}
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Combined screening score
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#697066]">
            AI Confidence
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#292d28]">
            {Math.round(candidate.confidence * 100)}%
          </p>

          <p className="mt-1 text-xs text-[#838a7f]">
            Model confidence
          </p>
        </Card>

      </div>

      {/* AI Review */}
      <Card className="mb-6 p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
            AI review
          </p>

          <h2 className="mt-2 text-lg font-semibold text-[#292d28]">
            Screening evidence
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#697066]">
            Review the candidate's screening indicators before making a
            progression decision.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div>
            <p className="text-sm font-medium text-[#292d28]">
              Matched Skills
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {candidate.matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-[#d6dcd2] bg-[#f1f3ee] px-3 py-1.5 text-sm text-[#59684c]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-[#292d28]">
              Skill Gaps
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {candidate.skillGaps.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-[#e0e4dc] bg-[#fffefa] px-3 py-1.5 text-sm text-[#697066]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Review Flags */}
        <div className="mt-6 border-t border-[#e1e5dd] pt-5">

          <p className="text-sm font-medium text-[#292d28]">
            Review indicators
          </p>

          <div className="mt-3 flex flex-wrap gap-2">

            {candidate.confidence < 0.7 && (
              <span className="rounded-md border border-[#d6dcd2] bg-[#f1f3ee] px-3 py-1.5 text-xs font-medium text-[#59684c]">
                Low Confidence
              </span>
            )}

            {Math.abs(
              Number(candidate.resumeScore) -
                Number(candidate.qaScore)
            ) >= 15 && (
              <span className="rounded-md border border-[#d6dcd2] bg-[#f1f3ee] px-3 py-1.5 text-xs font-medium text-[#59684c]">
                Score Disagreement
              </span>
            )}

            {candidate.confidence >= 0.7 &&
              Math.abs(
                Number(candidate.resumeScore) -
                  Number(candidate.qaScore)
              ) < 15 && (
                <span className="text-sm text-[#59684c]">
                  No review indicators detected.
                </span>
              )}

          </div>
        </div>
      </Card>

      {/* Candidate Promotion / Archive */}
      <Card className="mb-6 p-5 sm:p-6">

        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
            Screening decision
          </p>

          <h2 className="mt-2 text-lg font-semibold text-[#292d28]">
            Candidate progression
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#697066]">
            Decide whether this candidate should continue to the next
            screening stage or be archived.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

          <button
            type="button"
            onClick={() => {
              setCandidateAction("Promote to Screening Test")
              setActionSaved(false)
            }}
            className={`rounded-lg border px-4 py-4 text-left transition ${
              candidateAction === "Promote to Screening Test"
                ? "border-[#59684c] bg-[#f1f3ee]"
                : "border-[#d6dcd2] hover:bg-[#f1f3ee]"
            }`}
          >
            <p className="text-sm font-medium text-[#292d28]">
              Promote Candidate
            </p>

            <p className="mt-1 text-xs leading-5 text-[#697066]">
              Move the candidate to the screening test stage.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setCandidateAction("Archive Candidate")
              setActionSaved(false)
            }}
            className={`rounded-lg border px-4 py-4 text-left transition ${
              candidateAction === "Archive Candidate"
                ? "border-[#59684c] bg-[#f1f3ee]"
                : "border-[#d6dcd2] hover:bg-[#f1f3ee]"
            }`}
          >
            <p className="text-sm font-medium text-[#292d28]">
              Archive Candidate
            </p>

            <p className="mt-1 text-xs leading-5 text-[#697066]">
              Remove the candidate from the active screening workflow.
            </p>
          </button>

        </div>

        {candidateAction && (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] px-4 py-3">
              <p className="text-xs text-[#838a7f]">
                Selected action
              </p>

              <p className="mt-1 text-sm font-medium text-[#292d28]">
                {candidateAction}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCandidateAction}
              className="rounded-lg bg-[#59684c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d5b42]"
            >
              Confirm Action
            </button>

          </div>
        )}

        {actionSaved && (
          <div className="mt-4 rounded-lg border border-[#d6dcd2] bg-[#f1f3ee] px-4 py-3">

            <p className="text-sm font-medium text-[#59684c]">
              {candidateAction === "Promote to Screening Test"
                ? "Candidate promoted to the screening test stage."
                : "Candidate archived successfully."}
            </p>

            <p className="mt-1 text-xs text-[#697066]">
              This is currently a frontend demo. The action will be
              connected to the backend later.
            </p>

          </div>
        )}

      </Card>

      {/* Human Review */}
      <Card className="mb-6 p-5 sm:p-6">

        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
            Human review
          </p>

          <h2 className="mt-2 text-lg font-semibold text-[#292d28]">
            Review status
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#697066]">
            AI indicators are intended to support human review and should
            not automatically determine the candidate's outcome.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          <button
            type="button"
            onClick={() => handleReviewStatus("Reviewed")}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
              reviewStatus === "Reviewed"
                ? "border-[#59684c] bg-[#59684c] text-white"
                : "border-[#d6dcd2] text-[#59684c] hover:bg-[#f1f3ee]"
            }`}
          >
            Mark Reviewed
          </button>

          <button
            type="button"
            onClick={() => handleReviewStatus("Needs Further Review")}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
              reviewStatus === "Needs Further Review"
                ? "border-[#59684c] bg-[#59684c] text-white"
                : "border-[#d6dcd2] text-[#59684c] hover:bg-[#f1f3ee]"
            }`}
          >
            Needs Further Review
          </button>

        </div>

        {reviewStatus && (
          <div className="mt-4 rounded-lg border border-[#d6dcd2] bg-[#f1f3ee] px-4 py-3">
            <p className="text-sm text-[#59684c]">
              Review status:{" "}
              <span className="font-medium">
                {reviewStatus}
              </span>
            </p>
          </div>
        )}

      </Card>

      {/* Interviewer Assignment */}
      <Card className="mb-6 p-5 sm:p-6">

        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
            Interview management
          </p>

          <h2 className="mt-2 text-lg font-semibold text-[#292d28]">
            Assign interviewer
          </h2>

          <p className="mt-1 text-sm text-[#697066]">
            Select an interviewer for the candidate.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

          <div className="flex-1">
            <label
              htmlFor="interviewer"
              className="mb-2 block text-sm font-medium text-[#292d28]"
            >
              Interviewer
            </label>

            <select
              id="interviewer"
              value={selectedInterviewer}
              onChange={(event) => {
                setSelectedInterviewer(event.target.value)
                setAssignmentSaved(false)
              }}
              className="min-h-11 w-full rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#434a40] outline-none transition-colors hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
            >
              <option value="">
                Select interviewer
              </option>

              {interviewers.map((interviewer) => (
                <option
                  key={interviewer.id}
                  value={interviewer.name}
                >
                  {interviewer.name} — {interviewer.role}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleAssignInterviewer}
            className="rounded-lg bg-[#59684c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d5b42]"
          >
            Assign Interviewer
          </button>

        </div>

        {assignmentSaved && (
          <div className="mt-4 rounded-lg border border-[#d6dcd2] bg-[#f1f3ee] px-4 py-3">
            <p className="text-sm font-medium text-[#59684c]">
              {selectedInterviewer} assigned successfully.
            </p>

            <p className="mt-1 text-xs text-[#697066]">
              This assignment will be connected to the backend later.
            </p>
          </div>
        )}

      </Card>

      {/* Interview Schedule */}
      <Card className="mb-6 p-5 sm:p-6">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-[#292d28]">
            Schedule interview
          </h2>

          <p className="mt-1 text-sm text-[#697066]">
            Set the interview date and time.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div>
            <label
              htmlFor="interview-date"
              className="mb-2 block text-sm font-medium text-[#292d28]"
            >
              Interview Date
            </label>

            <input
              id="interview-date"
              type="date"
              value={interviewDate}
              onChange={(event) => {
                setInterviewDate(event.target.value)
                setScheduleSaved(false)
              }}
              className="min-h-11 w-full rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#434a40] outline-none transition-colors hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
            />
          </div>

          <div>
            <label
              htmlFor="interview-time"
              className="mb-2 block text-sm font-medium text-[#292d28]"
            >
              Interview Time
            </label>

            <input
              id="interview-time"
              type="time"
              value={interviewTime}
              onChange={(event) => {
                setInterviewTime(event.target.value)
                setScheduleSaved(false)
              }}
              className="min-h-11 w-full rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#434a40] outline-none transition-colors hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
            />
          </div>

        </div>

        <button
          type="button"
          onClick={handleScheduleInterview}
          className="mt-4 rounded-lg bg-[#59684c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d5b42]"
        >
          Save Interview Schedule
        </button>

        {scheduleSaved && (
          <div className="mt-4 rounded-lg border border-[#d6dcd2] bg-[#f1f3ee] px-4 py-3">
            <p className="text-sm font-medium text-[#59684c]">
              Interview scheduled successfully.
            </p>

            <p className="mt-1 text-xs text-[#697066]">
              Date: {interviewDate} · Time: {interviewTime}
            </p>
          </div>
        )}

      </Card>

      {/* Next Step */}
      <Card className="mb-6 p-5 sm:p-6">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-[#292d28]">
            Next step
          </h2>

          <p className="mt-1 text-sm text-[#697066]">
            Choose the next action for this candidate.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">

          <select
            value={nextStep}
            onChange={(event) => {
              setNextStep(event.target.value)
              setNextStepSaved(false)
            }}
            className="min-h-11 flex-1 rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#434a40] outline-none transition-colors hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
          >
            <option value="">
              Select next step
            </option>

            {nextStepOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleSaveNextStep}
            className="rounded-lg bg-[#59684c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d5b42]"
          >
            Save Next Step
          </button>

        </div>

        {nextStepSaved && (
          <div className="mt-4 rounded-lg border border-[#d6dcd2] bg-[#f1f3ee] px-4 py-3">
            <p className="text-sm font-medium text-[#59684c]">
              Next step saved successfully.
            </p>

            <p className="mt-1 text-xs text-[#697066]">
              Selected: {nextStep}
            </p>
          </div>
        )}

      </Card>

      {/* Current Progress */}
      <Card className="p-5 sm:p-6">

        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
            Application progress
          </p>

          <h2 className="mt-2 text-lg font-semibold text-[#292d28]">
            Hiring pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">

          <div className="rounded-lg border border-[#d6dcd2] bg-[#f1f3ee] p-4">
            <p className="text-xs text-[#838a7f]">
              Resume
            </p>

            <p className="mt-1 text-sm font-medium text-[#59684c]">
              Completed
            </p>
          </div>

          <div className="rounded-lg border border-[#d6dcd2] bg-[#f1f3ee] p-4">
            <p className="text-xs text-[#838a7f]">
              Screening Test
            </p>

            <p className="mt-1 text-sm font-medium text-[#59684c]">
              Completed
            </p>
          </div>

          <div className="rounded-lg border border-[#d6dcd2] bg-[#f1f3ee] p-4">
            <p className="text-xs text-[#838a7f]">
              Interview
            </p>

            <p className="mt-1 text-sm font-medium text-[#59684c]">
              {candidate.interviewer !== "Not Assigned"
                ? "Assigned"
                : "Pending"}
            </p>
          </div>

          <div className="rounded-lg border border-[#d6dcd2] bg-[#f1f3ee] p-4">
            <p className="text-xs text-[#838a7f]">
              Final Decision
            </p>

            <p className="mt-1 text-sm font-medium text-[#697066]">
              Pending
            </p>
          </div>

        </div>

      </Card>
    </DashboardLayout>
  )
}

export default CandidateDetails