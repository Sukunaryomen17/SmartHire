import Input from "../common/Input"

const statuses = ["All Jobs", "Active", "Archived"]

function JobFilters({ search, onSearchChange, status, onStatusChange, resultCount }) {
  return (
    <section className="mb-5 grid gap-4 rounded-xl border border-[#d4d9d0] bg-[#fafbf8] p-4 shadow-sm shadow-[#363d31]/[0.04] sm:grid-cols-[minmax(0,1fr)_220px_auto] sm:items-end sm:p-5">
      <Input
        aria-label="Search jobs"
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search jobs..."
        type="search"
        value={search}
      />
      <label className="grid gap-2 text-sm font-medium text-[#434a40]">
        Job status
        <select
          aria-label="Filter jobs by status"
          className="min-h-11 w-full rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#434a40] outline-none transition-colors hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
          onChange={(event) => onStatusChange(event.target.value)}
          value={status}
        >
          {statuses.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
      <p className="pb-1 text-sm text-[#838a7f]" aria-live="polite">
        {resultCount} {resultCount === 1 ? "job" : "jobs"}
      </p>
    </section>
  )
}

export default JobFilters