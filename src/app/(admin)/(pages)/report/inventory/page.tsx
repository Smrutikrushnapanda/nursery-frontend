"use client"

import { useEffect, useMemo, useState } from "react"
import { DataTable } from "@/components/tables/DataTable"
import { getInventoryReportColumns, InventoryItemData } from "@/components/tables/inventoryReportColumns"
import { reportApis } from "@/utils/api/api"
import { TableLoader } from "@/components/table-loader/table-loader"
import { Package, IndianRupee, BarChart3, AlertCircle, ShoppingBag, ArrowUpRight } from "lucide-react"
import { Filter, FilterField } from "@/components/common/Filter"

export default function InventoryReportsPage() {
  const [data, setData] = useState<InventoryItemData[]>([])
  const [totalValue, setTotalValue] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<Record<string, any>>({})

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

  const filterFields: FilterField[] = [
    {
      id: "plant",
      label: "Plant Name",
      type: "text",
      placeholder: "Filter by plant..."
    },
    {
      id: "variant",
      label: "Variant / SKU",
      type: "text",
      placeholder: "Filter by SKU..."
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "In Stock", label: "In Stock" },
        { value: "Low Stock", label: "Low Stock" },
        { value: "Out of Stock", label: "Out of Stock" }
      ]
    }
  ]

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const plantMatch = !filters.plant || item.plantName.toLowerCase().includes(filters.plant.toLowerCase())
      const variantMatch = !filters.variant || item.sku.toLowerCase().includes(filters.variant.toLowerCase())
      
      const status = item.stockQty > 10 ? "In Stock" : item.stockQty > 0 ? "Low Stock" : "Out of Stock"
      const statusMatch = !filters.status || status === filters.status

      return plantMatch && variantMatch && statusMatch
    })
  }, [data, filters])

  const stats = useMemo(() => {
    const currentData = filteredData
    const totalVal = currentData.reduce((acc, curr) => acc + curr.stockValue, 0)
    const totalQty = currentData.reduce((acc, curr) => acc + curr.stockQty, 0)
    const lowStock = currentData.filter(item => item.stockQty > 0 && item.stockQty <= 10).length
    const outOfStock = currentData.filter(item => item.stockQty <= 0).length

    return {
      totalVal,
      totalQty,
      lowStock,
      outOfStock
    }
  }, [filteredData])

  const columns = useMemo(() => getInventoryReportColumns(), [])

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

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Value"
          value={new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
          }).format(stats.totalVal)}
          icon={<IndianRupee className="w-5 h-5 text-brand-500" />}
          trend="Live"
          color="success"
        />
        <MetricCard
          title="Total Stock"
          value={`${stats.totalQty} Units`}
          icon={<Package className="w-5 h-5 text-blue-500" />}
          trend="Current"
          color="blue"
        />
        <MetricCard
          title="Low Stock"
          value={`${stats.lowStock} Items`}
          icon={<AlertCircle className="w-5 h-5 text-warning-500" />}
          trend={`${stats.lowStock > 0 ? "Action Required" : "Safe"}`}
          color="warning"
        />
        <MetricCard
          title="Out of Stock"
          value={`${stats.outOfStock} Items`}
          icon={<ShoppingBag className="w-5 h-5 text-error-500" />}
          trend="Critical"
          color="error"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden min-h-[400px] flex flex-col relative">
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-[1px] flex items-center justify-center">
            <TableLoader message="Updating inventory data..." isOverlay />
          </div>
        )}
        
        <div className="p-4 2xl:p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg 2xl:text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-500" />
            Inventory Breakdown
          </h2>
          {!isLoading && (
             <span className="text-xs text-gray-500 font-medium">
                Showing {filteredData.length} records
             </span>
          )}
        </div>
        <div className="px-4 pt-4 2xl:px-6">
          <Filter
            fields={filterFields}
            onFilter={setFilters}
            title="Inventory Filters"
          />
        </div>
        <div className="flex-1 relative pt-4 2xl:pt-6">
          <DataTable columns={columns} data={filteredData} />
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, trend, color }: {
  title: string,
  value: string,
  icon: React.ReactNode,
  trend: string,
  color: 'blue' | 'success' | 'warning' | 'error'
}) {
  const colorMap = {
      blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
      success: "bg-success-50 text-success-600 border-success-100 dark:bg-success-900/20 dark:text-success-400 dark:border-success-800",
      warning: "bg-warning-50 text-warning-600 border-warning-100 dark:bg-warning-900/20 dark:text-warning-400 dark:border-warning-800",
      error: "bg-error-50 text-error-600 border-error-100 dark:bg-error-900/20 dark:text-error-400 dark:border-error-800"
  };

  const trendColorMap = {
      blue: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30",
      success: "text-success-600 bg-success-50 dark:text-success-400 dark:bg-success-900/30",
      warning: "text-warning-600 bg-warning-50 dark:text-warning-400 dark:bg-warning-900/30",
      error: "text-error-600 bg-error-50 dark:text-error-400 dark:bg-error-900/30"
  }

  return (
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-theme-xs group hover:shadow-theme-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl border ${colorMap[color]}`}>
                  {icon}
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${trendColorMap[color]}`}>
                  <ArrowUpRight className="w-3 h-3" />
                  {trend}
              </div>
          </div>
          <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          </div>
      </div>
  );
}
