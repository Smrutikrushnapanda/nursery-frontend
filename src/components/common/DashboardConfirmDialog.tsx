"use client";

import { Button } from "@/components/ui/button";
import { DashboardDialog } from "./DashboardDialog";

type DashboardConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmClassName?: string;
};

export function DashboardConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmClassName = "rounded-xl bg-red-600 hover:bg-red-700",
}: DashboardConfirmDialogProps) {
  return (
    <DashboardDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      className="mx-4 max-w-md p-6 sm:p-8"
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button type="button" className={confirmClassName} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <></>
    </DashboardDialog>
  );
}
