import Button from "../../components/common/Button"
import ActiveJobsCard from "../../components/admin/ActiveJobsCard"
import PipelineCard from "../../components/admin/PipelineCard"
import QuickActions from "../../components/admin/QuickActions"
import RecentCandidates from "../../components/admin/RecentCandidates"
import StatCard from "../../components/admin/StatCard"
import DashboardLayout from "../../components/layout/DashboardLayout"
import PageHeader from "../../components/layout/PageHeader"
import { useNavigate } from "react-router-dom"

function AdminDashboard() {
  const navigate = useNavigate()
  const candidates = [
    { name: "Aarav Kumar", job: "Frontend Developer", score: 86, status: "Screening", nextStep: "Resume review" },
    { name: "Priya Sharma", job: "Java Backend Developer", score: 91, status: "Interview", nextStep: "Technical round" },
    { name: "Rahul Raj", job: "Python Developer", score: 74, status: "Screening", nextStep: "Online assessment" },
    { name: "Ananya S", job: "Frontend Developer", score: 68, status: "Rejected", nextStep: "No action required" },
    { name: "Karthik M", job: "Java Backend Developer", score: 79, status: "Selected", nextStep: "Offer review" },
  ]
  const jobs = [
    { title: "Frontend Developer", location: "Mumbai", experience: "2+ years", candidates: 14, threshold: 70, status: "Active" },
    { title: "Java Backend Developer", location: "Bengaluru", experience: "3+ years", candidates: 21, threshold: 72, status: "Active" },
    { title: "Python Developer", location: "Pune", experience: "2+ years", candidates: 13, threshold: 70, status: "Active" },
  ]
  const pipelineStages = [
    { name: "Resume Screening", count: 18 },
    { name: "Screening Test", count: 12 },
    { name: "Interview", count: 7 },
    { name: "Selected", count: 3 },
    { name: "Rejected", count: 5 },
  ]

  return (
    <DashboardLayout
      topbarTitle="Dashboard"
      topbarContent={<span className="ml-2 border-l border-[#d6dcd2] pl-4 text-sm text-[#697066]">Hiring Manager</span>}
      topbarActions={(
        <div className="flex items-center gap-3">
          <Button aria-label="Notifications" className="relative h-10 w-10 px-0" title="Notifications" variant="ghost">
            <svg aria-hidden="true" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24">
              <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 13h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </Button>
          <div className="flex items-center gap-2.5 border-l border-[#d6dcd2] pl-3">
            <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full border border-[#c3cbb9] bg-[#e6ebe3] text-xs font-semibold text-[#526046]">HM</span>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-[#434a40]">Hiring Manager</p>
              <p className="mt-0.5 text-[10px] text-[#858c81]">Administrator</p>
            </div>
          </div>
        </div>
      )}
    >
      <PageHeader
        actions={<Button onClick={() => navigate("/admin/jobs")}>Create Job</Button>}
        description="Monitor your hiring pipeline and candidate progress."
        eyebrow="Hiring overview"
        title="Good morning, Hiring Manager"
      />

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Hiring overview">
        <StatCard bars={[35, 48, 42, 64, 58, 78, 72]} detail="open positions" title="Active Jobs" trend="+1 this month" value="3" />
        <StatCard bars={[35, 48, 42, 64, 58, 78, 90]} detail="across active roles" title="Total Candidates" trend="12 new this week" value="48" />
        <StatCard bars={[70, 54, 65, 42, 58, 38, 48]} detail="awaiting review" title="Candidates in Screening" tone="attention" trend="6 need review" value="18" />
        <StatCard id="interviews-scheduled" bars={[32, 48, 38, 62, 55, 78, 68]} detail="across all roles" title="Interviews Scheduled" trend="3 this week" value="7" />
      </section>

      <div className="mb-6">
        <PipelineCard stages={pipelineStages} />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(290px,0.85fr)]">
        <div className="grid min-w-0 gap-6">
          <RecentCandidates candidates={candidates} onViewAll={() => navigate("/admin/candidates")} />
          <ActiveJobsCard jobs={jobs} />
        </div>
        <QuickActions />
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard