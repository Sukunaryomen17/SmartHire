import { useState } from "react"
import { useNavigate } from "react-router-dom"

const roles = [
  { id: "admin", label: "Hiring Manager" },
  { id: "candidate", label: "Candidate" },
  { id: "interviewer", label: "Interviewer" },
]

const roleRoutes = {
  admin: "/admin",
  candidate: "/candidate",
  interviewer: "/interviewer",
}

function Login() {
  const [selectedRole, setSelectedRole] = useState("admin")
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    navigate(roleRoutes[selectedRole])
  }

  return (
    <main className="min-h-screen bg-[#e6ebe3] lg:grid lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative isolate flex min-h-[40vh] flex-col overflow-hidden bg-[#252a25] px-6 py-6 text-[#f6f7f1] sm:px-10 lg:min-h-screen lg:px-[8vw] lg:py-9">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_0%,rgba(174,184,159,0.2),transparent_44%),linear-gradient(135deg,#353b34_0%,#252a25_60%,#1e221e_100%)]" />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif text-lg tracking-wide">SmartHire</p>
            <p className="mt-0.5 text-xs text-[#c8cdc1]">Hiring intelligence</p>
          </div>
          <span className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-[#e7e9e2]">
            AI-powered talent platform
          </span>
        </div>

        <div className="my-auto max-w-2xl py-12 lg:py-20">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#bdc5b3]">
            Make every hiring decision count
          </p>
          <h1 className="max-w-xl text-4xl font-light leading-[1.08] sm:text-5xl lg:text-6xl">
            Find the signal in every application.
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-6 text-[#c8cdc1] sm:text-base">
            Bring your roles, candidates, and interview decisions together in one clear workspace.
          </p>
        </div>

        <p className="hidden text-xs text-[#aeb5a7] lg:block">Smart decisions. Better teams.</p>
      </section>

      <section className="flex items-center justify-center bg-[#e6ebe3] px-5 py-12 text-[#292d28] sm:px-10 lg:px-14">
        <div className="w-full max-w-md">
          <div className="mb-7">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#747e68]">Your workspace</p>
            <h2 className="text-3xl font-normal text-[#292d28] sm:text-4xl">Welcome back</h2>
            <p className="mt-2 text-sm text-[#697066]">Sign in to continue to SmartHire.</p>
          </div>

          <form
            className="rounded-xl border border-[#d4d9d0] bg-[#fafbf8] p-5 shadow-sm shadow-[#363d31]/[0.04] sm:p-7"
            onSubmit={handleSubmit}
          >
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-[#434a40]">Choose your role</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {roles.map((role) => {
                  const isSelected = selectedRole === role.id

                  return (
                    <button
                      key={role.id}
                      aria-pressed={isSelected}
                      className={`min-h-14 rounded-lg border px-3 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                        isSelected
                          ? "border-[#59644e] bg-[#252a25] text-[#f7f8f3] ring-1 ring-[#879276]/30"
                            : "border-[#cbd1c7] bg-[#fffefa] text-[#555c52] hover:border-[#9ca58f] hover:text-[#292d28]"
                      }`}
                      onClick={() => setSelectedRole(role.id)}
                      type="button"
                    >
                      {role.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-[#434a40]">
                Email
                <input
                  autoComplete="email"
                  className="min-h-11 w-full rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#292d28] outline-none transition-colors placeholder:text-[#92988e] hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
                  name="email"
                  placeholder="name@company.com"
                  required
                  type="email"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-[#434a40]">
                Password
                <input
                  autoComplete="current-password"
                  className="min-h-11 w-full rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#292d28] outline-none transition-colors placeholder:text-[#92988e] hover:border-[#aeb6a8] focus:border-[#879276] focus:ring-2 focus:ring-[#879276]/20"
                  name="password"
                  placeholder="Enter your password"
                  required
                  type="password"
                />
              </label>
              <button
                className="mt-1 min-h-11 w-full rounded-lg border border-[#252a25] bg-[#252a25] px-4 py-2.5 text-sm font-semibold text-[#f7f8f3] transition-colors hover:bg-[#414740] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#879276] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafbf8]"
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>
          <p className="mt-6 text-center text-xs text-[#747b71]">Secure access for your hiring team</p>
        </div>
      </section>
    </main>
  )
}

export default Login