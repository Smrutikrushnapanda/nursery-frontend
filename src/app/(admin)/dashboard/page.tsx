"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics"
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget"
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart"
import { getOrderColumns, OrderItem } from "@/components/tables/orderColumns"
import { DataTable } from "@/components/tables/DataTable"
import { Filter, FilterField } from "@/components/common/Filter"
import { inventoryApis, reportApis, ordersApis, subscriptionApis } from "@/utils/api/api"
import { TableLoader } from "@/components/table-loader/table-loader"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [metrics, setMetrics] = useState({
    totalPlants: 0,
    todaySales: 0,
    soldToday: 0,
    totalInventory: 0
  })
  const [dailyChart, setDailyChart] = useState<{ categories: string[], data: number[] }>({ categories: [], data: [] })
  const [weeklyChart, setWeeklyChart] = useState<{ categories: string[], data: number[] }>({ categories: [], data: [] })
  const [orderData, setOrderData] = useState<OrderItem[]>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [totalRows, setTotalRows] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<Record<string, any>>({})

  const filterFields: FilterField[] = useMemo(() => [
    {
      id: "customerName",
      label: "Customer",
      type: "text",
      placeholder: "Search by name..."
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      placeholder: "All Status",
      options: [
        { value: "CONFIRMED", label: "Confirmed" },
        { value: "PENDING", label: "Pending" },
        { value: "CANCELLED", label: "Cancelled" },
        { value: "SHIPPED", label: "Shipped" },
        { value: "DELIVERED", label: "Delivered" },
      ]
    }
  ], [])

  const handleFilter = useCallback((vals: Record<string, any>) => {
    setFilters(vals);
    setPagination(prev => prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }); 
  }, []);

  const orderColumns = useMemo(() => getOrderColumns(), [])

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      let hasActivePlan = false

      try {
        const subscriptionResponse = await subscriptionApis.getActiveSubscription()
        hasActivePlan = Boolean(subscriptionResponse?.success && subscriptionResponse?.data?.id)
      } catch (error) {
        console.error("Dashboard subscription check failed:", error)
      }

      if (!hasActivePlan) {
        router.replace("/pricing?alert=purchase-plan")
        return
      }

      const results = await Promise.allSettled([
        inventoryApis.getAllStocks(),
        reportApis.getSalesReports("daily"),
        reportApis.getSalesReports("weekly"),
        ordersApis.getAllOrders({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          ...filters
        })
      ])

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

        setDailyChart({
          categories: ["9AM", "11AM", "1PM", "3PM", "5PM", "7PM"],
          data: [today.revenue * 0.1, today.revenue * 0.2, today.revenue * 0.15, today.revenue * 0.25, today.revenue * 0.2, today.revenue * 0.1]
        })
      }

      // Orders Table Data
      if (ordersRes.success) {
        const orders = ordersRes.data?.data || []
        setOrderData(orders)
        setTotalRows(ordersRes.data?.total || orders.length)
        setTotalPages(ordersRes.data?.totalPages || 1)
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
  }, [pagination.pageIndex, pagination.pageSize, filters, router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (!orderData.length && isLoading && !Object.keys(filters).length) {
    return <TableLoader message="Loading Dashboard..." />
  }

  return (
    <div className="relative">
      {isLoading && orderData.length > 0 && (
        <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center rounded-2xl backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-brand-700">Updating...</p>
          </div>
        </div>
      )}
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

        {/* Charts */}
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
              <p className="text-sm text-gray-500">Overview of the latest customer orders and status</p>
            </div>
          </div>

          <div className="mb-6">
            <Filter
              fields={filterFields}
              onFilter={handleFilter}
              title="Order Filters"
            />
          </div>
          <DataTable
            columns={orderColumns}
            data={orderData}
            manualPagination={true}
            totalCount={totalRows}
            pageCount={totalPages}
            pagination={pagination}
            onPaginationChange={setPagination}
            onDownloadPage={() => handleDownloadExcel('page')}
            onDownloadAll={() => handleDownloadExcel('all')}
            isDownloading={isExporting}
          />
        </div>
      </div>
    </div>
  )
}
