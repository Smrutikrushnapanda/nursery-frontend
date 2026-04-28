"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Badge from "@/components/ui/badge/Badge"

import { invoiceApis } from "@/utils/api/api"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export type OrderItem = {
  id: number
  organizationId: string
  customerName: string
  customerPhone: string
  status: string
  totalAmount: string
  discount: string
  discountType: string
  createdAt: string
  updatedAt: string
  items: any[]
  payment: {
    id: number
    orderId: number
    organizationId: string
    method: string
    status: string
    amount: string
    referenceNumber: string
    notes: string
    invoiceUrl: string | null
    createdAt: string
    updatedAt: string
  } | null
}

const OrderActions = ({ orderId, hasInvoice }: { orderId: number, hasInvoice: boolean }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await invoiceApis.download(orderId);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download invoice. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex justify-start">
      <Button
        variant="outline"
        size="sm"
        disabled={!hasInvoice || isDownloading}
        className="flex items-center gap-2 border-brand-200 text-brand-600 hover:bg-brand-50 dark:border-brand-800 dark:text-brand-400 dark:hover:bg-brand-900/20 shadow-sm transition-all active:scale-95 disabled:opacity-50"
        onClick={handleDownload}
      >
        {isDownloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span>{isDownloading ? "Downloading..." : "Invoice"}</span>
      </Button>
    </div>
  );
};

export function getOrderColumns(): ColumnDef<OrderItem>[] {
  return [
    {
      id: "slNo",
      header: "Sl No",
      cell: ({ row }) => (
        <span className="text-gray-500 font-medium">{row.index + 1}</span>
      ),
      size: 50,
    },
    {
      accessorKey: "id",
      header: "Order #",
      cell: ({ row }) => (
        <span className="font-semibold text-gray-800 dark:text-white/90">
          #{row.original.id}
        </span>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {row.original.customerName || "Walk-in Customer"}
          </span>
          {row.original.customerPhone && (
            <span className="text-xs text-gray-500">{row.original.customerPhone}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-gray-600 dark:text-gray-400">
          {new Date(row.original.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </span>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-bold text-brand-600 dark:text-brand-400">
          ₹ {Number(row.original.totalAmount).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          size="sm"
          color={
            row.original.status === "CONFIRMED" || row.original.status === "COMPLETED" ? "success" :
              row.original.status === "PENDING" ? "warning" : "error"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <OrderActions
          orderId={row.original.id}
          hasInvoice={!!row.original.payment}
        />
      ),
    },
  ]
}
