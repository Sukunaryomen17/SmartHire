import { useEffect, useId } from "react"

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
}

function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className = "",
}) {
  const titleId = useId()
  const descriptionId = useId()
  const sizeClass = sizeClasses[size] ?? sizeClasses.md

  useEffect(() => {
    if (!open) return undefined

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose?.()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#252a25]/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.()
      }}
    >
      <section
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        aria-modal="true"
        className={`my-auto w-full ${sizeClass} rounded-xl border border-[#d4d9d0] bg-[#fafbf8] text-[#292d28] shadow-2xl shadow-[#292d28]/15 ${className}`}
        role="dialog"
      >
        {(title || description) && (
          <header className="border-b border-[#e1e5dd] px-5 py-4">
            {title && <h2 id={titleId} className="text-lg font-semibold text-[#292d28]">{title}</h2>}
            {description && (
              <p id={descriptionId} className="mt-1 text-sm text-[#697066]">
                {description}
              </p>
            )}
          </header>
        )}
        <div className="p-5">{children}</div>
        {footer && <footer className="border-t border-[#e1e5dd] px-5 py-4">{footer}</footer>}
      </section>
    </div>
  )
}

export default Modal