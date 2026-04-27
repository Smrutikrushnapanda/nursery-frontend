"use client"

import { useEffect, useMemo, useState } from "react"
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics"
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget"
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart"
import { getOrderColumns, OrderItem } from "@/components/tables/orderColumns"
import { DataTable } from "@/components/tables/DataTable"
import { inventoryApis, reportApis, ordersApis, invoiceApis } from "@/utils/api/api"
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
  const [orderData, setOrderData] = useState<OrderItem[]>([])

  const orderColumns = useMemo(() => getOrderColumns(), [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const results = await Promise.allSettled([
        inventoryApis.getAllStocks(),
        reportApis.getSalesReports("daily"),
        reportApis.getSalesReports("weekly"),
        ordersApis.getAllOrders()
      ])

      console.log("Dashboard fetch results:", results)

      const [stocksRes, dailyRes, weeklyRes, ordersRes] = results.map(r => r.status === 'fulfilled' ? r.value : { success: false, data: null })

      // Log errors for failed requests
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const apiNames = ["inventoryApis.getAllStocks", "reportApis.getSalesReports(daily)", "reportApis.getSalesReports(weekly)", "ordersApis.getAllOrders"]
          console.error(`Dashboard API failed: ${apiNames[index]}`, result.reason)
        }
      })

      // Calculate Metrics
      if (stocksRes.success) {
        const stocks = Array.isArray(stocksRes.data?.data)
          ? stocksRes.data.data
          : Array.isArray(stocksRes.data)
            ? stocksRes.data
            : []

        const uniquePlants = new Set(stocks.map((s: any) => s.variant?.plant?.id)).size
        const totalQty = stocks.reduce((acc: number, curr: any) => acc + (curr.quantity || 0), 0)

        setMetrics(prev => ({
          ...prev,
          totalPlants: uniquePlants,
          totalInventory: totalQty
        }))
      }

      // Daily Sales (Today)
      const dailyData = Array.isArray(dailyRes.data?.data)
        ? dailyRes.data.data
        : Array.isArray(dailyRes.data)
          ? dailyRes.data
          : []

      if (dailyRes.success && dailyData.length > 0) {
        const sortedDaily = [...dailyData].sort((a, b) => new Date(b.period).getTime() - new Date(a.period).getTime())
        const today = sortedDaily[0]
        setMetrics(prev => ({
          ...prev,
          todaySales: today.revenue,
          soldToday: today.orderCount
        }))

        // For TodaySalesChart (Hourly Mock)
        setDailyChart({
          categories: ["9AM", "11AM", "1PM", "3PM", "5PM", "7PM"],
          data: [today.revenue * 0.1, today.revenue * 0.2, today.revenue * 0.15, today.revenue * 0.25, today.revenue * 0.2, today.revenue * 0.1]
        })
      }

      // Orders Table Data (Show latest orders)
      if (ordersRes.success) {
        const orders = Array.isArray(ordersRes.data?.data)
          ? ordersRes.data.data
          : Array.isArray(ordersRes.data)
            ? ordersRes.data
            : Array.isArray(ordersRes)
              ? ordersRes
              : []

        setOrderData(orders)
      }

      // Weekly Sales Chart
      const weeklyData = Array.isArray(weeklyRes.data?.data)
        ? weeklyRes.data.data
        : Array.isArray(weeklyRes.data)
          ? weeklyRes.data
          : []

      if (weeklyRes.success && weeklyData.length > 0) {
        const last7 = weeklyData.slice(-7)
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

  const downloadInvoice = async(orderId: number)=>{
    try {
      const response = await invoiceApis.download(orderId);

    } catch (error : any) {
      alert(error.message || "Failed to download invoice")
    }
  }

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

      {/* Recent Orders Table */}
      <div className="col-span-12">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
          <p className="text-sm text-gray-500">Overview of the latest customer orders and status</p>
        </div>
        <DataTable columns={orderColumns} data={orderData} />
      </div>

    </div>
  )
}
