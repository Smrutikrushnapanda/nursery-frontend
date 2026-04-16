import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics"
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget"
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart"
import StatisticsChart from "@/components/ecommerce/StatisticsChart"
import RecentOrders from "@/components/ecommerce/RecentOrders"

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <div className="rounded-2xl border border-bordergray-200 bg-white px-5 py-5 dark:border-bordergray-800 dark:bg-white/[0.03] sm:px-6">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-success-700 dark:text-success-400">
            Nursery Dashboard
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            Track plant sales, current stock, and restock pressure at a glance.
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-500 dark:text-gray-400">
            This view highlights how many plants are selling, what inventory is
            available right now, and which varieties need attention before they
            go out of stock.
          </p>
        </div>
      </div>

      <div className="col-span-12">
        <EcommerceMetrics />
      </div>

      <div className="col-span-12 space-y-6 xl:col-span-8">
        <MonthlySalesChart />
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-4">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <RecentOrders />
      </div>
    </div>
  )
}
