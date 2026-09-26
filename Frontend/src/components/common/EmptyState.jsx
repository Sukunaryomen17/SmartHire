function EmptyState({ title, description, action, className = "" }) {
  return (
    <div className={`flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center ${className}`}>
      <h2 className="text-base font-semibold text-[#292d28]">{title}</h2>
      {description && <p className="mt-2 max-w-md text-sm text-[#697066]">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export default EmptyState