import { Status } from "../../types"

const statusConfig: Record<Status, { label: string; className: string }> = {
  APPLIED: {
    label: "Applied",
    className: "bg-blue-100 text-blue-800",
  },
  INTERVIEW: {
    label: "Interview",
    className: "bg-yellow-100 text-yellow-800",
  },
  OFFER: {
    label: "Offer",
    className: "bg-green-100 text-green-800",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-800",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    className: "bg-gray-100 text-gray-800",
  },
}

export default function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}