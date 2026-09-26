function ScoreDisplay({ score, label = "Score", confidence, justification, className = "" }) {
  const numericScore = Number(score)
  const scoreIsNumeric = Number.isFinite(numericScore)
  const progress = scoreIsNumeric ? Math.min(100, Math.max(0, numericScore)) : 0
  const confidenceValue = Number(confidence)
  const confidenceLabel = Number.isFinite(confidenceValue)
    ? `${Math.round(confidenceValue <= 1 ? confidenceValue * 100 : confidenceValue)}%`
    : confidence

  return (
    <div className={`min-w-0 ${className}`}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="truncate text-sm text-[#697066]">{label}</span>
        <span className="shrink-0 text-lg font-semibold tabular-nums text-[#59684c]">
          {scoreIsNumeric ? numericScore : score}
          <span className="ml-1 text-xs font-normal text-[#92988e]">/100</span>
        </span>
      </div>
      <div
        aria-label={`${label}: ${scoreIsNumeric ? numericScore : score} out of 100`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={progress}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e3e7df]"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#758368] to-[#a8b197] transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      {(confidenceLabel !== undefined || justification) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#747b71]">
          {confidenceLabel !== undefined && <span>Confidence {confidenceLabel}</span>}
          {justification && <span className="basis-full text-[#697066]">{justification}</span>}
        </div>
      )}
    </div>
  )
}

export default ScoreDisplay