import Card from "../common/Card"

function StatCard({ id, title, value, detail, trend, bars, tone = "positive" }) {
  const trendColor = tone === "attention" ? "text-[#816c3b]" : "text-[#52664b]"
  const indicatorColor = tone === "attention" ? "bg-[#ad9258]" : "bg-[#829176]"

  return (
    <Card as="article" className="relative isolate overflow-hidden p-5 sm:p-6" id={id}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9eaa8e]/70 to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#697066]">{title}</p>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-[#292d28]">{value}</p>
        </div>
        <div aria-hidden="true" className="mt-1 flex h-8 items-end gap-1">
          {bars.map((height, index) => (
            <span
              key={`${height}-${index}`}
              className="w-1.5 rounded-t-sm bg-gradient-to-t from-[#68765d] to-[#bbc4ad]"
              style={{ height: `${height}%`, opacity: 0.45 + index * 0.08 }}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-[#e1e5dd] pt-3 text-xs">
        <span className={`inline-flex items-center gap-1.5 font-medium ${trendColor}`}>
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${indicatorColor}`} />
          {trend}
        </span>
        <span className="text-[#838a7f]">{detail}</span>
      </div>
    </Card>
  )
}

export default StatCard