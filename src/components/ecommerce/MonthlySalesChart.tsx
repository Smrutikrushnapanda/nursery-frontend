"use client"

import { ApexOptions } from "apexcharts"
import dynamic from "next/dynamic"
import { weeklySalesMix } from "./nurseryData"

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
})

export default function MonthlySalesChart() {
  const options: ApexOptions = {
    colors: ["#346739", "#A7C957"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 260,
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "42%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit, sans-serif",
    },
    xaxis: {
      categories: weeklySalesMix.map((item) => item.day),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} plants`,
      },
    },
  }

  const series = [
    {
      name: "Sold",
      data: weeklySalesMix.map((item) => item.sold),
    },
    {
      name: "Restocked",
      data: weeklySalesMix.map((item) => item.restocked),
    },
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-bordergray-200 bg-white px-5 pt-5 dark:border-bordergray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Weekly Plant Movement
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Compare how many plants were sold versus restocked over the last 7
            days.
          </p>
        </div>

        <div className="rounded-xl bg-success-50 px-3 py-2 text-right dark:bg-success-500/10">
          <p className="text-xs font-medium uppercase tracking-wide text-success-700 dark:text-success-400">
            Best Day
          </p>
          <p className="text-sm font-semibold text-success-800 dark:text-success-300">
            Saturday, 38 sold
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[680px] pl-1 pt-4 xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={260}
          />
        </div>
      </div>
    </div>
  )
}
