function Topbar({ title = "SmartHire", children, actions, className = "" }) {
  return (
    <header className={`flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#d6dcd2] bg-[#fafbf8]/95 px-5 py-3 text-[#292d28] sm:px-8 ${className}`}>
      <h1 className="text-sm font-semibold tracking-wide text-[#292d28]">{title}</h1>
      {children && <div className="flex min-w-0 flex-1 items-center">{children}</div>}
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </header>
  )
}

export default Topbar