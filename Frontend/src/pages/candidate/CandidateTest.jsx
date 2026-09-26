import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import Card from "../../components/common/Card"
import CandidateSidebar from "../../components/layout/CandidateSidebar"
import PageHeader from "../../components/layout/PageHeader"
import Topbar from "../../components/layout/Topbar"

const QUESTION_TIME = 60

const questions = [
  {
    id: 1,
    question: "What is the Virtual DOM in React and why is it useful?",
  },
  {
    id: 2,
    question:
      "What is list virtualization and when would you use it in a frontend application?",
  },
  {
    id: 3,
    question:
      "Explain the difference between state and props in React.",
  },
  {
    id: 4,
    question:
      "How would you securely handle JWT tokens in a web application?",
  },
  {
    id: 5,
    question:
      "Explain the CSS box model and its main components.",
  },
  {
    id: 6,
    question:
      "What are the rules that should be followed when using React Hooks?",
  },
]

function CandidateTest() {
  const navigate = useNavigate()

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [submitted, setSubmitted] = useState(false)

  // Anti-cheat telemetry
  const [tabSwitches, setTabSwitches] = useState(0)
  const [pasteAttempts, setPasteAttempts] = useState(0)
  const [fullscreenExits, setFullscreenExits] = useState(0)

  const [testStarted, setTestStarted] = useState(false)

  const question = questions[currentQuestion]

  /*
   * Start test
   */
  const handleStartTest = async () => {
    setTestStarted(true)

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
      }
    } catch {
      // Fullscreen permission may be denied by the browser.
    }
  }

  /*
   * Track tab switches / visibility changes
   */
  useEffect(() => {
    if (!testStarted || submitted) {
      return
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((count) => count + 1)
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    )

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      )
    }
  }, [testStarted, submitted])

  /*
   * Track fullscreen exits
   */
  useEffect(() => {
    if (!testStarted || submitted) {
      return
    }

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenExits((count) => count + 1)
      }
    }

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    )

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      )
    }
  }, [testStarted, submitted])

  /*
   * Track paste attempts
   */
  useEffect(() => {
    if (!testStarted || submitted) {
      return
    }

    const handlePaste = () => {
      setPasteAttempts((count) => count + 1)
    }

    document.addEventListener("paste", handlePaste)

    return () => {
      document.removeEventListener("paste", handlePaste)
    }
  }, [testStarted, submitted])

  /*
   * Timer
   */
  useEffect(() => {
    if (!testStarted || submitted) {
      return
    }

    if (timeLeft <= 0) {
      handleNextQuestion()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((time) => time - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, testStarted, submitted])

  /*
   * Update answer
   */
  const handleAnswerChange = (event) => {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: event.target.value,
    }))
  }

  /*
   * Move to next question
   */
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((index) => index + 1)
      setTimeLeft(QUESTION_TIME)
    } else {
      handleSubmitTest()
    }
  }

  /*
   * Move to previous question
   */
  const handlePreviousQuestion = () => {
    if (currentQuestion === 0) {
      return
    }

    setCurrentQuestion((index) => index - 1)
    setTimeLeft(QUESTION_TIME)
  }

  /*
   * Submit test
   */
  const handleSubmitTest = async () => {
    setSubmitted(true)

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
    } catch {
      // Ignore fullscreen exit errors.
    }
  }

  /*
   * Before starting the test
   */
  if (!testStarted) {
    return (
      <div className="dashboard-canvas flex min-h-screen flex-col text-[#292d28] lg:flex-row">
        <CandidateSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            title="Screening test"
            topbarContent={
              <span className="ml-2 border-l border-[#d6dcd2] pl-4 text-sm text-[#697066]">
                Candidate portal
              </span>
            }
          />

          <main className="min-w-0 flex-1 p-5 sm:p-6 lg:p-8">
            <PageHeader
              eyebrow="Candidate portal"
              title="Screening Test"
              description="Complete the screening questions to continue your application."
            />

            <Card className="mx-auto max-w-3xl p-6 sm:p-8">

              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
                  Before you begin
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#292d28]">
                  Screening test instructions
                </h2>
              </div>

              <div className="space-y-3">

                <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4">
                  <p className="text-sm font-medium text-[#292d28]">
                    6 questions
                  </p>

                  <p className="mt-1 text-sm text-[#697066]">
                    You will answer six technical questions.
                  </p>
                </div>

                <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4">
                  <p className="text-sm font-medium text-[#292d28]">
                    60 seconds per question
                  </p>

                  <p className="mt-1 text-sm text-[#697066]">
                    Each question has its own timer.
                  </p>
                </div>

                <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4">
                  <p className="text-sm font-medium text-[#292d28]">
                    One question at a time
                  </p>

                  <p className="mt-1 text-sm text-[#697066]">
                    You can move between questions using the navigation
                    controls.
                  </p>
                </div>

                <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4">
                  <p className="text-sm font-medium text-[#292d28]">
                    Test activity is monitored
                  </p>

                  <p className="mt-1 text-sm text-[#697066]">
                    Tab switches, paste attempts, and fullscreen exits may
                    be recorded for review.
                  </p>
                </div>

              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleStartTest}
                  className="w-full rounded-lg bg-[#59684c] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#4d5b42]"
                >
                  Start Screening Test
                </button>
              </div>

            </Card>
          </main>
        </div>
      </div>
    )
  }

  /*
   * Submitted screen
   */
  if (submitted) {
    return (
      <div className="dashboard-canvas flex min-h-screen flex-col text-[#292d28] lg:flex-row">
        <CandidateSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            title="Screening test"
            topbarContent={
              <span className="ml-2 border-l border-[#d6dcd2] pl-4 text-sm text-[#697066]">
                Candidate portal
              </span>
            }
          />

          <main className="min-w-0 flex-1 p-5 sm:p-6 lg:p-8">

            <PageHeader
              eyebrow="Candidate portal"
              title="Test Submitted"
              description="Your screening test has been submitted successfully."
            />

            <Card className="mx-auto max-w-2xl p-6 text-center sm:p-8">

              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#879276] text-xl font-semibold text-white">
                ✓
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-[#292d28]">
                Screening test completed
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#697066]">
                Your responses have been recorded. The screening result will
                be evaluated as part of your application.
              </p>

              {/* Telemetry summary */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

                <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4">
                  <p className="text-xs text-[#838a7f]">
                    Tab switches
                  </p>

                  <p className="mt-1 text-xl font-semibold text-[#292d28]">
                    {tabSwitches}
                  </p>
                </div>

                <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4">
                  <p className="text-xs text-[#838a7f]">
                    Paste attempts
                  </p>

                  <p className="mt-1 text-xl font-semibold text-[#292d28]">
                    {pasteAttempts}
                  </p>
                </div>

                <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4">
                  <p className="text-xs text-[#838a7f]">
                    Fullscreen exits
                  </p>

                  <p className="mt-1 text-xl font-semibold text-[#292d28]">
                    {fullscreenExits}
                  </p>
                </div>

              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">

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

            </Card>

          </main>
        </div>
      </div>
    )
  }

  const progress =
    ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="dashboard-canvas flex min-h-screen flex-col text-[#292d28] lg:flex-row">
      <CandidateSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title="Screening test"
          topbarContent={
            <span className="ml-2 border-l border-[#d6dcd2] pl-4 text-sm text-[#697066]">
              Candidate portal
            </span>
          }
        />

        <main className="min-w-0 flex-1 p-5 sm:p-6 lg:p-8">

          <PageHeader
            eyebrow="Candidate portal"
            title="Screening Test"
            description="Answer each question before moving to the next one."
          />

          {/* Test header */}
          <Card className="mb-6 p-5 sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm text-[#697066]">
                  Question
                </p>

                <p className="mt-1 text-xl font-semibold text-[#292d28]">
                  {currentQuestion + 1} of {questions.length}
                </p>
              </div>

              <div className="rounded-lg border border-[#d6dcd2] bg-[#f1f3ee] px-4 py-3">
                <p className="text-xs text-[#838a7f]">
                  Time remaining
                </p>

                <p
                  className={`mt-1 text-lg font-semibold ${
                    timeLeft <= 10
                      ? "text-[#7a5c42]"
                      : "text-[#59684c]"
                  }`}
                >
                  {timeLeft}s
                </p>
              </div>

            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#e0e4dc]">
              <div
                className="h-full rounded-full bg-[#59684c] transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

          </Card>

          {/* Question */}
          <Card className="mx-auto max-w-4xl p-5 sm:p-7">

            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
                Question {currentQuestion + 1}
              </p>

              <h2 className="mt-3 text-xl font-semibold leading-8 text-[#292d28]">
                {question.question}
              </h2>
            </div>

            <label
              htmlFor="candidate-answer"
              className="mb-2 block text-sm font-medium text-[#292d28]"
            >
              Your answer
            </label>

            <textarea
              id="candidate-answer"
              value={answers[question.id] || ""}
              onChange={handleAnswerChange}
              placeholder="Type your answer here..."
              rows={8}
              className="w-full resize-y rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-4 py-3 text-sm leading-6 text-[#292d28] outline-none transition-colors placeholder:text-[#9aa095] hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
            />

            {/* Navigation */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

              <button
                type="button"
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="rounded-lg border border-[#d6dcd2] px-4 py-2.5 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {currentQuestion < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="rounded-lg bg-[#59684c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d5b42]"
                >
                  Next Question
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  className="rounded-lg bg-[#59684c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d5b42]"
                >
                  Submit Test
                </button>
              )}

            </div>

          </Card>

          {/* Telemetry notice */}
          <div className="mx-auto mt-4 max-w-4xl rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] px-4 py-3">
            <p className="text-xs leading-5 text-[#697066]">
              Test activity such as tab switches, paste attempts, and
              fullscreen exits may be recorded for administrative review.
            </p>
          </div>

        </main>
      </div>
    </div>
  )
}

export default CandidateTest