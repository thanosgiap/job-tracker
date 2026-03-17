import { Application } from "../types"

export function exportToCsv(applications: Application[]) {
  const headers = [
    "Company",
    "Role",
    "Location",
    "Salary",
    "Status",
    "Applied Date",
    "Job URL",
    "Notes",
  ]

  const rows = applications.map((app) => [
    app.company,
    app.role,
    app.location ?? "",
    app.salary ?? "",
    app.status,
    new Date(app.appliedAt).toLocaleDateString(),
    app.jobUrl ?? "",
    app.notes ?? "",
  ])

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n")

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `job-applications-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}