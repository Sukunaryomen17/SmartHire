function Card({ as: Component = "section", className = "", children, ...props }) {
  return (
    <Component
      className={`rounded-xl border border-[#d4d9d0] bg-[#fafbf8] shadow-sm shadow-[#363d31]/[0.04] ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card