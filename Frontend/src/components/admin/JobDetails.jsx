import Badge from "../common/Badge"

function SkillList({ label, skills }) {
  const items = skills.split(",").map((skill) => skill.trim()).filter(Boolean)

  return (
    <section>
      <h3 className="text-xs font-medium uppercase tracking-wide text-[#747b71]">{label}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.length > 0 ? items.map((skill) => (
          <span key={skill} className="rounded-md border border-[#d0d7c8] bg-[#edf1e8] px-2.5 py-1.5 text-xs text-[#526046]">
            {skill}
          </span>
        )) : <p className="text-sm text-[#838a7f]">None specified</p>}
      </div>
    </section>
  )
}

function Detail({ label, value }) {
  return (
    <div className="rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-3.5">
      <dt className="text-xs text-[#838a7f]">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-[#434a40]">{value}</dd>
    </div>
  )
}

function JobDetails({ job }) {
  const statistics = [
    { label: "Total candidates", value: job.statistics.totalCandidates },
    { label: "In screening", value: job.statistics.screening },
    { label: "Interviewed", value: job.statistics.interviewed },
    { label: "Selected", value: job.statistics.selected },
  ]

  return (
    <div className="grid gap-6">
      <section>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-[#292d28]">Job Information</h3>
            <p className="mt-1 text-sm text-[#697066]">{job.location} <span className="px-1 text-[#a2a89e]">/</span> {job.experience}</p>
          </div>
          <Badge status={job.status}>{job.status}</Badge>
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <Detail label="Education" value={job.education} />
          <Detail label="Created" value={job.createdAt} />
        </dl>
      </section>

      <section className="grid gap-4 border-t border-[#e1e5dd] pt-5 sm:grid-cols-2">
        <SkillList label="Must-have skills" skills={job.mustHave} />
        <SkillList label="Nice-to-have skills" skills={job.niceToHave} />
      </section>

      <section className="border-t border-[#e1e5dd] pt-5">
        <h3 className="text-base font-semibold text-[#292d28]">Scoring Configuration</h3>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Detail label="Resume weight" value={`${job.resumeWeight}%`} />
          <Detail label="Q&A weight" value={`${job.qaWeight}%`} />
          <Detail label="Pass threshold" value={`${job.threshold}%`} />
          <Detail label="Confidence cutoff" value={`${job.confidenceCutoff}%`} />
        </dl>
      </section>

      <section className="border-t border-[#e1e5dd] pt-5">
        <h3 className="text-base font-semibold text-[#292d28]">Candidate Statistics</h3>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {statistics.map((stat) => <Detail key={stat.label} {...stat} />)}
        </dl>
      </section>
    </div>
  )
}

export default JobDetails