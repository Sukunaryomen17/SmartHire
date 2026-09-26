const statusStyles = {
  PASS: "border-[#9dad90] bg-[#e6eee1] text-[#3f5940]",
  HOLD: "border-[#d1bd8f] bg-[#f2eddc] text-[#756034]",
  REJECT: "border-[#d3aca1] bg-[#f5e8e4] text-[#875044]",
  SCREENING: "border-[#aab69e] bg-[#e9eee5] text-[#536448]",
  INTERVIEW: "border-[#b9b2c1] bg-[#eeebf0] text-[#65586d]",
  SELECTED: "border-[#9dad90] bg-[#e6eee1] text-[#3f5940]",
  ACTIVE: "border-[#aab69e] bg-[#e9eee5] text-[#536448]",
  ARCHIVED: "border-[#c9cec4] bg-[#eceee9] text-[#666d62]",
}

function Badge({ status = "ACTIVE", children, className = "" }) {
  const label = children ?? status
  const key = String(status).trim().toUpperCase()
  const normalizedKey = key === "REJECTED" ? "REJECT" : key
  const style = statusStyles[normalizedKey] ?? statusStyles.ACTIVE

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium leading-none ${style} ${className}`}
    >
      {label}
    </span>
  )
}

export default Badge