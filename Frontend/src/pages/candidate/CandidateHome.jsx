import { Link } from "react-router-dom"

function CandidateHome() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e6ebe3] px-5 py-10 text-[#292d28]">
      <section className="w-full max-w-lg rounded-xl border border-[#d4d9d0] bg-[#fafbf8] p-7 shadow-sm sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#747e68]">Candidate portal</p>
        <h1 className="mt-3 text-3xl font-semibold">Candidate workspace</h1>
        <p className="mt-3 text-sm leading-6 text-[#697066]">
          Your candidate experience will be available here soon.
        </p>
        <Link
          className="mt-6 inline-flex text-sm font-medium text-[#59684c] transition-colors hover:text-[#394632]"
          to="/login"
        >
          Return to sign in
        </Link>
      </section>
    </main>
  )
}

export default CandidateHome