"use client"

import { useState } from "react"
import { UserButton } from "@clerk/nextjs"
import { Plus, LayoutGrid, Table, Download } from "lucide-react"
import { Button } from "../../components/ui/button"
import ApplicationDialog from "../../components/applications/ApplicationDialog"
import ApplicationsTable from "../../components/applications/ApplicationsTable"
import KanbanBoard from "../../components/applications/KanbanBoard"
import StatsCards from "../../components/applications/StatsCards"
import ApplicationsChart from "../../components/applications/ApplicationsChart"
import { useApplications } from "../../hooks/useApplications"
import { exportToCsv } from "../../lib/exportCsv"
import { useInactivityTimeout } from "../../hooks/useInactivityTimeout"
import { useAuth } from "@clerk/nextjs"
import ThemeToggle from "../../components/ThemeToggle"

type View = "table" | "kanban"

export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [view, setView] = useState<View>("kanban")
  const { isLoaded, isSignedIn } = useAuth()
  const { data: applications, isLoading, refetch } = useApplications()
  useInactivityTimeout()

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-semibold">Job Tracker</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border p-1">
              <Button
                variant={view === "kanban" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("kanban")}
                className="h-7 px-3"
              >
                <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
                Board
              </Button>
              <Button
                variant={view === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("table")}
                className="h-7 px-3"
              >
                <Table className="mr-1.5 h-3.5 w-3.5" />
                Table
              </Button>
            </div>
            <ThemeToggle />
            <Button
              variant="outline"
              onClick={() => exportToCsv(applications ?? [])}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Application
            </Button>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <p className="text-gray-500">Loading applications...</p>
          </div>
        ) : (
          <>
            <StatsCards applications={applications ?? []} />
            <ApplicationsChart applications={applications ?? []} />
            {view === "kanban" ? (
              <KanbanBoard
                applications={applications ?? []}
                onRefresh={refetch}
              />
            ) : (
              <ApplicationsTable
                applications={applications ?? []}
                onRefresh={refetch}
              />
            )}
          </>
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