import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../../api"
import Badge from "../../components/common/Badge"
import Card from "../../components/common/Card"
import Input from "../../components/common/Input"
import DashboardLayout from "../../components/layout/DashboardLayout"
import PageHeader from "../../components/layout/PageHeader"

function CandidateList() {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("All Status")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    API.get("/candidates")
      .then((response) => setCandidates(response.data.candidates || []))
      .catch((err) => setError(err.response?.data?.message || "Unable to load candidates."))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => candidates.filter((candidate) => {
    const matchesSearch = `${candidate.name} ${candidate.email} ${candidate.appliedJobId?.title || ""}`.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = status === "All Status" || candidate.screeningStatus === status
    return matchesSearch && matchesStatus
  }), [candidates, search, status])

  return (
    <DashboardLayout topbarTitle="Candidate management">
      <PageHeader description="Review candidate applications and AI screening results." eyebrow="Candidate management" title="Candidates" />
      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <Card className="mb-6 p-4 sm:p-5"><div className="grid gap-4 sm:grid-cols-2"><Input placeholder="Search candidate or job..." value={search} onChange={(event) => setSearch(event.target.value)} /><select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-11 rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm"><option>All Status</option><option value="pending">Pending</option><option value="shortlisted">Shortlisted</option><option value="rejected">Rejected</option></select></div></Card>
      {loading ? <Card className="p-8 text-center text-sm text-[#697066]">Loading candidates...</Card> : filtered.length === 0 ? <Card className="p-8 text-center text-sm text-[#697066]">No candidate applications found.</Card> : <div className="grid gap-4">{filtered.map((candidate) => <Card key={candidate._id} className="p-5"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h2 className="text-lg font-semibold">{candidate.name}</h2><p className="mt-1 text-sm text-[#697066]">{candidate.email} · {candidate.appliedJobId?.title || "Job unavailable"}</p><p className="mt-2 text-xs text-[#838a7f]">{candidate.experienceYears || 0} years experience · {candidate.education || "Education not specified"}</p></div><div className="flex items-center gap-3"><div className="text-right"><p className="text-xs text-[#838a7f]">AI screening score</p><p className="text-xl font-semibold">{candidate.resumeScore ?? "Pending"}{candidate.resumeScore !== null ? "/100" : ""}</p></div><Badge status={candidate.screeningStatus}>{candidate.screeningStatus}</Badge><button onClick={() => navigate(`/admin/candidates/${candidate._id}`)} className="rounded-lg border border-[#d6dcd2] px-3 py-2 text-sm font-medium text-[#59684c]">View</button></div></div></Card>)}</div>}
    </DashboardLayout>
  )
}

export default CandidateList
