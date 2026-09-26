import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import Card from "../../components/common/Card"
import CandidateSidebar from "../../components/layout/CandidateSidebar"
import PageHeader from "../../components/layout/PageHeader"
import Topbar from "../../components/layout/Topbar"

const API_BASE_URL = "http://localhost:5000/api"

const QUESTION_TIME = 60
const MAX_VIOLATIONS = 3

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
  const [terminated, setTerminated] = useState(false)

  const [testStarted, setTestStarted] = useState(false)

  // Backend attempt ID
  const [attemptId, setAttemptId] = useState(null)

  // Backend connection status
  const [backendError, setBackendError] = useState("")

  // --------------------------------------------------
  // Anti-cheat counters
  // --------------------------------------------------

  const [violationCount, setViolationCount] = useState(0)

  const [tabSwitches, setTabSwitches] = useState(0)
  const [windowBlurCount, setWindowBlurCount] = useState(0)
  const [fullscreenExits, setFullscreenExits] = useState(0)

  const [copyAttempts, setCopyAttempts] = useState(0)
  const [pasteAttempts, setPasteAttempts] = useState(0)
  const [cutAttempts, setCutAttempts] = useState(0)

  const [selectAllAttempts, setSelectAllAttempts] = useState(0)
  const [rightClickAttempts, setRightClickAttempts] = useState(0)

  const [devToolsAttempts, setDevToolsAttempts] = useState(0)
  const [printAttempts, setPrintAttempts] = useState(0)
  const [viewSourceAttempts, setViewSourceAttempts] = useState(0)

  const [antiCheatEvents, setAntiCheatEvents] = useState([])

  const [warningPopup, setWarningPopup] = useState(null)

  const violationLock = useRef(false)

  const question = questions[currentQuestion]

  // ==================================================
  // BACKEND: START ATTEMPT
  // ==================================================

  const startBackendAttempt = async () => {
    /*
      IMPORTANT:

      Your teammate's backend requires:

      POST /api/tests/:testId/start

      Body:
      {
        applicationId: "..."
      }

      We are NOT inventing these IDs.

      Once your teammate gives us the real testId
      and applicationId, put them here or load them
      from your application data.
    */

    const testId = localStorage.getItem("smartHireTestId")
    const applicationId = localStorage.getItem(
      "smartHireApplicationId"
    )

    if (!testId || !applicationId) {
      console.warn(
        "Test ID or Application ID is missing. Running frontend test only."
      )

      return null
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/tests/${testId}/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicationId,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to start test."
        )
      }

      const newAttemptId = result.data._id

      setAttemptId(newAttemptId)

      localStorage.setItem(
        "smartHireAttemptId",
        newAttemptId
      )

      console.log(
        "Backend test attempt started:",
        newAttemptId
      )

      return newAttemptId
    } catch (error) {
      console.error(
        "Backend test start error:",
        error
      )

      setBackendError(
        "Could not connect to the test server. The test is currently running in local mode."
      )

      return null
    }
  }

  // ==================================================
  // BACKEND: RECORD ANTI-CHEAT
  // ==================================================

  const sendAntiCheatToBackend = async (
    type,
    violationNumber,
    questionNumber
  ) => {
    const currentAttemptId =
      attemptId ||
      localStorage.getItem("smartHireAttemptId")

    if (!currentAttemptId) {
      console.warn(
        "No attempt ID. Anti-cheat event remains local."
      )
      return
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/tests/attempt/${currentAttemptId}/anti-cheat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            violationNumber,
            questionNumber,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok || !result.success) {
        console.error(
          "Failed to save anti-cheat event:",
          result.message
        )
        return
      }

      console.log(
        "Anti-cheat event saved:",
        result.data
      )
    } catch (error) {
      console.error(
        "Anti-cheat backend error:",
        error
      )
    }
  }

  // ==================================================
  // RECORD VIOLATION
  // ==================================================

  const recordViolation = (type) => {
    if (!testStarted || submitted || terminated) {
      return
    }

    if (violationLock.current) {
      return
    }

    violationLock.current = true

    setTimeout(() => {
      violationLock.current = false
    }, 300)

    setViolationCount((previousCount) => {
      const nextCount = previousCount + 1

      const event = {
        id: `${Date.now()}-${Math.random()}`,
        violationNumber: nextCount,
        type,
        timestamp: new Date().toLocaleString(),
        questionNumber: currentQuestion + 1,
      }

      setAntiCheatEvents((previousEvents) => [
        ...previousEvents,
        event,
      ])

      // Send event to backend
      sendAntiCheatToBackend(
        type,
        nextCount,
        currentQuestion + 1
      )

      // FIRST WARNING
      if (nextCount === 1) {
        setWarningPopup({
          level: 1,
          title: "Warning 1 of 2",
          message:
            "Suspicious activity has been detected. Please remain on the test screen and avoid using restricted actions.",
        })
      }

      // SECOND WARNING
      if (nextCount === 2) {
        setWarningPopup({
          level: 2,
          title: "Final Warning 2 of 2",
          message:
            "This is your final warning. One more anti-cheat violation will immediately terminate your screening test.",
        })
      }

      // THIRD VIOLATION
      if (nextCount >= MAX_VIOLATIONS) {
        setWarningPopup(null)
        setTerminated(true)
        setSubmitted(true)

        try {
          if (document.fullscreenElement) {
            document.exitFullscreen()
          }
        } catch {
          // Ignore fullscreen errors.
        }
      }

      return nextCount
    })
  }

  // ==================================================
  // START TEST
  // ==================================================

  const handleStartTest = async () => {
    /*
      Start backend attempt first.
    */

    await startBackendAttempt()

    setTestStarted(true)

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
      }
    } catch {
      // Browser may deny fullscreen.
    }
  }

  // ==================================================
  // TAB SWITCH DETECTION
  // ==================================================

  useEffect(() => {
    if (!testStarted || submitted || terminated) {
      return
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((count) => count + 1)

        recordViolation(
          "Tab switch / page hidden"
        )
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
  }, [
    testStarted,
    submitted,
    terminated,
    currentQuestion,
  ])

  // ==================================================
  // WINDOW BLUR
  // ==================================================

  useEffect(() => {
    if (!testStarted || submitted || terminated) {
      return
    }

    const handleBlur = () => {
      setWindowBlurCount((count) => count + 1)

      recordViolation(
        "Window focus lost"
      )
    }

    window.addEventListener(
      "blur",
      handleBlur
    )

    return () => {
      window.removeEventListener(
        "blur",
        handleBlur
      )
    }
  }, [
    testStarted,
    submitted,
    terminated,
    currentQuestion,
  ])

  // ==================================================
  // FULLSCREEN EXIT
  // ==================================================

  useEffect(() => {
    if (!testStarted || submitted || terminated) {
      return
    }

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenExits(
          (count) => count + 1
        )

        recordViolation(
          "Fullscreen exited"
        )
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
  }, [
    testStarted,
    submitted,
    terminated,
    currentQuestion,
  ])

  // ==================================================
  // COPY / PASTE / CUT
  // ==================================================

  useEffect(() => {
    if (!testStarted || submitted || terminated) {
      return
    }

    const handleCopy = () => {
      setCopyAttempts(
        (count) => count + 1
      )

      recordViolation(
        "Copy attempt (Ctrl+C)"
      )
    }

    const handlePaste = () => {
      setPasteAttempts(
        (count) => count + 1
      )

      recordViolation(
        "Paste attempt (Ctrl+V)"
      )
    }

    const handleCut = () => {
      setCutAttempts(
        (count) => count + 1
      )

      recordViolation(
        "Cut attempt (Ctrl+X)"
      )
    }

    document.addEventListener(
      "copy",
      handleCopy
    )

    document.addEventListener(
      "paste",
      handlePaste
    )

    document.addEventListener(
      "cut",
      handleCut
    )

    return () => {
      document.removeEventListener(
        "copy",
        handleCopy
      )

      document.removeEventListener(
        "paste",
        handlePaste
      )

      document.removeEventListener(
        "cut",
        handleCut
      )
    }
  }, [
    testStarted,
    submitted,
    terminated,
    currentQuestion,
  ])

  // ==================================================
  // RIGHT CLICK
  // ==================================================

  useEffect(() => {
    if (!testStarted || submitted || terminated) {
      return
    }

    const handleContextMenu = (event) => {
      event.preventDefault()

      setRightClickAttempts(
        (count) => count + 1
      )

      recordViolation(
        "Right-click attempt"
      )
    }

    document.addEventListener(
      "contextmenu",
      handleContextMenu
    )

    return () => {
      document.removeEventListener(
        "contextmenu",
        handleContextMenu
      )
    }
  }, [
    testStarted,
    submitted,
    terminated,
    currentQuestion,
  ])

  // ==================================================
  // KEYBOARD SHORTCUTS
  // ==================================================

  useEffect(() => {
    if (!testStarted || submitted || terminated) {
      return
    }

    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase()

      const ctrlOrMeta =
        event.ctrlKey || event.metaKey

      // Ctrl+C
      if (ctrlOrMeta && key === "c") {
        event.preventDefault()
        return
      }

      // Ctrl+V
      if (ctrlOrMeta && key === "v") {
        event.preventDefault()
        return
      }

      // Ctrl+X
      if (ctrlOrMeta && key === "x") {
        event.preventDefault()
        return
      }

      // Ctrl+A
      if (ctrlOrMeta && key === "a") {
        event.preventDefault()

        setSelectAllAttempts(
          (count) => count + 1
        )

        recordViolation(
          "Select-all shortcut (Ctrl+A)"
        )

        return
      }

      // Ctrl+P
      if (ctrlOrMeta && key === "p") {
        event.preventDefault()

        setPrintAttempts(
          (count) => count + 1
        )

        recordViolation(
          "Print shortcut (Ctrl+P)"
        )

        return
      }

      // Ctrl+U
      if (ctrlOrMeta && key === "u") {
        event.preventDefault()

        setViewSourceAttempts(
          (count) => count + 1
        )

        recordViolation(
          "View-source shortcut (Ctrl+U)"
        )

        return
      }

      // Ctrl+Shift+I
      if (
        ctrlOrMeta &&
        event.shiftKey &&
        key === "i"
      ) {
        event.preventDefault()

        setDevToolsAttempts(
          (count) => count + 1
        )

        recordViolation(
          "Developer tools shortcut (Ctrl+Shift+I)"
        )

        return
      }

      // Ctrl+Shift+J
      if (
        ctrlOrMeta &&
        event.shiftKey &&
        key === "j"
      ) {
        event.preventDefault()

        setDevToolsAttempts(
          (count) => count + 1
        )

        recordViolation(
          "Developer tools shortcut (Ctrl+Shift+J)"
        )

        return
      }

      // F12
      if (event.key === "F12") {
        event.preventDefault()

        setDevToolsAttempts(
          (count) => count + 1
        )

        recordViolation(
          "Developer tools shortcut (F12)"
        )
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    )

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      )
    }
  }, [
    testStarted,
    submitted,
    terminated,
    currentQuestion,
  ])

  // ==================================================
  // TIMER
  // ==================================================

  useEffect(() => {
    if (!testStarted || submitted || terminated) {
      return
    }

    if (timeLeft <= 0) {
      handleNextQuestion()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(
        (time) => time - 1
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [
    timeLeft,
    testStarted,
    submitted,
    terminated,
  ])

  // ==================================================
  // ANSWER CHANGE
  // ==================================================

  const handleAnswerChange = (event) => {
    setAnswers((previous) => ({
      ...previous,
      [question.id]:
        event.target.value,
    }))
  }

  // ==================================================
  // NEXT QUESTION
  // ==================================================

  const handleNextQuestion = () => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (index) => index + 1
      )

      setTimeLeft(
        QUESTION_TIME
      )
    } else {
      handleSubmitTest()
    }
  }

  // ==================================================
  // PREVIOUS QUESTION
  // ==================================================

  const handlePreviousQuestion = () => {
    if (currentQuestion === 0) {
      return
    }

    setCurrentQuestion(
      (index) => index - 1
    )

    setTimeLeft(
      QUESTION_TIME
    )
  }

  // ==================================================
  // SUBMIT TEST
  // ==================================================

  const handleSubmitTest = async () => {
    if (terminated) {
      return
    }

    /*
      Backend submit endpoint will eventually be:

      POST
      /api/tests/attempt/:attemptId/submit

      Body:
      {
        answers: [...]
      }

      We are not calling it yet because the current
      frontend question IDs do not match the MongoDB
      question IDs from the backend.
    */

    console.log(
      "Local answers:",
      answers
    )

    console.log(
      "Current backend attempt:",
      attemptId
    )

    setSubmitted(true)

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
    } catch {
      // Ignore fullscreen exit errors.
    }
  }

  // ==================================================
  // CLOSE WARNING
  // ==================================================

  const handleCloseWarning = () => {
    setWarningPopup(null)
  }

  // ==================================================
  // BEFORE TEST
  // ==================================================

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
                    You can move between questions using the navigation controls.
                  </p>

                </div>

                <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4">

                  <p className="text-sm font-medium text-[#292d28]">
                    Proctored test
                  </p>

                  <p className="mt-1 text-sm text-[#697066]">
                    Tab switching, window focus loss, fullscreen exits,
                    restricted keyboard shortcuts, copy, paste, cut and
                    right-click activity may be recorded.
                  </p>

                  <p className="mt-2 text-sm font-medium text-[#7a5c42]">
                    Three anti-cheat violations will terminate the test.
                  </p>

                </div>

              </div>

              {backendError && (
                <div className="mt-4 rounded-lg border border-[#e0e4dc] bg-[#f8f7f2] p-4 text-sm text-[#697066]">
                  {backendError}
                </div>
              )}

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

  // ==================================================
  // SUBMITTED / TERMINATED
  // ==================================================

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
              title={
                terminated
                  ? "Test Terminated"
                  : "Test Submitted"
              }
              description={
                terminated
                  ? "The screening test was terminated because multiple anti-cheat violations were detected."
                  : "Your screening test has been submitted successfully."
              }
            />

            <Card className="mx-auto max-w-3xl p-6 sm:p-8">

              <div
                className={`mx-auto grid h-14 w-14 place-items-center rounded-full text-xl font-semibold text-white ${
                  terminated
                    ? "bg-[#7a5c42]"
                    : "bg-[#879276]"
                }`}
              >
                {terminated ? "!" : "✓"}
              </div>

              <h2 className="mt-5 text-center text-2xl font-semibold text-[#292d28]">
                {terminated
                  ? "Screening test terminated"
                  : "Screening test completed"}
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-center text-sm leading-6 text-[#697066]">
                {terminated
                  ? "The test session has been ended after three anti-cheat violations. The recorded activity has been retained for administrative review."
                  : "Your responses have been recorded. The screening result will be evaluated as part of your application."}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

                <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4">
                  <p className="text-xs text-[#838a7f]">
                    Total violations
                  </p>

                  <p className="mt-1 text-xl font-semibold text-[#292d28]">
                    {violationCount}
                  </p>
                </div>

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
                    Fullscreen exits
                  </p>

                  <p className="mt-1 text-xl font-semibold text-[#292d28]">
                    {fullscreenExits}
                  </p>
                </div>

              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

                <div className="rounded-lg border border-[#e0e4dc] p-3">
                  <p className="text-xs text-[#838a7f]">
                    Copy
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {copyAttempts}
                  </p>
                </div>

                <div className="rounded-lg border border-[#e0e4dc] p-3">
                  <p className="text-xs text-[#838a7f]">
                    Paste
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {pasteAttempts}
                  </p>
                </div>

                <div className="rounded-lg border border-[#e0e4dc] p-3">
                  <p className="text-xs text-[#838a7f]">
                    Cut
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {cutAttempts}
                  </p>
                </div>

                <div className="rounded-lg border border-[#e0e4dc] p-3">
                  <p className="text-xs text-[#838a7f]">
                    Right click
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {rightClickAttempts}
                  </p>
                </div>

              </div>

              <div className="mt-7">

                <div className="mb-3">

                  <h3 className="text-sm font-semibold text-[#292d28]">
                    Anti-Cheat Activity Record
                  </h3>

                  <p className="mt-1 text-xs text-[#697066]">
                    Recorded events from this screening session.
                  </p>

                </div>

                {antiCheatEvents.length === 0 ? (
                  <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4 text-sm text-[#697066]">
                    No anti-cheat violations were recorded.
                  </div>
                ) : (
                  <div className="space-y-2">

                    {antiCheatEvents.map(
                      (event) => (
                        <div
                          key={event.id}
                          className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-4"
                        >

                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                              <p className="text-sm font-medium text-[#292d28]">
                                Violation{" "}
                                {event.violationNumber}
                              </p>

                              <p className="mt-1 text-sm text-[#697066]">
                                {event.type}
                              </p>

                            </div>

                            <div className="text-left sm:text-right">

                              <p className="text-xs text-[#838a7f]">
                                Question{" "}
                                {event.questionNumber}
                              </p>

                              <p className="mt-1 text-xs text-[#838a7f]">
                                {event.timestamp}
                              </p>

                            </div>

                          </div>

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

              <div className="mt-6 rounded-lg border border-[#d6dcd2] bg-[#f1f3ee] p-4">

                <p className="text-sm font-medium text-[#292d28]">
                  Administrative review
                </p>

                <p className="mt-1 text-sm leading-6 text-[#697066]">
                  Anti-cheat activity is recorded as screening-test
                  telemetry for administrative review.
                </p>

              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">

                <button
                  type="button"
                  onClick={() =>
                    navigate("/candidate")
                  }
                  className="rounded-lg border border-[#d6dcd2] px-4 py-2.5 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee]"
                >
                  Back to Dashboard
                </button>

                {!terminated && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/candidate/result"
                      )
                    }
                    className="rounded-lg bg-[#59684c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d5b42]"
                  >
                    View Application Result
                  </button>
                )}

              </div>

            </Card>

          </main>

        </div>

      </div>
    )
  }

  // ==================================================
  // TEST SCREEN
  // ==================================================

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100

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

          <Card className="mb-6 p-5 sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm text-[#697066]">
                  Question
                </p>

                <p className="mt-1 text-xl font-semibold text-[#292d28]">
                  {currentQuestion + 1} of{" "}
                  {questions.length}
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

          <Card className="mx-auto max-w-4xl p-5 sm:p-7">

            <div className="mb-6">

              <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">
                Question{" "}
                {currentQuestion + 1}
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
              value={
                answers[question.id] ||
                ""
              }
              onChange={
                handleAnswerChange
              }
              placeholder="Type your answer here..."
              rows={8}
              className="w-full resize-y rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-4 py-3 text-sm leading-6 text-[#292d28] outline-none transition-colors placeholder:text-[#9aa095] hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
            />

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

              <button
                type="button"
                onClick={
                  handlePreviousQuestion
                }
                disabled={
                  currentQuestion === 0
                }
                className="rounded-lg border border-[#d6dcd2] px-4 py-2.5 text-sm font-medium text-[#59684c] transition hover:bg-[#f1f3ee] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {currentQuestion <
              questions.length - 1 ? (
                <button
                  type="button"
                  onClick={
                    handleNextQuestion
                  }
                  className="rounded-lg bg-[#59684c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d5b42]"
                >
                  Next Question
                </button>
              ) : (
                <button
                  type="button"
                  onClick={
                    handleSubmitTest
                  }
                  className="rounded-lg bg-[#59684c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d5b42]"
                >
                  Submit Test
                </button>
              )}

            </div>

          </Card>

          <div className="mx-auto mt-4 max-w-4xl rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] px-4 py-3">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs leading-5 text-[#697066]">
                Proctoring is active. Restricted activity may generate a warning.
              </p>

              <p className="text-xs font-medium text-[#7a5c42]">
                Violations:{" "}
                {violationCount} /{" "}
                {MAX_VIOLATIONS}
              </p>

            </div>

          </div>

        </main>

      </div>

      {warningPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-xl bg-[#fffefa] p-6 shadow-2xl">

            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#7a5c42] text-lg font-semibold text-white">
              !
            </div>

            <h2 className="mt-5 text-center text-xl font-semibold text-[#292d28]">
              {warningPopup.title}
            </h2>

            <p className="mt-3 text-center text-sm leading-6 text-[#697066]">
              {warningPopup.message}
            </p>

            <div className="mt-5 rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-3 text-center">

              <p className="text-xs text-[#838a7f]">
                Anti-cheat violations
              </p>

              <p className="mt-1 text-lg font-semibold text-[#7a5c42]">
                {violationCount} /{" "}
                {MAX_VIOLATIONS}
              </p>

            </div>

            <button
              type="button"
              onClick={
                handleCloseWarning
              }
              className="mt-6 w-full rounded-lg bg-[#59684c] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#4d5b42]"
            >
              Continue Test
            </button>

          </div>

        </div>
      )}

    </div>
  )
}

export default CandidateTest
