"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { DataTable } from "@/components/tables/DataTable"
import { getScanActivityLabel, getScanSellColumns, DailyScan } from "@/components/tables/scanSellColumns"
import { qrApis } from "@/utils/api/api"
import { TableLoader } from "@/components/table-loader/table-loader"
import { BarChart3, Scan, Leaf, Users } from "lucide-react"
import { Filter, FilterField } from "@/components/common/Filter"

export default function ScanSellPage() {
  const [data, setData] = useState<{
    totalScans: number
    uniquePlantsScanned: number
    uniqueScanners: number
    periodDays: number
    dailyScans: DailyScan[]
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [days, setDays] = useState(30)
  const [isCustom, setIsCustom] = useState(false)
  const [customValue, setCustomValue] = useState("30")
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        id: "activity",
        label: "Activity",
        type: "select",
        options: [
          { value: "Low Activity", label: "Low Activity" },
          { value: "Moderate Activity", label: "Moderate Activity" },
          { value: "High Activity", label: "High Activity" },
        ],
        placeholder: "All Activity",
      },
    ],
    []
  )

  const fetchScanAnalytics = async (selectedDays: number) => {
    if (isNaN(selectedDays) || selectedDays <= 0) return
    setIsLoading(true)
    try {
      const response = await qrApis.getQrAnalytics(selectedDays)
      if (response.success) {
        setData(response.data)
      }
    } catch (error: any) {
      alert(error.message)
      console.error("Failed to fetch scan analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchScanAnalytics(30)
  }, [])

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setCustomValue(val)
  }

  const handleFetchClick = () => {
    const num = parseInt(customValue)
    if (!isNaN(num) && num > 0) {
      setDays(num)
      fetchScanAnalytics(num)
      setPagination((prev) => (
        prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }
      ))
    }
  }

  // Predefined buttons update immediately
  const handlePredefinedClick = (d: number) => {
    setDays(d)
    setIsCustom(false)
    setCustomValue(d.toString())
    fetchScanAnalytics(d)
    setPagination((prev) => (
      prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }
    ))
  }

  const handleFilter = useCallback((vals: Record<string, any>) => {
    setFilters(vals)
    setPagination((prev) => (
      prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }
    ))
  }, [])

  const columns = useMemo(() => getScanSellColumns(), [])
  const filteredDailyScans = useMemo(() => {
    const dailyScans = data?.dailyScans ?? []

    return dailyScans.filter((item) => {
      const activity = getScanActivityLabel(item.count)
      return !filters.activity || activity === filters.activity
    })
  }, [data?.dailyScans, filters.activity])

  if (isLoading && !data) return <TableLoader message="Loading Scan Analytics..." />

  return (
    <div className="p-4 md:p-6 lg:p-8 2xl:p-10 space-y-6 2xl:space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl 2xl:text-3xl font-bold text-gray-900 dark:text-white">Scan and Sell</h1>
          <p className="text-gray-500 dark:text-gray-400 2xl:text-base">Monitor plant scanning activity and sales potential.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => handlePredefinedClick(d)}
                className={`px-3 py-1.5 2xl:px-4 2xl:py-2 text-sm 2xl:text-base font-medium rounded-md transition-all ${!isCustom && days === d
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
              >
                {d} Days
              </button>
            ))}
            <button
              onClick={() => setIsCustom(true)}
              className={`px-3 py-1.5 2xl:px-4 2xl:py-2 text-sm 2xl:text-base font-medium rounded-md transition-all ${isCustom
                ? "bg-brand-500 text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
            >
              Custom
            </button>
          </div>

          {isCustom && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
              <div className="relative">
                <input
                  type="number"
                  value={customValue}
                  onChange={handleCustomChange}
                  className="w-24 2xl:w-32 pl-3 pr-8 py-1.5 2xl:py-2 text-sm 2xl:text-base bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  placeholder="Days"
                  min="1"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] 2xl:text-xs text-gray-400 font-medium uppercase">Days</span>
              </div>
              <button
                onClick={handleFetchClick}
                disabled={isLoading}
                className="px-4 py-1.5 2xl:px-6 2xl:py-2 text-sm 2xl:text-base font-semibold bg-brand-500 text-white rounded-lg shadow-sm hover:bg-brand-600 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
              >
                Fetch
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 2xl:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 2xl:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
              <Scan className="w-6 h-6 2xl:w-8 2xl:h-8" />
            </div>
            <span className="text-xs 2xl:text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
              Total
            </span>
          </div>
          <h3 className="text-2xl 2xl:text-4xl font-bold text-gray-900 dark:text-white">{data?.totalScans ?? 0}</h3>
          <p className="text-sm 2xl:text-base text-gray-500 dark:text-gray-400">Total Scans</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 2xl:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 2xl:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
              <Leaf className="w-6 h-6 2xl:w-8 2xl:h-8" />
            </div>
            <span className="text-xs 2xl:text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              Unique
            </span>
          </div>
          <h3 className="text-2xl 2xl:text-4xl font-bold text-gray-900 dark:text-white">{data?.uniquePlantsScanned ?? 0}</h3>
          <p className="text-sm 2xl:text-base text-gray-500 dark:text-gray-400">Unique Plants</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 2xl:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 2xl:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
              <Users className="w-6 h-6 2xl:w-8 2xl:h-8" />
            </div>
            <span className="text-xs 2xl:text-sm font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <h3 className="text-2xl 2xl:text-4xl font-bold text-gray-900 dark:text-white">{data?.uniqueScanners ?? 0}</h3>
          <p className="text-sm 2xl:text-base text-gray-500 dark:text-gray-400">Unique Scanners</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 2xl:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 2xl:p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
              <BarChart3 className="w-6 h-6 2xl:w-8 2xl:h-8" />
            </div>
            <span className="text-xs 2xl:text-sm font-medium text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
              Period
            </span>
          </div>
          <h3 className="text-2xl 2xl:text-4xl font-bold text-gray-900 dark:text-white">{data?.periodDays ?? 0} Days</h3>
          <p className="text-sm 2xl:text-base text-gray-500 dark:text-gray-400">Reporting Period</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-4 2xl:p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg 2xl:text-xl font-semibold text-gray-800 dark:text-white">Daily Scan Logs</h2>
        </div>
        <div className="px-4 pt-4 2xl:px-6">
          <Filter
            fields={filterFields}
            onFilter={handleFilter}
            title="Scan Filters"
          />
        </div>
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-white/60 dark:bg-gray-800/60 backdrop-blur-[1px] flex items-center justify-center">
              <TableLoader message="Updating report..." isOverlay />
            </div>
          )}

          <DataTable
            columns={columns}
            data={filteredDailyScans}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </div>
      </div>

    </div>

  )
}
