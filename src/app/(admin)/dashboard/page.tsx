import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics"
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget"
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart"
import StatisticsChart from "@/components/ecommerce/StatisticsChart"
import RecentOrders from "@/components/ecommerce/RecentOrders"
import { salesColumns } from "./SalesColumn"
import { salesData } from "./SalesData"
import { DataTable } from "@/components/tables/DataTable"

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">

      {/* Metrics */}
      <div className="col-span-12">
        <EcommerceMetrics />
      </div>

      {/* Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 col-span-12">
        <MonthlySalesChart />
        <MonthlyTarget />
      </div>

      {/* Table (NOW BELOW CHART) */}
      <div className="col-span-12">
        <DataTable columns={salesColumns} data={salesData} />
      </div>

    </div>
  )
}
