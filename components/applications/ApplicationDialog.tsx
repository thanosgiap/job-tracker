"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import ApplicationForm from "./ApplicationForm"
import { ApplicationInput } from "../../lib/validations"
import { Application } from "../../types"

type Props = {
  open: boolean
  onClose: () => void
  application?: Application
  onSuccess: () => void
}

export default function ApplicationDialog({
  open,
  onClose,
  application,
  onSuccess,
}: Props) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(data: ApplicationInput) {
    setIsLoading(true)
    try {
      const url = application
        ? `/api/applications/${application.id}`
        : "/api/applications"

      const method = application ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to save application")

      onSuccess()
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {application ? "Edit Application" : "Add Application"}
          </DialogTitle>
        </DialogHeader>
        <ApplicationForm
          application={application}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}