"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export type QrCodeItem = {
  id: number
  code: string
  plantId: number
  organizationId: string
  qrImageBase64: string
  createdAt: string
  plant: {
    id: number
    name: string
    scientificName?: string | null
  }
}

export function getQrColumns({
  onView,
  onDownload,
}: {
  onView?: (row: QrCodeItem) => void
  onDownload?: (row: QrCodeItem) => void
}): ColumnDef<QrCodeItem>[] {
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
      header: "ID",
      cell: ({ row }) => <span className="text-gray-500">#{row.original.id}</span>,
    },
    {
      accessorKey: "plant.name",
      header: "Plant Name",
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <p className="font-medium text-gray-800">{row.original.plant?.name ?? "-"}</p>
          <p className="text-xs text-gray-500 italic">{row.original.plant?.scientificName ?? "-"}</p>
        </div>
      ),
    },
    {
      accessorKey: "code",
      header: "QR Code",
      cell: ({ row }) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
          {row.original.code}
        </code>
      ),
    },
    {
      accessorKey: "qrImageBase64",
      header: "Preview",
      cell: ({ row }) => (
        <div className="size-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden border border-gray-200">
           <img 
             src={`data:image/png;base64,${row.original.qrImageBase64}`} 
             alt="QR Preview" 
             className="size-8 object-contain"
           />
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Generated At",
      cell: ({ row }) => (
        <span className="text-gray-500 text-sm">
          {new Date(row.original.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={() => onView?.(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 text-blue-600 hover:text-blue-700"
            onClick={() => onDownload?.(row.original)}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]
}
