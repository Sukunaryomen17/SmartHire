import { useEffect, useMemo, useState } from "react"
import API from "../../api"
import Button from "../../components/common/Button"
import Modal from "../../components/common/Modal"
import JobCard from "../../components/admin/JobCard"
import JobDetails from "../../components/admin/JobDetails"
import JobFilters from "../../components/admin/JobFilters"
import JobForm from "../../components/admin/JobForm"
import DashboardLayout from "../../components/layout/DashboardLayout"
import PageHeader from "../../components/layout/PageHeader"

const splitSkills = (value) => Array.isArray(value)
  ? value
  : String(value || "").split(",").map((item) => item.trim()).filter(Boolean)

const toUiJob = (job) => ({
  ...job,
  id: job._id,
  experience: `${job.experienceRequired || 0}+ Years`,
  education: job.educationRequired || "",
  mustHave: (job.mustHave?.length ? job.mustHave : job.requirements || []).join(", "),
  niceToHave: (job.niceToHave || []).join(", "),
  resumeWeight: job.resumeWeight ?? 65,
  qaWeight: job.qaWeight ?? 35,
  threshold: job.threshold ?? 70,
  confidenceCutoff: job.confidenceCutoff ?? 70,
  status: job.status === "open" ? "Active" : job.status === "closed" ? "Archived" : "Draft",
  candidateCount: 0,
  createdAt: job.createdAt ? new Date(job.createdAt).toLocaleDateString("en", { month: "short", day: "2-digit", year: "numeric" }) : "-",
  statistics: { totalCandidates: 0, screening: 0, interviewed: 0, selected: 0 },
})

function JobDescriptions() {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Jobs")
  const [modalMode, setModalMode] = useState(null)
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null
  const visibleJobs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return jobs.filter((job) => {
      const matchesStatus = statusFilter === "All Jobs" || job.status === statusFilter
      const matchesSearch = !normalizedSearch || `${job.title} ${job.location}`.toLowerCase().includes(normalizedSearch)
      return matchesStatus && matchesSearch
    })
  }, [jobs, search, statusFilter])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const response = await API.get("/jobs")
      setJobs((response.data.jobs || []).map(toUiJob))
      setError("")
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load jobs from the backend.")
    } finally { setLoading(false) }
  }

  useEffect(() => { loadJobs() }, [])

  function closeModal() { setModalMode(null); setSelectedJobId(null) }

  async function saveJob(values) {
    const mustHave = splitSkills(values.mustHave)
    const niceToHave = splitSkills(values.niceToHave)
    const payload = {
      title: values.title,
      company: "SmartHire",
      description: `${values.title} role. Required education: ${values.education}. Required skills: ${mustHave.join(", ")}. Nice-to-have skills: ${niceToHave.join(", ")}.`,
      mustHave,
      niceToHave,
      requirements: mustHave,
      skills: [...new Set([...mustHave, ...niceToHave])],
      experience: values.experience,
      education: values.education,
      location: values.location,
      resumeWeight: values.resumeWeight,
      qaWeight: values.qaWeight,
      threshold: values.threshold,
      confidenceCutoff: values.confidenceCutoff,
      status: "open",
    }

    try {
      if (modalMode === "edit" && selectedJob) {
        const response = await API.put(`/jobs/${selectedJob.id}`, payload)
        setJobs((current) => current.map((job) => job.id === selectedJob.id ? toUiJob(response.data.job) : job))
      } else {
        const response = await API.post("/jobs", payload)
        setJobs((current) => [toUiJob(response.data.job), ...current])
      }
      closeModal()
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save the job.")
    }
  }

  async function archiveJob() {
    if (!selectedJob) return
    try {
      const response = await API.patch(`/jobs/${selectedJob.id}/status`, { status: "closed" })
      setJobs((current) => current.map((job) => job.id === selectedJob.id ? toUiJob(response.data.job) : job))
      closeModal()
    } catch (err) { setError(err.response?.data?.message || "Unable to archive the job.") }
  }

  return (
    <DashboardLayout topbarTitle="Job management">
      <PageHeader actions={<Button onClick={() => setModalMode("create")}>+ Create Job</Button>} description="Create and manage job openings and their screening criteria." eyebrow="Job management" title="Job Descriptions" />
      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <JobFilters onSearchChange={setSearch} onStatusChange={setStatusFilter} resultCount={visibleJobs.length} search={search} status={statusFilter} />
      {loading ? (
        <div className="rounded-xl border border-[#e0e4dc] bg-white px-6 py-12 text-center text-sm text-[#697066]">Loading jobs...</div>
      ) : visibleJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {visibleJobs.map((job) => <JobCard key={job.id} job={job} onArchive={(selected) => { setSelectedJobId(selected.id); setModalMode("archive") }} onEdit={(selected) => { setSelectedJobId(selected.id); setModalMode("edit") }} onView={(selected) => { setSelectedJobId(selected.id); setModalMode("view") }} />)}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#bdc5b8] bg-[#fafbf8]/60 px-6 py-12 text-center"><p className="font-medium text-[#434a40]">No jobs match these filters</p><p className="mt-2 text-sm text-[#838a7f]">Create a job to make it available to candidates.</p></div>
      )}
      <Modal description={modalMode === "create" ? "Add the role details and screening criteria." : modalMode === "edit" ? "Update role details and screening criteria." : undefined} footer={modalMode === "view" ? <div className="flex justify-end"><Button onClick={closeModal} variant="ghost">Close</Button></div> : undefined} onClose={closeModal} open={Boolean(modalMode)} size={modalMode === "create" || modalMode === "edit" ? "xl" : modalMode === "view" ? "lg" : "sm"} title={modalMode === "create" ? "Create Job" : modalMode === "edit" ? "Edit Job" : modalMode === "view" ? selectedJob?.title : "Archive this job?"}>
        {(modalMode === "create" || modalMode === "edit") && <JobForm job={modalMode === "edit" ? selectedJob : null} onCancel={closeModal} onSave={saveJob} />}
        {modalMode === "view" && selectedJob && <JobDetails job={selectedJob} />}
        {modalMode === "archive" && selectedJob && <><p className="text-sm leading-6 text-[#697066]">Closed jobs will no longer be available for new candidate applications.</p><div className="mt-6 flex flex-col-reverse justify-end gap-2 sm:flex-row"><Button onClick={closeModal} variant="ghost">Cancel</Button><Button onClick={archiveJob} variant="danger">Close Job</Button></div></>}
      </Modal>
    </DashboardLayout>
  )
}

export default JobDescriptions
