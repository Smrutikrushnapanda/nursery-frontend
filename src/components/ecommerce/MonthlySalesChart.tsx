"use client"

import { ApexOptions } from "apexcharts"
import dynamic from "next/dynamic"

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
})

interface TodaySalesChartProps {
  categories?: string[];
  data?: number[];
}

export default function TodaySalesChart({
  categories = ["9AM", "11AM", "1PM", "3PM", "5PM", "7PM"],
  data = [0, 0, 0, 0, 0, 0]
}: TodaySalesChartProps) {
  const hours = categories
  const salesData = data
  const totalSales = salesData.reduce((acc, curr) => acc + curr, 0)
  const peakIndex = salesData.indexOf(Math.max(...salesData))

  const options: ApexOptions = {
    colors: ["#346739"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 260,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 8,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: "#e8e8ca",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: hours,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 500,
          colors: "#475467",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: "#475467",
        },
        formatter: (value: number) => `₹${value}`,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `₹${value.toLocaleString()}`,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.3,
        gradientToColors: ["#79ae6f"],
        opacityFrom: 1,
        opacityTo: 0.7,
        stops: [0, 100],
      },
    },
  }

  const series = [{ name: "Sales", data: salesData }]

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-theme-xs transition-all duration-300 hover:shadow-theme-md">
      {/* Border layers */}
      <div className="absolute inset-0 rounded-2xl border-2 border-brand-200/30" />
      <div className="absolute inset-0.5 rounded-xl border border-brand-200/50" />
      
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-300 rounded-t-2xl" />

      <div className="relative p-5 sm:p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Today's Sales</h3>
          <p className="text-sm text-gray-500">Hourly revenue • Total: ₹{totalSales.toLocaleString()}</p>
        </div>

        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[600px] xl:min-w-full">
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={260}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-brand-100 pt-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-500">Peak Hour</p>
              <p className="text-sm font-semibold text-gray-700">
                {hours[peakIndex]} • ₹{salesData[peakIndex]}
              </p>
            </div>
            <div className="h-8 w-px bg-brand-200" />
            <div>
              <p className="text-xs text-gray-500">Average</p>
              <p className="text-sm font-semibold text-gray-700">
                ₹{Math.round(totalSales / salesData.length)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success-500" />
            <span className="text-xs text-gray-500">+12% vs yesterday</span>
          </div>
        </div>
      </div>
    </div>
  )
}