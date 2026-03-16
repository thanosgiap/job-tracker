"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ApplicationSchema, ApplicationInput } from "../../lib/validations"
import { Application } from "../../types"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

type Props = {
  application?: Application
  onSubmit: (data: ApplicationInput) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function ApplicationForm({
  application,
  onSubmit,
  onCancel,
  isLoading,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ApplicationInput>({
    resolver: zodResolver(ApplicationSchema),
    defaultValues: {
      company: application?.company ?? "",
      role: application?.role ?? "",
      location: application?.location ?? "",
      salary: application?.salary ?? "",
      jobUrl: application?.jobUrl ?? "",
      status: application?.status ?? "APPLIED",
      notes: application?.notes ?? "",
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company">Company *</Label>
        <Input id="company" {...register("company")} placeholder="e.g. Google" />
        {errors.company && (
          <p className="text-sm text-red-500">{errors.company.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="role">Role *</Label>
        <Input id="role" {...register("role")} placeholder="e.g. Software Engineer" />
        {errors.role && (
          <p className="text-sm text-red-500">{errors.role.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} placeholder="e.g. Remote" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="salary">Salary</Label>
          <Input id="salary" {...register("salary")} placeholder="e.g. €45,000" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="jobUrl">Job URL</Label>
        <Input
          id="jobUrl"
          {...register("jobUrl")}
          placeholder="https://linkedin.com/jobs/..."
        />
        {errors.jobUrl && (
          <p className="text-sm text-red-500">{errors.jobUrl.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="status">Status *</Label>
        <Select
          defaultValue={application?.status ?? "APPLIED"}
          onValueChange={(value) =>
            setValue("status", value as ApplicationInput["status"])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="APPLIED">Applied</SelectItem>
            <SelectItem value="INTERVIEW">Interview</SelectItem>
            <SelectItem value="OFFER">Offer</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Any notes about this application..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : application ? "Update" : "Add Application"}
        </Button>
      </div>
    </form>
  )
}