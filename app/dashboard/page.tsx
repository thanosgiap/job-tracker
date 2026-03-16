"use client"

import { useState } from "react"
import { UserButton } from "@clerk/nextjs"
import { Plus } from "lucide-react"
import { Button } from "../../components/ui/button"
import ApplicationDialog from "../../components/applications/ApplicationDialog"
import ApplicationsTable from "../../components/applications/ApplicationsTable"
import { useApplications } from "../../hooks/useApplications"

export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: applications, isLoading, refetch } = useApplications()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-semibold">Job Tracker</h1>
          <div className="flex items-center gap-4">
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Application
            </Button>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <p className="text-gray-500">Loading applications...</p>
          </div>
        ) : (
          <ApplicationsTable
            applications={applications ?? []}
            onRefresh={refetch}
          />
        )}
      </main>

      <ApplicationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={refetch}
      />
    </div>
  )
}