export type Status =
  | "APPLIED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN"

export type Application = {
  id: string
  company: string
  role: string
  location?: string | null
  salary?: string | null
  jobUrl?: string | null
  status: Status
  notes?: string | null
  appliedAt: string
  updatedAt: string
  userId: string
}