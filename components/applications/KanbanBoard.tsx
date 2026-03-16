"use client"

import { useState } from "react"
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import { Application, Status } from "../../types"
import { useDeleteApplication, useUpdateApplication } from "../../hooks/useApplications"
import ApplicationDialog from "./ApplicationDialog"
import KanbanColumn from "./KanbanColumn"
import KanbanCard from "./KanbanCard"

const COLUMNS: { status: Status; label: string; color: string }[] = [
    { status: "APPLIED", label: "Applied", color: "bg-blue-400" },
    { status: "INTERVIEW", label: "Interview", color: "bg-yellow-400" },
    { status: "OFFER", label: "Offer", color: "bg-green-400" },
    { status: "REJECTED", label: "Rejected", color: "bg-red-400" },
    { status: "WITHDRAWN", label: "Withdrawn", color: "bg-gray-400" },
]

type Props = {
    applications: Application[]
    onRefresh: () => void
}

export default function KanbanBoard({ applications, onRefresh }: Props) {
    const [activeApp, setActiveApp] = useState<Application | null>(null)
    const [editingApp, setEditingApp] = useState<Application | null>(null)
    const { mutate: deleteApp } = useDeleteApplication()
    const { mutate: updateApp } = useUpdateApplication()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    )

    function handleDragStart(event: DragStartEvent) {
        const app = applications.find((a) => a.id === event.active.id)
        if (app) setActiveApp(app)
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        setActiveApp(null)

        if (!over) return

        const draggedApp = applications.find((a) => a.id === active.id)
        if (!draggedApp) return

        const newStatus = over.id as Status

        if (!COLUMNS.find((c) => c.status === newStatus)) return
        if (draggedApp.status === newStatus) return

        updateApp({
            id: draggedApp.id,
            data: {
                status: newStatus,
            },
        })
    }

    function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this application?")) {
            deleteApp(id)
        }
    }

    return (
        <>
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {COLUMNS.map((col) => (
                        <KanbanColumn
                            key={col.status}
                            status={col.status}
                            label={col.label}
                            color={col.color}
                            applications={applications.filter(
                                (a) => a.status === col.status
                            )}
                            onEdit={setEditingApp}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeApp && (
                        <KanbanCard
                            application={activeApp}
                            onEdit={setEditingApp}
                            onDelete={handleDelete}
                        />
                    )}
                </DragOverlay>
            </DndContext>

            {editingApp && (
                <ApplicationDialog
                    open={!!editingApp}
                    onClose={() => setEditingApp(null)}
                    application={editingApp}
                    onSuccess={() => {
                        onRefresh()
                        setEditingApp(null)
                    }}
                />
            )}
        </>
    )
}