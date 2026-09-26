function StateMessage({
  type = "empty",
  title,
  message,
  actionLabel,
  onAction,
}) {
  const styles = {
    loading: {
      container: "border-[#d6dcd2] bg-[#f8f9f6]",
      title: "text-[#292d28]",
      message: "text-[#697066]",
    },
    empty: {
      container: "border-[#d6dcd2] bg-[#f8f9f6]",
      title: "text-[#292d28]",
      message: "text-[#697066]",
    },
    error: {
      container: "border-[#dfcfcf] bg-[#faf7f7]",
      title: "text-[#5f3939]",
      message: "text-[#765b5b]",
    },
  }

  const currentStyle = styles[type] || styles.empty

  return (
    <div
      className={`rounded-xl border p-8 text-center ${currentStyle.container}`}
    >
      <div className="mx-auto max-w-md">
        {type === "loading" && (
          <div className="mx-auto mb-4 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d6dcd2] border-t-[#59684c]" />
          </div>
        )}

        {type === "empty" && (
          <div className="mx-auto mb-4 grid h-10 w-10 place-items-center rounded-full bg-[#e9ede5] text-[#59684c]">
            —
          </div>
        )}

        {type === "error" && (
          <div className="mx-auto mb-4 grid h-10 w-10 place-items-center rounded-full bg-[#eee2e2] text-sm font-semibold text-[#704444]">
            !
          </div>
        )}

        <h3 className={`text-base font-semibold ${currentStyle.title}`}>
          {title}
        </h3>

        {message && (
          <p className={`mt-2 text-sm leading-6 ${currentStyle.message}`}>
            {message}
          </p>
        )}

        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 rounded-lg bg-[#59684c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d5b42]"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export default StateMessage