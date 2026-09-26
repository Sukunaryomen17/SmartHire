import { Link } from "react-router-dom"
import Card from "../common/Card"

const actions = [
  { label: "Create Job", detail: "Set up a new opening", to: "/admin/jobs" },
  { label: "View Candidates", detail: "Review all applications", to: "/admin/candidates" },
  { label: "View Interviews", detail: "Jump to scheduled interviews", to: "#interviews-scheduled" },
]

function QuickActions() {
  return (
    <Card as="section" className="p-5 sm:p-6">
      <h2 className="text-base font-semibold text-[#292d28]">Quick Actions</h2>
      <div className="mt-4 grid gap-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            className="group flex items-center justify-between gap-3 rounded-lg border border-[#dfe4db] bg-[#f1f3ee] px-3.5 py-3 transition-colors hover:border-[#aeb89f] hover:bg-[#e9eee5]"
            to={action.to}
          >
            <span>
              <span className="block text-sm font-medium text-[#434a40] group-hover:text-[#252a25]">{action.label}</span>
              <span className="mt-0.5 block text-xs text-[#838a7f]">{action.detail}</span>
            </span>
            <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-[#7b876d] transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24">
              <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
            </svg>
          </Link>
        ))}
      </div>
    </Card>
  )
}

export default QuickActions