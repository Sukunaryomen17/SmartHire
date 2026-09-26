import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../../api"
import Card from "../../components/common/Card"
import DashboardLayout from "../../components/layout/DashboardLayout"
import PageHeader from "../../components/layout/PageHeader"

function CandidateDetails() {
  const { id } = useParams()
  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadCandidate = async () => {
    try {
      const response = await API.get(`/candidates/${id}`)
      setCandidate(response.data.candidate)
    } catch (err) { setError(err.response?.data?.message || "Unable to load candidate.") }
    finally { setLoading(false) }
  }

  useEffect(() => { loadCandidate() }, [id])

  const rescreen = async () => {
    try {
      setLoading(true)
      const response = await API.post(`/candidates/${id}/rescreen`)
      setCandidate(response.data.candidate)
      setError("")
    } catch (err) { setError(err.response?.data?.message || "Rescreening failed.") }
    finally { setLoading(false) }
  }

  if (loading) return <DashboardLayout topbarTitle="Candidate details"><Card className="p-8 text-center">Loading candidate...</Card></DashboardLayout>
  if (!candidate) return <DashboardLayout topbarTitle="Candidate details"><Card className="p-8 text-center text-red-700">{error || "Candidate not found."}</Card></DashboardLayout>

  return <DashboardLayout topbarTitle="Candidate details">
    <PageHeader eyebrow="Candidate review" title={candidate.name} description={`${candidate.email} · ${candidate.appliedJobId?.title || "Job"}`} actions={<button onClick={rescreen} className="rounded-lg bg-[#59684c] px-4 py-2.5 text-sm font-medium text-white">Run Screening Again</button>} />
    {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-5 sm:p-6"><h2 className="text-lg font-semibold">Candidate Profile</h2><dl className="mt-5 grid gap-3">{[["Location",candidate.location], ["Education",candidate.education], ["Experience",`${candidate.experienceYears || 0} years`], ["Skills",(candidate.skills || []).join(", ") || "None"], ["Projects",(candidate.projects || []).join("; ") || "None"]].map(([label,value]) => <div key={label}><dt className="text-xs text-[#838a7f]">{label}</dt><dd className="mt-1 text-sm">{value}</dd></div>)}</dl><p className="mt-5 text-sm leading-6 text-[#697066]">{candidate.profileSummary}</p></Card>
      <Card className="p-5 sm:p-6"><h2 className="text-lg font-semibold">AI Screening</h2><p className="mt-5 text-4xl font-semibold">{candidate.resumeScore ?? "Pending"}{candidate.resumeScore !== null ? "/100" : ""}</p><p className="mt-2 text-sm capitalize text-[#697066]">Status: {candidate.screeningStatus}</p>{candidate.screeningResult?.summary && <div className="mt-5 rounded-lg bg-[#f1f3ee] p-4"><p className="text-sm leading-6">{candidate.screeningResult.summary}</p></div>}<div className="mt-5"><p className="text-sm font-semibold">Matched skills</p><p className="mt-2 text-sm text-[#697066]">{candidate.matchedSkills?.join(", ") || "None identified"}</p></div><div className="mt-5"><p className="text-sm font-semibold">Gaps</p><p className="mt-2 text-sm text-[#697066]">{candidate.missingSkills?.join(", ") || "None identified"}</p></div></Card>
    </div>
  </DashboardLayout>
}

export default CandidateDetails
