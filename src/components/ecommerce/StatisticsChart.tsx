"use client"

import dynamic from "next/dynamic"
import { ApexOptions } from "apexcharts"
import { monthlyRestocks, monthlySoldPlants } from "./nurseryData"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

export default function StatisticsChart() {
  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#346739", "#E9C46A"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 320,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: [3, 3],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.35,
        opacityTo: 0.04,
      },
    },
    markers: {
      size: 0,
      hover: {
        size: 6,
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} plants`,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
    },
  }

  const series = [
    {
      name: "Sold",
      data: monthlySoldPlants,
    },
    {
      name: "Restocked",
      data: monthlyRestocks,
    },
  ]

  return (
    <div className="rounded-2xl border border-bordergray-200 bg-white px-5 pb-5 pt-5 dark:border-bordergray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Inventory Flow
          </h3>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            Monthly comparison of plants sold and plants added back into stock.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-white/5">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Peak sales month
            </p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
              December, 259 plants
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-white/5">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Current trend
            </p>
            <p className="text-sm font-semibold text-success-700 dark:text-success-400">
              Sales are outpacing restocks
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[900px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={320} />
        </div>
      </div>
    </div>
  )
}
