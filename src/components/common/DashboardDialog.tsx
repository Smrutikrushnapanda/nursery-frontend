"use client";

import { ReactNode } from "react";
import { Modal } from "@/components/ui/modal";

type DashboardDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  closeOnOutsideClick?: boolean;
  closeOnEsc?: boolean;
};

export function DashboardDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className = "mx-4 max-w-2xl p-6 sm:p-8",
  closeOnOutsideClick = false,
  closeOnEsc = false,
}: DashboardDialogProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className={className}
      closeOnOutsideClick={closeOnOutsideClick}
      closeOnEsc={closeOnEsc}
    >
      <div className="space-y-5">
        <div className="pr-12">
          <h2 className="text-2xl font-bold text-brand-800">{title}</h2>
          {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
        </div>
        <div>{children}</div>
        {footer ? <div>{footer}</div> : null}
      </div>
    </Modal>
  );
}
