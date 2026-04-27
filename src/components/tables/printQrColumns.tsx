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
  onGenerated?: (variantId: number, qrImageBase64: string) => void
  existingQr?: string
}

function PrintQrActions({ row, onGenerated, existingQr }: PrintQrActionsProps) {
  const [generating, setGenerating] = useState(false)
  const [qrData, setQrData] = useState<string | null>(existingQr || row.qrCode?.qrImageBase64 || null)

  const isAlreadyGenerated = Number(row.qrCode?.alreadyGenerated) === 1

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const plantId = row.variant?.plant?.id

      if (!plantId) {
        throw new Error("Plant ID not found for this variant")
      }

      const response = await qrApis.generateQrCode(plantId, row.variantId)
      if (response.success) {
        const qrImageBase64 = response.data?.qrImageBase64

        if (!qrImageBase64) {
          throw new Error("QR code image was not returned by the server")
        }

        setQrData(qrImageBase64)
        onGenerated?.(row.variantId, qrImageBase64)
        
        // Return data so it can be used for immediate download if needed
        return qrImageBase64
      }
    } catch (error: any) {
      console.error(error)
      alert(error?.message || "Failed to generate QR code")
    } finally {
      setGenerating(false)
    }
    return null
  }

  const downloadImage = (base64Data: string) => {
    const img = new Image();
    img.src = base64Data;
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Define dimensions
      const qrSize = img.width || 150; // Fallback to 150 if width not yet ready
      const padding = 20;
      const textAreaHeight = 90; // Height allocated for the 3 lines of text
      
      canvas.width = qrSize + (padding * 2);
      canvas.height = qrSize + textAreaHeight + padding;

      // Draw white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR Code
      ctx.drawImage(img, padding, padding, qrSize, qrSize);

      // Configure text styles
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      
      const plantName = row.variant?.plant?.name || "Unknown Plant";
      const variantSize = row.variant?.size || "Unknown Size";
      const plantId = row.variant?.plant?.id || "-";
      const variantId = row.variantId || "-";

      // Line 1: Plant Name (Bold)
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(plantName, canvas.width / 2, qrSize + padding + 25);
      
      // Line 2: Variant Size
      ctx.font = "14px sans-serif";
      ctx.fillStyle = "#374151"; // gray-700
      ctx.fillText(`Size: ${variantSize}`, canvas.width / 2, qrSize + padding + 48);
      
      // Line 3: IDs
      ctx.font = "11px monospace";
      ctx.fillStyle = "#6b7280"; // gray-500
      ctx.fillText(`P-ID: ${plantId} | V-ID: ${variantId}`, canvas.width / 2, qrSize + padding + 70);

      // Trigger Download
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `qr-${row.variant?.sku || row.variantId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  const handleDownload = async () => {
    if (qrData) {
      downloadImage(qrData)
    } else {
      const data = await handleGenerate()
      if (data) {
        downloadImage(data)
      }
    }
  }

  if (qrData || isAlreadyGenerated) {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={generating}
        className="flex items-center gap-2 border-brand-200 text-brand-600 hover:bg-brand-50"
        onClick={handleDownload}
      >
        {generating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {generating ? "Fetching..." : "Download QR"}
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
  pagination,
}: {
  generatedQrs: Record<number, string>
  onGenerated: (variantId: number, qrImageBase64: string) => void
  pagination: { pageIndex: number; pageSize: number }
}): ColumnDef<InventoryItem>[] {
  return [
    {
      id: "slNo",
      header: "Sl No",
      cell: ({ row }) => (
        <span className="text-gray-500 font-medium">
          {pagination.pageIndex * pagination.pageSize + row.index + 1}
        </span>
      ),
      size: 50,
    },
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
