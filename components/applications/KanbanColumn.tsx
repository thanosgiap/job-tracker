"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Application, Status } from "../../types"
import KanbanCard from "./KanbanCard"

type Props = {
  status: Status
  label: string
  color: string
  applications: Application[]
  onEdit: (app: Application) => void
  onDelete: (id: string) => void
}

export default function KanbanColumn({
  status,
  label,
  color,
  applications,
  onEdit,
  onDelete,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex flex-col gap-3 min-w-[260px] w-[260px] snap-start">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <h3 className="font-medium text-sm">{label}</h3>
        <span className="ml-auto text-xs text-gray-400 font-medium">
          {applications.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 min-h-[200px] rounded-xl p-2 transition-colors ${
          isOver ? "bg-blue-50" : "bg-gray-100"
        }`}
      >
        <SortableContext
          items={applications.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((app) => (
            <KanbanCard
              key={app.id}
              application={app}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-8">
            <p className="text-xs text-gray-400">Drop here</p>
          </div>
        )}
      </div>
    </div>
  )
}