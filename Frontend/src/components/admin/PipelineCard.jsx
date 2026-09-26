import Card from "../common/Card"

function PipelineCard({ stages }) {
  const highestCount = Math.max(...stages.map((stage) => stage.count))

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[#e1e5dd] px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-[#292d28]">Candidate Pipeline</h2>
            <p className="mt-1 text-sm text-[#697066]">Progress across the current hiring funnel</p>
          </div>
          <span className="text-xs text-[#838a7f]">45 candidates across stages</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4 sm:p-5 md:grid-cols-5">
        {stages.map((stage, index) => (
          <div
            key={stage.name}
            className="relative min-w-0 rounded-lg border border-[#e0e4dc] bg-[#f1f3ee] p-3 sm:p-4"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[#838a7f]">0{index + 1}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#879276]" />
            </div>
            <p className="text-2xl font-semibold tabular-nums text-[#292d28]">{stage.count}</p>
            <p className="mt-1 min-h-9 text-xs leading-4 text-[#697066]">{stage.name}</p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#dfe4db]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#758368] to-[#aab49a]"
                style={{ width: `${Math.max(16, (stage.count / highestCount) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default PipelineCard