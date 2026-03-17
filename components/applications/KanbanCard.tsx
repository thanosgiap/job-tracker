"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Pencil, Trash2, ExternalLink } from "lucide-react"
import { Application } from "../../types"
import { Button } from "../ui/button"

type Props = {
    application: Application
    onEdit: (app: Application) => void
    onDelete: (id: string) => void
}

export default function KanbanCard({ application, onEdit, onDelete }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: application.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="rounded-lg border bg-card text-card-foreground p-3 shadow-sm cursor-grab active:cursor-grabbing"
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{application.company}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                        {application.role}
                    </p>
                    {application.location && (
                        <p className="text-xs text-gray-400 mt-1">{application.location}</p>
                    )}
                    {application.salary && (
                        <p className="text-xs text-gray-400">{application.salary}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t">
                <p className="text-xs text-gray-400">
                    {new Date(application.appliedAt).toLocaleDateString()}
                </p>
                <div
                    className="flex items-center gap-1"
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    {application.jobUrl && (

                        <a
                            href={application.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="ghost" size="icon">
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </a>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onEdit(application)}
                    >
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onDelete(application.id)}
                    >
                        <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                </div>
            </div>
        </div >
    )
}