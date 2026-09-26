import Badge from "../common/Badge"
import Button from "../common/Button"
import Card from "../common/Card"
import ScoreDisplay from "../common/ScoreDisplay"

function RecentCandidates({ candidates, onViewAll }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e1e5dd] px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-[#292d28]">Recent Candidates</h2>
          <p className="mt-1 text-sm text-[#697066]">Latest applications across active roles</p>
        </div>
        <Button onClick={onViewAll} variant="ghost">View All</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-[#edf0ea] text-xs uppercase tracking-wide text-[#747b71]">
            <tr>
              <th className="px-5 py-3 font-medium sm:px-6">Candidate</th>
              <th className="px-5 py-3 font-medium sm:px-6">Job</th>
              <th className="px-5 py-3 font-medium sm:px-6">Resume Score</th>
              <th className="px-5 py-3 font-medium sm:px-6">Status</th>
              <th className="px-5 py-3 font-medium sm:px-6">Next Step</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7eae3]">
            {candidates.map((candidate) => {
              const initials = candidate.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)

              return (
                <tr key={candidate.name} className="transition-colors hover:bg-[#f0f3ed]">
                  <td className="px-5 py-3.5 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#cbd3c3] bg-[#e8ede4] text-[10px] font-semibold text-[#59684c]">
                        {initials}
                      </span>
                      <span className="whitespace-nowrap text-sm font-medium text-[#292d28]">{candidate.name}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-[#697066] sm:px-6">{candidate.job}</td>
                  <td className="px-5 py-3.5 sm:px-6">
                    <ScoreDisplay className="max-w-32" label="Score" score={candidate.score} />
                  </td>
                  <td className="px-5 py-3.5 sm:px-6">
                    <Badge status={candidate.status}>{candidate.status}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-[#697066] sm:px-6">{candidate.nextStep}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default RecentCandidates