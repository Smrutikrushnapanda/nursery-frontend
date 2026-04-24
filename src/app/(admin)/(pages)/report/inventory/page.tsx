"use client"

import { useEffect, useMemo, useState } from "react"
import { DataTable } from "@/components/tables/DataTable"
import { getInventoryReportColumns, InventoryItemData } from "@/components/tables/inventoryReportColumns"
import { reportApis } from "@/utils/api/api"
import { TableLoader } from "@/components/table-loader/table-loader"
import { Package, IndianRupee, BarChart3, AlertCircle } from "lucide-react"

export default function InventoryReportsPage() {
  const [data, setData] = useState<InventoryItemData[]>([])
  const [totalValue, setTotalValue] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchInventoryReport = async () => {
    setIsLoading(true)
    try {
      const response = await reportApis.getInventoryValue()
      if (response.success) {
        setData(response.data.items)
        setTotalValue(response.data.totalValue)
      }
    } catch (error: any) {
      console.error("Failed to fetch inventory report:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInventoryReport()
  }, [])

  const columns = useMemo(() => getInventoryReportColumns(), [])

  const lowStockItems = useMemo(() => {
    return data.filter(item => item.stockQty < 10).length
  }, [data])

  if (isLoading && data.length === 0) {
    return <TableLoader message="Loading Inventory Analytics..." />
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl 2xl:text-3xl font-bold text-gray-900 dark:text-white">Inventory Reports</h1>
          <p className="text-gray-500 dark:text-gray-400 2xl:text-base">Real-time overview of your plant stock and valuation.</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-4 2xl:p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg 2xl:text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-500" />
            Inventory Breakdown
          </h2>
        </div>
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-white/60 dark:bg-gray-800/60 backdrop-blur-[1px] flex items-center justify-center">
              <TableLoader message="Updating inventory data..." isOverlay />
            </div>
          )}
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  )
}
