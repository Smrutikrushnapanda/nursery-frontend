"use client"

import { ColumnDef } from "@tanstack/react-table"
import { QrCode, Download, Loader2 } from "lucide-react"
import { useState } from "react"
import Badge from "@/components/ui/badge/Badge"
import { Button } from "@/components/ui/button"
import { getStockStatus, InventoryItem } from "./inventoryColumns"
import { qrApis } from "@/utils/api/api"

type PrintQrActionsProps = {
  row: InventoryItem
  onGenerated?: (variantId: number, qrBase64: string) => void
  existingQr?: string
}

function PrintQrActions({ row, onGenerated, existingQr }: PrintQrActionsProps) {
  const [generating, setGenerating] = useState(false)
  const [qrData, setQrData] = useState<string | null>(existingQr || null)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const response = await qrApis.generateQrCode(row.variantId)
      if (response.success) {
        const base64 = response.data.qrImageBase64
        setQrData(base64)
        onGenerated?.(row.variantId, base64)
      }
    } catch (error: any) {
      console.error(error)
      alert(error?.message || "Failed to generate QR code")
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!qrData) return

    const link = document.createElement("a")
    link.href = `data:image/png;base64,${qrData}`
    link.download = `qr-${row.variant.sku || row.variantId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (qrData) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-2 border-brand-200 text-brand-600 hover:bg-brand-50"
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
        Download QR
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      className="flex items-center gap-2"
      onClick={handleGenerate}
      disabled={generating}
    >
      {generating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <QrCode className="h-4 w-4" />
      )}
      {generating ? "Generating..." : "Generate QR"}
    </Button>
  )
}

export function getPrintQrColumns({
  generatedQrs,
  onGenerated,
}: {
  generatedQrs: Record<number, string>
  onGenerated: (variantId: number, qrBase64: string) => void
}): ColumnDef<InventoryItem>[] {
  return [
    {
      accessorKey: "variant.plant.name",
      header: "Plant",
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <p className="font-medium text-gray-800 text-theme-sm">
            {row.original.variant?.plant?.name ?? "-"}
          </p>
          {row.original.variant?.plant?.scientificName && (
            <p className="text-gray-500 text-xs italic">
              {row.original.variant?.plant?.scientificName}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "variant.sku",
      header: "Variant / SKU",
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-medium text-gray-700 text-theme-sm">
            {row.original.variant?.sku ?? "-"}
          </span>
          <p className="text-gray-500 text-xs">{row.original.variant?.size ?? "-"}</p>
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Stock",
      cell: ({ row }) => (
        <span className="text-gray-700 text-theme-sm">
          {row.original.quantity} units
        </span>
      ),
    },
    {
        id: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            size="sm"
            color={
              getStockStatus(row.original) === "In Stock"
                ? "success"
                : getStockStatus(row.original) === "Low Stock"
                  ? "warning"
                  : "error"
            }
          >
            {getStockStatus(row.original)}
          </Badge>
        ),
      },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex justify-start">
          <PrintQrActions 
            row={row.original} 
            existingQr={generatedQrs[row.original.variantId]}
            onGenerated={onGenerated}
          />
        </div>
      ),
    },
  ]
}
