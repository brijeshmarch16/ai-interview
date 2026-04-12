"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteInterview } from "@/actions/interviews";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteInterviewDialogProps {
  open: boolean;
  onClose: () => void;
  interviewId: string;
  interviewName: string;
  onDeleted: () => void;
}

export default function DeleteInterviewDialog(props: DeleteInterviewDialogProps) {
  const { open, onClose, interviewId, interviewName, onDeleted } = props;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteInterview(interviewId);
    setIsDeleting(false);

    if (result.success) {
      onDeleted();
    } else {
      toast.error("Failed to delete interview. Please try again.");
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Interview</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{interviewName}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} onClick={onClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={isDeleting} onClick={handleDelete}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
