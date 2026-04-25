"use client"

import { useEffect, useMemo, useState } from "react"
import { DataTable } from "@/components/tables/DataTable"
import { getSalesReportColumns, SalesData } from "@/components/tables/salesReportColumns"
import { reportApis } from "@/utils/api/api"
import { TableLoader } from "@/components/table-loader/table-loader"
import { TrendingUp, ShoppingBag, CreditCard, Calendar } from "lucide-react"

export default function SalesReportsPage() {
  const [data, setData] = useState<SalesData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reportType, setReportType] = useState<string>("daily")

  const [customDays, setCustomDays] = useState<string>("30")

  const fetchSalesReports = async (type: string) => {
    setIsLoading(true)
    try {
      // If type is custom, we send the numeric value
      const queryType = type === "custom" ? customDays : type
      const response = await reportApis.getSalesReports(queryType)
      if (response.success) {
        setData(response.data)
      }
    } catch (error: any) {
      console.error("Failed to fetch sales reports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (reportType !== "custom") {
      fetchSalesReports(reportType)
    }
  }, [reportType])

  const totals = useMemo(() => {
    return data.reduce((acc, curr) => {
      acc.revenue += Number(curr.revenue)
      acc.orders += Number(curr.orderCount)
      return acc
    }, { revenue: 0, orders: 0 })
  }, [data])

  const columns = useMemo(() => getSalesReportColumns(), [])

  if (isLoading && data.length === 0) {
    return <TableLoader message="Loading Sales Analytics..." />
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 2xl:p-10 space-y-6 2xl:space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl 2xl:text-3xl font-bold text-gray-900 dark:text-white">Sales Reports</h1>
          <p className="text-gray-500 dark:text-gray-400 2xl:text-base">Analyze your revenue and order trends over time.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            {["daily", "weekly", "monthly", "custom"].map((t) => (
              <button
                key={t}
                onClick={() => setReportType(t)}
                className={`px-4 py-1.5 2xl:px-6 2xl:py-2 text-sm 2xl:text-base font-medium rounded-md transition-all capitalize ${reportType === t
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          {reportType === "custom" && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="relative">
                <input
                  type="number"
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  className="w-20 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  placeholder="Days"
                  min="1"
                />
                <span className="absolute -top-6 left-0 text-[10px] font-bold text-brand-600 uppercase tracking-tighter">Days</span>
              </div>
              <button
                onClick={() => fetchSalesReports("custom")}
                className="px-4 py-1.5 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 shadow-sm active:scale-95 transition-all"
              >
                Fetch
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 2xl:gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 2xl:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 2xl:p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600 dark:text-brand-400">
              <TrendingUp className="w-6 h-6 2xl:w-8 2xl:h-8" />
            </div>
            <span className="text-xs font-medium text-brand-600 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded-full uppercase tracking-wider">Revenue</span>
          </div>
          <h3 className="text-2xl 2xl:text-4xl font-bold text-gray-900 dark:text-white">₹ {totals.revenue.toLocaleString("en-IN")}</h3>
          <p className="text-sm 2xl:text-base text-gray-500 dark:text-gray-400">Total {reportType} Revenue</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 2xl:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 2xl:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
              <ShoppingBag className="w-6 h-6 2xl:w-8 2xl:h-8" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full uppercase tracking-wider">Orders</span>
          </div>
          <h3 className="text-2xl 2xl:text-4xl font-bold text-gray-900 dark:text-white">{totals.orders}</h3>
          <p className="text-sm 2xl:text-base text-gray-500 dark:text-gray-400">Total {reportType} Orders</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 2xl:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 2xl:p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
              <CreditCard className="w-6 h-6 2xl:w-8 2xl:h-8" />
            </div>
            <span className="text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full uppercase tracking-wider">AOV</span>
          </div>
          <h3 className="text-2xl 2xl:text-4xl font-bold text-gray-900 dark:text-white">
            ₹ {totals.orders > 0 ? (totals.revenue / totals.orders).toLocaleString("en-IN", { maximumFractionDigits: 0 }) : 0}
          </h3>
          <p className="text-sm 2xl:text-base text-gray-500 dark:text-gray-400">Average Order Value</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-4 2xl:p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg 2xl:text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-500" />
            {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Sales Breakdown
          </h2>
        </div>
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-white/60 dark:bg-gray-800/60 backdrop-blur-[1px] flex items-center justify-center">
              <TableLoader message="Updating sales data..." isOverlay />
            </div>
          )}
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  )
}
