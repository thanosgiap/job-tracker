import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Application } from "../types"
import { ApplicationInput } from "../lib/validations"

async function fetchApplications(): Promise<Application[]> {
  const res = await fetch("/api/applications")
  if (!res.ok) throw new Error("Failed to fetch applications")
  return res.json()
}

async function createApplication(data: ApplicationInput): Promise<Application> {
  const res = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create application")
  return res.json()
}

async function deleteApplication(id: string): Promise<void> {
  const res = await fetch(`/api/applications/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete application")
}

export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplications,
  })
}

export function useDeleteApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] })
    },
  })
}