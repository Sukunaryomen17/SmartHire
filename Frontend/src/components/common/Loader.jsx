function Loader({ label = "Loading", size = "md", className = "" }) {
  const dimensions = size === "sm" ? "h-4 w-4 border-2" : size === "lg" ? "h-8 w-8 border-[3px]" : "h-6 w-6 border-2"

  return (
    <div className={`inline-flex items-center gap-3 text-sm text-[#697066] ${className}`} role="status">
      <span
        aria-hidden="true"
        className={`${dimensions} animate-spin rounded-full border-[#879276]/25 border-t-[#879276]`}
      />
      <span>{label}</span>
    </div>
  )
}

export default Loader