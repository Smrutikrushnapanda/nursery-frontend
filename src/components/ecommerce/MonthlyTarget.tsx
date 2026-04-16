"use client"

import { ApexOptions } from "apexcharts"
import dynamic from "next/dynamic"
import Badge from "../ui/badge/Badge"
import { inventoryOverview } from "./nurseryData"

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
})

export default function MonthlyTarget() {
  const healthyCount = inventoryOverview.filter(
    (plant) => plant.status === "Healthy"
  ).length
  const stockHealthScore = Math.round(
    (healthyCount / inventoryOverview.length) * 100
  )
  const lowStockPlants = inventoryOverview.filter(
    (plant) => plant.status !== "Healthy"
  )

  const series = [stockHealthScore]
  const options: ApexOptions = {
    colors: ["#346739"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 290,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: "78%",
        },
        track: {
          background: "#E5E7EB",
          strokeWidth: "100%",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -18,
            fontSize: "34px",
            fontWeight: "700",
            color: "#1F2937",
            formatter: (value) => `${Math.round(Number(value))}%`,
          },
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Healthy stock"],
  }

  return (
    <div className="rounded-2xl border border-bordergray-200 bg-gray-100 dark:border-bordergray-800 dark:bg-white/[0.03]">
      <div className="rounded-2xl px-5 pb-8 pt-5 shadow-default bg-background sm:px-6 sm:pt-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Stock Health
            </h3>
            <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
              Share of tracked plants currently above their reorder level.
            </p>
          </div>

          <Badge color="success">Stable</Badge>
        </div>

        <div className="relative">
          <div className="max-h-[290px]">
            <ReactApexChart
              options={options}
              series={series}
              type="radialBar"
              height={290}
            />
          </div>

          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[110%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-700 dark:bg-success-500/15 dark:text-success-400">
            {healthyCount} of {inventoryOverview.length} plant lines healthy
          </span>
        </div>

        <div className="mt-8 space-y-3">
          {lowStockPlants.map((plant) => (
            <div
              key={plant.id}
              className="flex items-center justify-between rounded-xl border border-bordergray-200 px-4 py-3 dark:border-bordergray-800"
            >
              <div>
                <p className="font-medium text-gray-800 dark:text-white/90">
                  {plant.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {plant.location}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800 dark:text-white/90">
                  {plant.stock} left
                </p>
                <p className="text-sm text-warning-600 dark:text-warning-400">
                  Reorder at {plant.reorderLevel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
