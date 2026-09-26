import { Link, useLocation } from "react-router-dom"

function Sidebar() {
  const location = useLocation()

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
    },
    {
      name: "Jobs",
      path: "/admin/jobs",
    },
    {
      name: "Candidates",
      path: "/admin/candidates",
    },
    {
      name: "Interviews",
      path: "/admin/interviews",
    },
    {
      name: "Anti-Cheat Review",
      path: "/admin/anti-cheat",
    },
    {
      name: "Final Decision",
      path: "/admin/final-decision",
    },
    {
      name: "Audit Log",
      path: "/admin/audit",
    },
  ]

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-[#414640] bg-[#252a25] text-[#f5f6f1] lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:border-[#414640]">

      {/* Logo */}
      <div className="border-b border-white/10 px-5 py-4 sm:px-6 lg:py-6">
        <h1 className="text-xl font-semibold text-[#f5f6f1]">
          SmartHire
        </h1>

        <p className="mt-1 text-xs text-[#c0c5ba]">
          Hiring Management
        </p>
      </div>

      {/* Navigation */}
      <nav className="p-2 sm:px-4 lg:flex-1 lg:p-4">

        <p className="mb-2 hidden px-3 text-xs uppercase tracking-wider text-[#9fa69a] lg:mb-3 lg:block">
          Menu
        </p>

        <div className="flex gap-1 overflow-x-auto lg:flex-col lg:space-y-1 lg:overflow-visible">

          {menuItems.map((item) => {

            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block shrink-0 rounded-lg px-3 py-2.5 text-sm transition-colors lg:shrink lg:py-3 ${
                  isActive
                    ? "border border-[#aeb89f]/25 bg-[#879276]/20 text-[#f5f6f1] shadow-inner shadow-white/5"
                    : "border border-transparent text-[#c0c5ba] hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            )
          })}

        </div>

      </nav>

      {/* Admin */}
      <div className="hidden border-t border-white/10 p-4 lg:block">

        <div className="px-3 py-3">
          <p className="text-sm text-[#f5f6f1]">
            Hiring Manager
          </p>

          <p className="mt-1 text-xs text-[#9fa69a]">
            Administrator
          </p>
        </div>

        <button
          type="button"
          className="w-full px-3 py-2 text-left text-sm text-[#c0c5ba] transition-colors hover:text-white"
        >
          Logout
        </button>

      </div>

    </aside>
  )
}

export default Sidebar