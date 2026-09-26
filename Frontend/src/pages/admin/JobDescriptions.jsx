import { useMemo, useState } from "react"
import Button from "../../components/common/Button"
import Modal from "../../components/common/Modal"
import JobCard from "../../components/admin/JobCard"
import JobDetails from "../../components/admin/JobDetails"
import JobFilters from "../../components/admin/JobFilters"
import JobForm from "../../components/admin/JobForm"
import DashboardLayout from "../../components/layout/DashboardLayout"
import PageHeader from "../../components/layout/PageHeader"

const initialJobs = [
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    location: "Mumbai",
    experience: "2+ Years",
    education: "Bachelor's degree or equivalent",
    mustHave: "React, JavaScript, CSS",
    niceToHave: "TypeScript, accessibility",
    resumeWeight: 65,
    qaWeight: 35,
    threshold: 70,
    confidenceCutoff: 70,
    candidateCount: 14,
    status: "Active",
    createdAt: "Sep 18, 2026",
    statistics: { totalCandidates: 14, screening: 6, interviewed: 4, selected: 2 },
  },
  {
    id: "java-backend-developer",
    title: "Java Backend Developer",
    location: "Bengaluru",
    experience: "3+ Years",
    education: "Bachelor's degree in Computer Science",
    mustHave: "Java, Spring Boot, SQL",
    niceToHave: "Microservices, Docker",
    resumeWeight: 60,
    qaWeight: 40,
    threshold: 72,
    confidenceCutoff: 70,
    candidateCount: 21,
    status: "Active",
    createdAt: "Sep 12, 2026",
    statistics: { totalCandidates: 21, screening: 8, interviewed: 6, selected: 3 },
  },
  {
    id: "python-developer",
    title: "Python Developer",
    location: "Pune",
    experience: "2+ Years",
    education: "Bachelor's degree or equivalent",
    mustHave: "Python, REST APIs, PostgreSQL",
    niceToHave: "FastAPI, cloud platforms",
    resumeWeight: 65,
    qaWeight: 35,
    threshold: 70,
    confidenceCutoff: 70,
    candidateCount: 13,
    status: "Active",
    createdAt: "Sep 08, 2026",
    statistics: { totalCandidates: 13, screening: 5, interviewed: 3, selected: 1 },
  },
]

function JobDescriptions() {
  const [jobs, setJobs] = useState(initialJobs)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Jobs")
  const [modalMode, setModalMode] = useState(null)
  const [selectedJobId, setSelectedJobId] = useState(null)

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null
  const visibleJobs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return jobs.filter((job) => {
      const matchesStatus = statusFilter === "All Jobs" || job.status === statusFilter
      const matchesSearch = !normalizedSearch || `${job.title} ${job.location}`.toLowerCase().includes(normalizedSearch)
      return matchesStatus && matchesSearch
    })
  }, [jobs, search, statusFilter])

  function closeModal() {
    setModalMode(null)
    setSelectedJobId(null)
  }

  function saveJob(values) {
    if (modalMode === "edit" && selectedJob) {
      setJobs((currentJobs) => currentJobs.map((job) => (
        job.id === selectedJob.id ? { ...job, ...values } : job
      )))
    } else {
      const createdAt = new Intl.DateTimeFormat("en", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(new Date())

      setJobs((currentJobs) => [
        {
          ...values,
          id: `job-${Date.now()}`,
          candidateCount: 0,
          status: "Active",
          createdAt,
          statistics: { totalCandidates: 0, screening: 0, interviewed: 0, selected: 0 },
        },
        ...currentJobs,
      ])
    }
    closeModal()
  }

  function archiveJob() {
    if (!selectedJob) return
    setJobs((currentJobs) => currentJobs.map((job) => (
      job.id === selectedJob.id ? { ...job, status: "Archived" } : job
    )))
    closeModal()
  }

  return (
    <DashboardLayout topbarTitle="Job management">
      <PageHeader
        actions={<Button onClick={() => setModalMode("create")}>+ Create Job</Button>}
        description="Create and manage job openings and their screening criteria."
        eyebrow="Job management"
        title="Job Descriptions"
      />

      <JobFilters
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        resultCount={visibleJobs.length}
        search={search}
        status={statusFilter}
      />

      {visibleJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {visibleJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onArchive={(selected) => { setSelectedJobId(selected.id); setModalMode("archive") }}
              onEdit={(selected) => { setSelectedJobId(selected.id); setModalMode("edit") }}
              onView={(selected) => { setSelectedJobId(selected.id); setModalMode("view") }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#bdc5b8] bg-[#fafbf8]/60 px-6 py-12 text-center">
          <p className="font-medium text-[#434a40]">No jobs match these filters</p>
          <p className="mt-2 text-sm text-[#838a7f]">Try another search or status filter.</p>
        </div>
      )}

      <Modal
        description={modalMode === "create" ? "Add the role details and screening criteria." : modalMode === "edit" ? "Update role details and screening criteria." : undefined}
        footer={modalMode === "view" ? <div className="flex justify-end"><Button onClick={closeModal} variant="ghost">Close</Button></div> : undefined}
        onClose={closeModal}
        open={Boolean(modalMode)}
        size={modalMode === "create" || modalMode === "edit" ? "xl" : modalMode === "view" ? "lg" : "sm"}
        title={modalMode === "create" ? "Create Job" : modalMode === "edit" ? "Edit Job" : modalMode === "view" ? selectedJob?.title : "Archive this job?"}
      >
        {(modalMode === "create" || modalMode === "edit") && (
          <JobForm job={modalMode === "edit" ? selectedJob : null} onCancel={closeModal} onSave={saveJob} />
        )}
        {modalMode === "view" && selectedJob && <JobDetails job={selectedJob} />}
        {modalMode === "archive" && selectedJob && (
          <>
            <p className="text-sm leading-6 text-[#697066]">
              Archived jobs will no longer appear as active openings. You can still find them with the Archived filter.
            </p>
            <div className="mt-6 flex flex-col-reverse justify-end gap-2 sm:flex-row">
              <Button onClick={closeModal} variant="ghost">Cancel</Button>
              <Button onClick={archiveJob} variant="danger">Archive</Button>
            </div>
          </>
        )}
      </Modal>
    </DashboardLayout>
  )
}

export default JobDescriptions