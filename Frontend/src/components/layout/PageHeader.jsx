function PageHeader({ eyebrow, title, description, actions, className = "" }) {
  return (
    <div className={`relative isolate mb-8 flex flex-col gap-5 overflow-hidden rounded-xl border border-[#cbd3c5] bg-[#dfe6dc] px-6 py-7 text-[#292d28] shadow-sm sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-9 ${className}`}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_90%_0%,rgba(135,146,118,0.12),transparent_42%)]" />
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#737d68]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-normal leading-tight text-[#292d28] sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-[#697066]">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export default PageHeader