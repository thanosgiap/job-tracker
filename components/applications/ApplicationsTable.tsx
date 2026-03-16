"use client"

import { useState } from "react"
import { Pencil, Trash2, ExternalLink } from "lucide-react"
import { Application } from "../../types"
import StatusBadge from "./StatusBadge"
import ApplicationDialog from "./ApplicationDialog"
import { useDeleteApplication } from "../../hooks/useApplications"
import { Button } from "../ui/button"

type Props = {
    applications: Application[]
    onRefresh: () => void
}

export default function ApplicationsTable({ applications, onRefresh }: Props) {
    const [editingApp, setEditingApp] = useState<Application | null>(null)
    const { mutate: deleteApp } = useDeleteApplication()

    function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this application?")) {
            deleteApp(id)
        }
    }

    if (applications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-lg font-medium text-gray-900">No applications yet</p>
                <p className="mt-1 text-sm text-gray-500">
                    Add your first job application to get started
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        <tr>
                            <th className="px-4 py-3">Company</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Location</th>
                            <th className="px-4 py-3">Salary</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Applied</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {applications.map((app) => (
                            <tr key={app.id} className="bg-white hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{app.company}</td>
                                <td className="px-4 py-3">{app.role}</td>
                                <td className="px-4 py-3 text-gray-500">
                                    {app.location ?? "—"}
                                </td>
                                <td className="px-4 py-3 text-gray-500">
                                    {app.salary ?? "—"}
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={app.status} />
                                </td>
                                <td className="px-4 py-3 text-gray-500">
                                    {new Date(app.appliedAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {app.jobUrl && (

                                            <a
                                                href={app.jobUrl}
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
                                            onClick={() => setEditingApp(app)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(app.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >

            {editingApp && (
                <ApplicationDialog
                    open={!!editingApp}
                    onClose={() => setEditingApp(null)}
                    application={editingApp}
                    onSuccess={onRefresh}
                />
            )
            }
        </>
    )
}