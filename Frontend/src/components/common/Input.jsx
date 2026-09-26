import { useId } from "react"

function Input({
  label,
  hint,
  error,
  id: providedId,
  className = "",
  ...inputProps
}) {
  const generatedId = useId()
  const id = providedId ?? generatedId
  const messageId = `${id}-message`
  const message = error || hint

  return (
    <div className="grid gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#434a40]">
          {label}
        </label>
      )}
      <input
        {...inputProps}
        id={id}
        aria-invalid={error ? "true" : inputProps["aria-invalid"]}
        aria-describedby={message ? messageId : inputProps["aria-describedby"]}
        className={`min-h-11 w-full rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#292d28] outline-none transition-colors placeholder:text-[#92988e] hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20 disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-[#b96c5d] focus:border-[#a94c39] focus:ring-[#a94c39]/20" : ""} ${className}`}
      />
      {message && (
        <p id={messageId} className={`text-xs ${error ? "text-[#a94c39]" : "text-[#747b71]"}`}>
          {message}
        </p>
      )}
    </div>
  )
}

export default Input