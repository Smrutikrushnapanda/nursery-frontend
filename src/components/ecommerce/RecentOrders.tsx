"use client"

import Badge from "../ui/badge/Badge"
import { inventoryOverview, recentPlantSales } from "./nurseryData"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export default function RecentOrders() {
  const attentionPlants = inventoryOverview
    .filter((plant) => plant.status !== "Healthy")
    .sort((a, b) => a.stock - b.stock)

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
      <div className="overflow-hidden rounded-2xl border border-bordergray-200 bg-white px-4 pb-3 pt-4 dark:border-bordergray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Recent Plant Sales
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Most recent orders recorded by the nursery team today.
            </p>
          </div>

          <Badge color="primary">{recentPlantSales.length} updates</Badge>
        </div>

        <div className="space-y-3">
          {recentPlantSales.map((sale) => (
            <div
              key={sale.id}
              className="flex flex-col gap-3 rounded-xl border border-bordergray-200 px-4 py-4 dark:border-bordergray-800 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-gray-800 dark:text-white/90">
                  {sale.plant}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {sale.customer}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-left sm:text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Quantity
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {sale.quantity} plants
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Amount
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {currency.format(sale.amount)}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sold at
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {sale.soldAt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-bordergray-200 bg-white px-5 py-5 dark:border-bordergray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Reorder Attention
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Plants closest to stock-out based on current inventory.
          </p>
        </div>

        <div className="space-y-3">
          {attentionPlants.map((plant) => (
            <div
              key={plant.id}
              className="rounded-xl border border-bordergray-200 px-4 py-4 dark:border-bordergray-800"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white/90">
                    {plant.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {plant.category} . {plant.location}
                  </p>
                </div>

                <Badge
                  color={plant.status === "Out of Stock" ? "error" : "warning"}
                >
                  {plant.status}
                </Badge>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  On hand: {plant.stock}
                </span>
                <span className="font-medium text-gray-800 dark:text-white/90">
                  Reorder at {plant.reorderLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
