import Button from "../common/Button"
import Input from "../common/Input"

const emptyJob = {
  title: "",
  location: "",
  experience: "",
  education: "",
  mustHave: "",
  niceToHave: "",
  resumeWeight: 65,
  qaWeight: 35,
  threshold: 70,
  confidenceCutoff: 70,
}

function JobForm({ job, onSave, onCancel }) {
  const values = job ?? emptyJob

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    onSave({
      title: String(formData.get("title")).trim(),
      location: String(formData.get("location")).trim(),
      experience: String(formData.get("experience")).trim(),
      education: String(formData.get("education")).trim(),
      mustHave: String(formData.get("mustHave")).trim(),
      niceToHave: String(formData.get("niceToHave")).trim(),
      resumeWeight: Number(formData.get("resumeWeight")),
      qaWeight: Number(formData.get("qaWeight")),
      threshold: Number(formData.get("threshold")),
      confidenceCutoff: Number(formData.get("confidenceCutoff")),
    })
  }

  return (
    <form id="job-form" className="grid gap-5" onSubmit={handleSubmit}>
      <fieldset className="grid gap-4">
        <legend className="mb-3 text-sm font-semibold text-[#59684c]">Basic Information</legend>
        <Input autoFocus label="Job Title" name="title" placeholder="e.g. Product Designer" required defaultValue={values.title} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Location" name="location" placeholder="City or remote" required defaultValue={values.location} />
          <Input label="Minimum Experience" name="experience" placeholder="e.g. 2+ Years" required defaultValue={values.experience} />
        </div>
        <Input label="Education" name="education" placeholder="e.g. Bachelor's degree or equivalent" required defaultValue={values.education} />
      </fieldset>

      <fieldset className="grid gap-4 border-t border-[#e1e5dd] pt-5">
        <legend className="mb-3 text-sm font-semibold text-[#59684c]">Required Skills</legend>
        <Input hint="Separate skills with commas." label="Must-have skills" name="mustHave" placeholder="React, JavaScript, CSS" required defaultValue={values.mustHave} />
        <Input hint="Separate skills with commas." label="Nice-to-have skills" name="niceToHave" placeholder="TypeScript, accessibility" defaultValue={values.niceToHave} />
      </fieldset>

      <fieldset className="grid gap-4 border-t border-[#e1e5dd] pt-5">
        <legend className="mb-3 text-sm font-semibold text-[#59684c]">Scoring Configuration</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Resume weight (%)" name="resumeWeight" type="number" min="0" max="100" required defaultValue={values.resumeWeight} />
          <Input label="Screening / Q&A weight (%)" name="qaWeight" type="number" min="0" max="100" required defaultValue={values.qaWeight} />
          <Input label="Pass threshold (%)" name="threshold" type="number" min="0" max="100" required defaultValue={values.threshold} />
          <Input label="Confidence cutoff (%)" name="confidenceCutoff" type="number" min="0" max="100" required defaultValue={values.confidenceCutoff} />
        </div>
      </fieldset>

      <div className="flex flex-col-reverse justify-end gap-2 border-t border-[#e1e5dd] pt-4 sm:flex-row">
        <Button onClick={onCancel} type="button" variant="ghost">Cancel</Button>
        <Button type="submit">{job ? "Save Changes" : "Create Job"}</Button>
      </div>
    </form>
  )
}

export default JobForm