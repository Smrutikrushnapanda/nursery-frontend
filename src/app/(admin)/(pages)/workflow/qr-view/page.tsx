"use client"

import { useMemo, useState } from "react"
import { DataTable } from "@/components/tables/DataTable"
import { getQrColumns, QrCodeItem } from "@/components/tables/wrColumn"
import { DashboardDialog } from "@/components/common/DashboardDialog"
import { Button } from "@/components/ui/button"

const DUMMY_QR_DATA: QrCodeItem[] = [
  {
    id: 1,
    code: "PLANT-001-A",
    plantId: 101,
    organizationId: "org-1",
    qrImageBase64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", // Smallest red pixel PNG
    createdAt: new Date().toISOString(),
    plant: {
      id: 101,
      name: "Rose (Red)",
      scientificName: "Rosa rubiginosa",
    },
  },
  {
    id: 2,
    code: "PLANT-002-B",
    plantId: 102,
    organizationId: "org-1",
    qrImageBase64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    createdAt: new Date().toISOString(),
    plant: {
      id: 102,
      name: "Money Plant",
      scientificName: "Epipremnum aureum",
    },
  },
  {
    id: 3,
    code: "PLANT-003-C",
    plantId: 103,
    organizationId: "org-1",
    qrImageBase64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    createdAt: new Date().toISOString(),
    plant: {
      id: 103,
      name: "Snake Plant",
      scientificName: "Dracaena trifasciata",
    },
  },
]

export default function QrViewPage() {
  const [viewingQr, setViewingQr] = useState<QrCodeItem | null>(null)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const columns = useMemo(
    () =>
      getQrColumns({
        onView: (row) => setViewingQr(row),
        onDownload: (row) => {
          // Dummy download logic
          console.log("Downloading QR for", row.code)
          alert(`Downloading QR for ${row.code}`)
        },
      }),
    []
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QR View</h1>
          <p className="text-gray-500">View and manage generated QR codes for your plants.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        <DataTable
          columns={columns}
          data={DUMMY_QR_DATA}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>

      <DashboardDialog
        isOpen={Boolean(viewingQr)}
        onClose={() => setViewingQr(null)}
        title="QR Code Details"
        description="View detailed information and full-size QR code."
        className="max-w-md"
      >
        {viewingQr && (
          <div className="flex flex-col items-center gap-6 p-4">
            <div className="size-48 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-center p-4 shadow-inner">
              <img
                src={`data:image/png;base64,${viewingQr.qrImageBase64}`}
                alt={viewingQr.code}
                className="size-full object-contain"
              />
            </div>

            <div className="w-full space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Plant</p>
                  <p className="font-medium text-gray-900">{viewingQr.plant.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Code</p>
                  <p className="font-mono text-sm text-gray-900">{viewingQr.code}</p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Scientific Name</p>
                <p className="italic text-gray-700">{viewingQr.plant.scientificName ?? "N/A"}</p>
              </div>
            </div>

            <Button className="w-full" onClick={() => alert("Simulating high-res download...")}>
              Download High Resolution
            </Button>
          </div>
        )}
      </DashboardDialog>
    </div>
  )
}
