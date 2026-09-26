const variants = {
  primary: "border border-[#252a25] bg-[#252a25] text-[#f7f8f3] hover:bg-[#414740] focus-visible:ring-[#89927d]",
  secondary: "border border-[#cbd1c7] bg-[#fafbf8] text-[#343a33] hover:bg-[#eef1eb] focus-visible:ring-[#89927d]",
  danger: "border border-[#9b4e40] bg-[#9b4e40] text-white hover:bg-[#834034] focus-visible:ring-[#bd766a]",
  ghost: "border border-transparent bg-transparent text-[#555c52] hover:bg-[#e9ede6] hover:text-[#252a25] focus-visible:ring-[#89927d]",
}

function Button({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...props
}) {
  const variantClass = variants[variant] ?? variants.primary

  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e6ebe3] disabled:pointer-events-none disabled:opacity-50 ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button