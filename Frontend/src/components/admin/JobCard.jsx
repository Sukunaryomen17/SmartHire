import Badge from "../common/Badge"
import Button from "../common/Button"
import Card from "../common/Card"

function JobCard({ job, onView, onEdit, onArchive }) {
  const facts = [
    { label: "Experience", value: job.experience },
    { label: "Candidates", value: job.candidateCount },
    { label: "Pass threshold", value: `${job.threshold}%` },
    { label: "Created", value: job.createdAt },
  ]

  return (
    <Card as="article" className="overflow-hidden transition-colors hover:border-[#aeb89f]">
      <div className="h-px bg-gradient-to-r from-[#68765d]/70 via-[#b5beaa]/50 to-transparent" />
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-[#292d28]">{job.title}</h2>
            <p className="mt-1 text-sm text-[#697066]">{job.location}</p>
          </div>
          <Badge status={job.status}>{job.status}</Badge>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
          {facts.map((fact) => (
            <div key={fact.label} className="min-w-0 rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] px-3.5 py-3">
              <dt className="text-xs text-[#838a7f]">{fact.label}</dt>
              <dd className="mt-1 truncate text-sm font-medium text-[#434a40]">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#e1e5dd] pt-4">
          <Button className="flex-1" onClick={() => onView(job)} variant="secondary">View</Button>
          <Button className="flex-1" onClick={() => onEdit(job)} variant="ghost">Edit</Button>
          {job.status === "Active" && (
            <Button className="flex-1" onClick={() => onArchive(job)} variant="danger">Archive</Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export default JobCard