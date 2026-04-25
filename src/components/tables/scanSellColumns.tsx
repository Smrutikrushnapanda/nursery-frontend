"use client"

import { ColumnDef } from "@tanstack/react-table"

export type DailyScan = {
  date: string
  count: string | number
}

export function getScanActivityLabel(count: string | number) {
  const numericCount = Number(count)

  if (numericCount > 10) {
    return "High Activity"
  }

  if (numericCount > 5) {
    return "Moderate Activity"
  }

  return "Low Activity"
}

export function getScanSellColumns(): ColumnDef<DailyScan>[] {
  return [
    {
      accessorKey: "date",
      header: "Scan Date",
      cell: ({ row }) => (
        <span className="text-gray-700 font-medium">
          {new Date(row.original.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      accessorKey: "count",
      header: "Total Scans",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {row.original.count}
          </span>
          <span className="text-gray-500 text-xs">scans recorded</span>
        </div>
      ),
    },
    {
        id: "status",
        header: "Activity",
        cell: ({ row }) => {
            let statusColor = "bg-gray-100 text-gray-800";
            const statusText = getScanActivityLabel(row.original.count);

            if (statusText === "High Activity") {
                statusColor = "bg-green-100 text-green-800";
            } else if (statusText === "Moderate Activity") {
                statusColor = "bg-yellow-100 text-yellow-800";
            }

            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                    {statusText}
                </span>
            );
        }
    }
  ]
}
