"use client"

import React from "react"
import Badge from "../ui/badge/Badge"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  DollarLineIcon,
  GroupIcon,
  ShootingStarIcon,
} from "@/icons"
import { inventoryOverview, recentPlantSales } from "./nurseryData"

const metrics = [
  {
    title: "Plants Sold Today",
    value: "20",
    note: "Across walk-in and wholesale orders",
    change: "12.4%",
    trend: "up" as const,
    icon: GroupIcon,
  },
  {
    title: "Live Inventory",
    value: inventoryOverview.reduce((total, plant) => total + plant.stock, 0).toString(),
    note: "Units ready across all nursery zones",
    change: "3.1%",
    trend: "down" as const,
    icon: BoxIconLine,
  },
  {
    title: "Sales Value Today",
    value: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(recentPlantSales.reduce((total, sale) => total + sale.amount, 0)),
    note: "Based on the latest plant sales",
    change: "8.7%",
    trend: "up" as const,
    icon: DollarLineIcon,
  },
  {
    title: "Fast Movers",
    value: "Aloe, Pothos",
    note: "Highest sell-through this week",
    change: "Restock soon",
    trend: "up" as const,
    icon: ShootingStarIcon,
  },
]

export const EcommerceMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon

        return (
          <div
            key={metric.title}
            className="rounded-2xl border border-borderbordergray-200 bg-white p-5 dark:border-borderbordergray-800 dark:bg-white/[0.03] md:p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              <Icon className="size-6 text-gray-800 dark:text-white/90" />
            </div>

            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {metric.title}
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {metric.value}
                </h4>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {metric.note}
                </p>
              </div>

              {metric.trend === "up" ? (
                <Badge color="success">
                  <ArrowUpIcon />
                  {metric.change}
                </Badge>
              ) : (
                <Badge color="warning">
                  <ArrowDownIcon className="text-warning-500" />
                  {metric.change}
                </Badge>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
