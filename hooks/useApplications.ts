import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Application } from "../types"
import { ApplicationInput } from "../lib/validations"

async function fetchApplications(): Promise<Application[]> {
  const res = await fetch("/api/applications")
  if (!res.ok) throw new Error("Failed to fetch applications")
  return res.json()
}

async function deleteApplication(id: string): Promise<void> {
  const res = await fetch(`/api/applications/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete application")
}

async function updateApplication({
  id,
  data,
}: {
  id: string
  data: Partial<ApplicationInput>
}): Promise<Application> {
  const res = await fetch(`/api/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update application")
  return res.json()
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

export function useUpdateApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateApplication,
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["applications"] })
      const previous = queryClient.getQueryData<Application[]>(["applications"])
      queryClient.setQueryData<Application[]>(["applications"], (old) =>
        old?.map((app) => (app.id === id ? { ...app, ...data } : app)) ?? []
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["applications"], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] })
    },
  })
}