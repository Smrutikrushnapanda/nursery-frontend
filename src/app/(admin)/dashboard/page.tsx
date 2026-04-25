"use client"

import { useEffect, useMemo, useState } from "react"
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics"
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget"
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart"
import { getSalesReportColumns, SalesData } from "@/components/tables/salesReportColumns"
import { DataTable } from "@/components/tables/DataTable"
import { inventoryApis, reportApis } from "@/utils/api/api"
import { TableLoader } from "@/components/table-loader/table-loader"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalPlants: 0,
    todaySales: 0,
    soldToday: 0,
    totalInventory: 0
  })
  const [dailyChart, setDailyChart] = useState<{ categories: string[], data: number[] }>({ categories: [], data: [] })
  const [weeklyChart, setWeeklyChart] = useState<{ categories: string[], data: number[] }>({ categories: [], data: [] })
  const [salesTableData, setSalesTableData] = useState<SalesData[]>([])

  const salesColumns = useMemo(() => getSalesReportColumns(), [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [stocksRes, dailyRes, weeklyRes] = await Promise.all([
        inventoryApis.getAllStocks(),
        reportApis.getSalesReports("daily"),
        reportApis.getSalesReports("weekly")
      ])

      // Calculate Metrics
      if (stocksRes.success) {
        const stocks = stocksRes.data || []
        const uniquePlants = new Set(stocks.map((s: any) => s.variant?.plant?.id)).size
        const totalQty = stocks.reduce((acc: number, curr: any) => acc + (curr.quantity || 0), 0)
        
        setMetrics(prev => ({
          ...prev,
          totalPlants: uniquePlants,
          totalInventory: totalQty
        }))
      }

      // Daily Sales (Today)
      if (dailyRes.success && dailyRes.data.length > 0) {
        const sortedDaily = [...dailyRes.data].sort((a, b) => new Date(b.period).getTime() - new Date(a.period).getTime())
        const today = sortedDaily[0]
        setMetrics(prev => ({
          ...prev,
          todaySales: today.revenue,
          soldToday: today.orderCount
        }))

        // Sales Table Data (Show latest daily reports)
        setSalesTableData(sortedDaily.slice(0, 10))

        // For TodaySalesChart (Hourly Mock)
        setDailyChart({
          categories: ["9AM", "11AM", "1PM", "3PM", "5PM", "7PM"],
          data: [today.revenue * 0.1, today.revenue * 0.2, today.revenue * 0.15, today.revenue * 0.25, today.revenue * 0.2, today.revenue * 0.1]
        })
      }

      // Weekly Sales Chart
      if (weeklyRes.success && weeklyRes.data.length > 0) {
        const last7 = weeklyRes.data.slice(-7)
        setWeeklyChart({
          categories: last7.map((d: any) => {
            const date = new Date(d.period)
            return date.toLocaleDateString("en-IN", { weekday: "short" })
          }),
          data: last7.map((d: any) => d.revenue)
        })
      }

    } catch (error) {
      console.error("Dashboard fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) {
    return <TableLoader message="Loading Dashboard..." />
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">

      {/* Metrics */}
      <div className="col-span-12">
        <EcommerceMetrics 
          totalPlants={metrics.totalPlants}
          todaySales={metrics.todaySales}
          soldToday={metrics.soldToday}
          totalInventory={metrics.totalInventory}
        />
      </div>

      {/* Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 col-span-12">
        <MonthlySalesChart 
          categories={dailyChart.categories}
          data={dailyChart.data}
        />
        <MonthlyTarget 
          categories={weeklyChart.categories}
          data={weeklyChart.data}
        />
      </div>

      {/* Sales Data Table */}
      <div className="col-span-12">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Sales Overview</h3>
          <p className="text-sm text-gray-500">Summary of revenue and orders per day</p>
        </div>
        <DataTable columns={salesColumns} data={salesTableData} />
      </div>

    </div>
  )
}
