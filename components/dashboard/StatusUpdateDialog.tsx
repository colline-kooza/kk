"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useUpdateApplicationStatus } from "@/hooks/use-school-applications"
import { SchoolApplication } from "@/types/school-application-detailed"

interface StatusUpdateDialogProps {
  application: SchoolApplication
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StatusUpdateDialog({ application, open, onOpenChange }: StatusUpdateDialogProps) {
  const [status, setStatus] = useState<"APPROVED" | "REJECTED" | "">("")
  const [rejectionReason, setRejectionReason] = useState("")

  const updateStatusMutation = useUpdateApplicationStatus()

  const handleSubmit = async () => {
    if (!status) return

    try {
      await updateStatusMutation.mutateAsync({
        applicationId: application.id,
        status,
        rejectionReason: status === "REJECTED" ? rejectionReason : undefined,
      })
      onOpenChange(false)
      setStatus("")
      setRejectionReason("")
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Application Status</DialogTitle>
          <DialogDescription>
            Update the status for {application.applicantName}'s application to {application.schoolName}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: "APPROVED" | "REJECTED") => setStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {status === "REJECTED" && (
            <div className="grid gap-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!status || updateStatusMutation.isPending}>
            {updateStatusMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
