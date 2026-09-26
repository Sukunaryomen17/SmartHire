import { Link } from "react-router-dom"
import Badge from "../common/Badge"
import Card from "../common/Card"

function ActiveJobsCard({ jobs }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-[#e1e5dd] px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-[#292d28]">Active Jobs</h2>
          <p className="mt-1 text-sm text-[#697066]">Open roles and candidate volume</p>
        </div>
        <Link
          className="shrink-0 text-sm font-medium text-[#59684c] transition-colors hover:text-[#394632]"
          to="/admin/jobs"
        >
          View Jobs
        </Link>
      </div>
      <div className="divide-y divide-[#e7eae3] px-5 sm:px-6">
        {jobs.map((job) => (
          <article key={job.title} className="py-4 first:pt-5 last:pb-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-[#292d28]">{job.title}</h3>
                <p className="mt-1 text-xs text-[#747b71]">{job.location} <span className="px-1 text-[#a2a89e">/</span> {job.experience}</p>
              </div>
              <Badge status="ACTIVE">{job.status}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[#838a7f]">Candidates</p>
                <p className="mt-1 font-semibold tabular-nums text-[#434a40]">{job.candidates}</p>
              </div>
              <div>
                <p className="text-[#838a7f]">Pass threshold</p>
                <p className="mt-1 font-semibold tabular-nums text-[#434a40]">{job.threshold}%</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Card>
  )
}

export default ActiveJobsCard