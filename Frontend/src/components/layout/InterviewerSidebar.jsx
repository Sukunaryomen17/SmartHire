import { Link, useLocation } from "react-router-dom"

function InterviewerSidebar() {
  const location = useLocation()

  const menuItems = [
    {
      name: "Assigned Candidates",
      path: "/interviewer",
    },
    {
      name: "Evaluations",
      path: "/interviewer/evaluation",
    },
  ]

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-[#414640] bg-[#252a25] text-[#f5f6f1] lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:border-[#414640]">
      {/* Logo / Portal name */}
      <div className="border-b border-[#414640] px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#aeb8a3]">
          SmartHire
        </p>

        <h1 className="mt-1 text-lg font-semibold">
          Interviewer Portal
        </h1>

        <p className="mt-1 text-xs text-[#9da59a]">
          Interview management
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#838a7f]">
          Navigation
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              item.path === "/interviewer"
                ? location.pathname === "/interviewer"
                : location.pathname.startsWith(item.path)

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#59684c] text-white"
                    : "text-[#c5cbc0] hover:bg-[#343a33] hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User / role section */}
      <div className="border-t border-[#414640] p-4">
        <p className="text-xs text-[#838a7f]">
          Logged in as
        </p>

        <p className="mt-1 text-sm font-medium text-[#f5f6f1]">
          Interviewer
        </p>
      </div>
    </aside>
  )
}

export default InterviewerSidebar