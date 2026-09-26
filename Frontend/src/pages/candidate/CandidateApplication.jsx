import { useEffect, useState } from "react"
import API from "../../api"
import Card from "../../components/common/Card"
import CandidateSidebar from "../../components/layout/CandidateSidebar"
import PageHeader from "../../components/layout/PageHeader"
import Topbar from "../../components/layout/Topbar"

const initialForm = {
  name: "", email: "", phone: "", location: "", education: "",
  experienceYears: "", skills: "", projects: "", profileSummary: "",
}

function CandidateApplication() {
  const [jobs, setJobs] = useState([])
  const [jobId, setJobId] = useState("")
  const [form, setForm] = useState(initialForm)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await API.get("/jobs")
        setJobs((response.data.jobs || []).filter((job) => job.status === "open"))
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load available jobs.")
      } finally { setLoadingJobs(false) }
    }
    loadJobs()
  }, [])

  const selectedJob = jobs.find((job) => job._id === jobId)

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!jobId) return setError("Please select a job.")
    setSubmitting(true); setError(""); setResult(null)
    try {
      const response = await API.post("/candidates", {
        ...form,
        experienceYears: Number(form.experienceYears) || 0,
        skills: form.skills.split(",").map((item) => item.trim()).filter(Boolean),
        projects: form.projects.split("\n").map((item) => item.trim()).filter(Boolean),
        appliedJobId: jobId,
      })
      setResult(response.data.candidate)
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit the application.")
    } finally { setSubmitting(false) }
  }

  return (
    <div className="dashboard-canvas flex min-h-screen flex-col text-[#292d28] lg:flex-row">
      <CandidateSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title="My application" topbarContent={<span className="ml-2 border-l border-[#d6dcd2] pl-4 text-sm text-[#697066]">Candidate portal</span>} />
        <main className="min-w-0 flex-1 p-5 sm:p-6 lg:p-8">
          <PageHeader eyebrow="Candidate portal" title="My Application" description="Select a job and complete your candidate profile. The profile will be screened against the selected job description." />

          {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          {result ? (
            <Card className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#737d68]">Application submitted</p>
              <h2 className="mt-2 text-2xl font-semibold">{result.name}</h2>
              <p className="mt-2 text-sm text-[#697066]">Applied for {result.appliedJobId?.title || selectedJob?.title || "the selected role"}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-[#dfe4db] bg-[#f8f9f6] p-4"><p className="text-xs text-[#838a7f]">Screening score</p><p className="mt-1 text-2xl font-semibold">{result.resumeScore ?? "Pending"}{result.resumeScore !== null ? "/100" : ""}</p></div>
                <div className="rounded-lg border border-[#dfe4db] bg-[#f8f9f6] p-4"><p className="text-xs text-[#838a7f]">Status</p><p className="mt-1 text-lg font-semibold capitalize">{result.screeningStatus}</p></div>
                <div className="rounded-lg border border-[#dfe4db] bg-[#f8f9f6] p-4"><p className="text-xs text-[#838a7f]">Matched skills</p><p className="mt-1 text-lg font-semibold">{result.matchedSkills?.length || 0}</p></div>
              </div>
              {result.screeningResult?.summary && <div className="mt-6 rounded-lg border border-[#dfe4db] bg-[#f8f9f6] p-4"><p className="text-sm font-semibold">AI screening summary</p><p className="mt-2 text-sm leading-6 text-[#697066]">{result.screeningResult.summary}</p></div>}
              {result.missingSkills?.length > 0 && <div className="mt-4"><p className="text-sm font-semibold">Gaps identified</p><div className="mt-2 flex flex-wrap gap-2">{result.missingSkills.map((skill) => <span key={skill} className="rounded-md border border-[#e0e4dc] bg-[#f1f3ee] px-2.5 py-1.5 text-xs">{skill}</span>)}</div></div>}
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-6">
              <Card className="p-5 sm:p-6">
                <h2 className="text-lg font-semibold">Select Job Description</h2>
                <p className="mt-1 text-sm text-[#697066]">Choose an active job created by the admin.</p>
                <select required value={jobId} onChange={(event) => setJobId(event.target.value)} disabled={loadingJobs} className="mt-4 min-h-11 w-full rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 text-sm text-[#434a40]">
                  <option value="">{loadingJobs ? "Loading jobs..." : "Select a job"}</option>
                  {jobs.map((job) => <option key={job._id} value={job._id}>{job.title} — {job.location || "Location not specified"}</option>)}
                </select>
                {selectedJob && <div className="mt-5 rounded-xl border border-[#dfe4db] bg-[#f8f9f6] p-4"><h3 className="font-semibold">{selectedJob.title}</h3><p className="mt-1 text-sm text-[#697066]">{selectedJob.location || "Location not specified"} · {selectedJob.experienceRequired || 0}+ years · {selectedJob.educationRequired || "Education not specified"}</p><div className="mt-3 flex flex-wrap gap-2">{(selectedJob.mustHave?.length ? selectedJob.mustHave : selectedJob.requirements || []).map((skill) => <span key={skill} className="rounded-md border border-[#d0d7c8] bg-[#edf1e8] px-2.5 py-1.5 text-xs text-[#526046]">{skill}</span>)}</div></div>}
              </Card>

              <Card className="p-5 sm:p-6">
                <h2 className="text-lg font-semibold">Candidate Details</h2>
                <p className="mt-1 text-sm text-[#697066]">These details form the profile that the AI screening service compares with the selected job.</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {[["name","Full name","text",true],["email","Email","email",true],["phone","Phone","tel",false],["location","Current location","text",false],["education","Education","text",true],["experienceYears","Years of experience","number",true]].map(([field,label,type,required]) => <label key={field} className="grid gap-2 text-sm font-medium"><span>{label}</span><input required={required} min={type === "number" ? "0" : undefined} step={type === "number" ? "0.1" : undefined} type={type} value={form[field]} onChange={update(field)} className="min-h-11 rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 font-normal outline-none focus:border-[#879276]" /></label>)}
                </div>
                <div className="mt-4 grid gap-4">
                  <label className="grid gap-2 text-sm font-medium">Skills<input required value={form.skills} onChange={update("skills")} placeholder="React, JavaScript, SQL" className="min-h-11 rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 font-normal outline-none focus:border-[#879276]" /><span className="text-xs font-normal text-[#838a7f]">Separate skills with commas.</span></label>
                  <label className="grid gap-2 text-sm font-medium">Projects<textarea rows="4" value={form.projects} onChange={update("projects")} placeholder="One project per line" className="rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 font-normal outline-none focus:border-[#879276]" /></label>
                  <label className="grid gap-2 text-sm font-medium">Profile summary<textarea required rows="5" value={form.profileSummary} onChange={update("profileSummary")} placeholder="Briefly describe your technical background and relevant experience." className="rounded-lg border border-[#cbd1c7] bg-[#fffefa] px-3.5 py-2.5 font-normal outline-none focus:border-[#879276]" /></label>
                </div>
              </Card>

              <div className="flex justify-end"><button disabled={submitting || !jobId} className="rounded-lg bg-[#59684c] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Screening application..." : "Submit Application"}</button></div>
            </form>
          )}
        </main>
      </div>
    </div>
  )
}

export default CandidateApplication
