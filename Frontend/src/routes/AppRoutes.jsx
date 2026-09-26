import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "../pages/Login"
import SmartAudit from "../pages/admin/SmartAudit"
import AdminDashboard from "../pages/admin/AdminDashboard"
import JobDescriptions from "../pages/admin/JobDescriptions"
import CandidateList from "../pages/admin/CandidateList"
import CandidateDetails from "../pages/admin/CandidateDetails"
import CandidateDashboard from "../pages/candidate/CandidateDashboard"
import CandidateApplication from "../pages/candidate/CandidateApplication"
import CandidateTest from "../pages/candidate/CandidateTest"
import CandidateResult from "../pages/candidate/CandidateResult"
import Interviews from "../pages/admin/Interviews"
import InterviewerCandidates from "../pages/interviewer/InterviewerCandidates"
import InterviewerEvaluation from "../pages/interviewer/InterviewerEvaluation"
import CandidateInterview from "../pages/candidate/CandidateInterview"
import AntiCheatReview from "../pages/admin/AntiCheatReview"
import FinalDecision from "../pages/admin/FinalDecision"
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/audit" element={<SmartAudit />} />
        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/jobs" element={<JobDescriptions />} />
        <Route path="/admin/candidates" element={<CandidateList />} />
        <Route
        path="/candidate/interview"
        element={<CandidateInterview />}
/>
        <Route path="/admin/final-decision" element={<FinalDecision />} />
        <Route path="/admin/anti-cheat" element={<AntiCheatReview />} />
        {/* Candidate */}
        <Route path="/candidate" element={<CandidateDashboard />} />
        <Route
          path="/candidate/dashboard"
          element={<CandidateDashboard />}
        />
        <Route path="/admin/interviews" element={<Interviews />} />
        <Route
          path="/candidate/application"
          element={<CandidateApplication />}
        />
        <Route path="/candidate/test" element={<CandidateTest />} />
        <Route path="/candidate/result" element={<CandidateResult />} />
        <Route
            path="/admin/candidates/:id"
            element={<CandidateDetails />}
        />
        {/* Interviewer */}
        <Route
          path="/interviewer"
          element={<InterviewerCandidates />}
        />

        <Route
          path="/interviewer/evaluation"
          element={<InterviewerEvaluation />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes