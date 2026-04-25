"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/tables/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import Badge from "@/components/ui/badge/Badge";
import {
    Activity,
    CheckCircle2,
    AlertCircle,
    Clock,
    Terminal,
    ArrowUpRight,
    BarChart3,
    Calendar,
    User,
    Globe,
    Layout
} from "lucide-react";
import { reportApis } from "@/utils/api/api";
import { Filter, FilterField } from "@/components/common/Filter";
import { TableLoader } from "@/components/table-loader/table-loader";

interface LogSummaryData {
    method: string;
    statusCode: number;
    count: number;
    avgDurationMs: number;
}

interface RawLogData {
    id: number;
    method: string;
    endpoint: string;
    userId: string | null;
    statusCode: number;
    durationMs: number | null;
    createdAt: string;
}

export default function LogReportPage() {
    const [summaryData, setSummaryData] = useState<LogSummaryData[]>([]);
    const [rawLogs, setRawLogs] = useState<RawLogData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFiltered, setIsFiltered] = useState(false);
    const [filters, setFilters] = useState<Record<string, any>>({});

    const fetchData = useCallback(async (currentFilters: Record<string, any>) => {
        setIsLoading(true);
        try {
            // Check if any filter is actually set (excluding page/limit if they are defaults)
            const activeFilters = Object.entries(currentFilters).filter(([key, value]) =>
                value !== "" && value !== undefined && value !== null
            );

            const hasActiveFilters = activeFilters.length > 0;
            setIsFiltered(hasActiveFilters);

            if (hasActiveFilters) {
                const response = await reportApis.getLogReportFiltered(currentFilters);
                // The backend returns { success: true, data: { total, rows, ... } }
                setRawLogs(response.data?.rows || []);
            } else {
                const response = await reportApis.getLogReports();
                // The backend returns { success: true, data: [...] }
                setSummaryData(response.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(filters);
    }, [filters, fetchData]);

    const stats = useMemo(() => {
        if (!isFiltered) {
            const totalRequests = summaryData.reduce((acc, curr) => acc + curr.count, 0);
            const successRequests = summaryData.filter(l => l.statusCode >= 200 && l.statusCode < 300)
                .reduce((acc, curr) => acc + curr.count, 0);
            const errorRequests = summaryData.filter(l => l.statusCode >= 400)
                .reduce((acc, curr) => acc + curr.count, 0);
            const totalDuration = summaryData.reduce((acc, curr) => acc + (curr.avgDurationMs * curr.count), 0);
            const avgDuration = totalRequests > 0 ? Math.round(totalDuration / totalRequests) : 0;
            const successRate = totalRequests > 0 ? (successRequests / totalRequests) * 100 : 0;

            return {
                totalRequests,
                successRequests,
                errorRequests,
                avgDuration,
                successRate: successRate.toFixed(1)
            };
        } else {
            const totalRequests = rawLogs.length;
            const successRequests = rawLogs.filter(l => l.statusCode >= 200 && l.statusCode < 300).length;
            const errorRequests = rawLogs.filter(l => l.statusCode >= 400).length;
            const totalDuration = rawLogs.reduce((acc, curr) => acc + (curr.durationMs || 0), 0);
            const avgDuration = totalRequests > 0 ? Math.round(totalDuration / totalRequests) : 0;
            const successRate = totalRequests > 0 ? (successRequests / totalRequests) * 100 : 0;

            return {
                totalRequests,
                successRequests,
                errorRequests,
                avgDuration,
                successRate: successRate.toFixed(1)
            };
        }
    }, [summaryData, rawLogs, isFiltered]);

    const filterFields: FilterField[] = [
        {
            id: "method",
            label: "Method",
            type: "select",
            placeholder: "All Methods",
            options: [
                { value: "GET", label: "GET" },
                { value: "POST", label: "POST" },
                { value: "PUT", label: "PUT" },
                { value: "PATCH", label: "PATCH" },
                { value: "DELETE", label: "DELETE" },
            ]
        },
        {
            id: "status",
            label: "Status",
            type: "text",
            placeholder: "e.g. 200, 404"
        },
        {
            id: "endpoint",
            label: "Endpoint",
            type: "text",
            placeholder: "e.g. /plants"
        },
        {
            id: "userId",
            label: "User ID",
            type: "text",
            placeholder: "User ID"
        },
        {
            id: "from",
            label: "From",
            type: "date"
        },
        {
            id: "to",
            label: "To",
            type: "date"
        }
    ];

    const summaryColumns: ColumnDef<LogSummaryData>[] = [
        {
            accessorKey: "method",
            header: "Method",
            cell: ({ row }) => {
                const method = row.getValue("method") as string;
                let color: "primary" | "success" | "warning" | "error" | "info" = "info";

                switch (method) {
                    case "GET": color = "primary"; break;
                    case "POST": color = "success"; break;
                    case "PUT": color = "warning"; break;
                    case "PATCH": color = "warning"; break;
                    case "DELETE": color = "error"; break;
                }

                return (
                    <Badge color={color} className="font-bold px-3 py-1">
                        {method}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "statusCode",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("statusCode") as number;
                return (
                    <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${status < 300 ? "bg-success-500" : status < 500 ? "bg-warning-500" : "bg-error-500"
                            }`} />
                        <span className={`font-mono font-semibold ${status < 300 ? "text-success-700" : status < 500 ? "text-warning-700" : "text-error-700"
                            }`}>
                            {status}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "count",
            header: "Total Requests",
            cell: ({ row }) => (
                <div className="font-medium text-gray-900">
                    {(row.getValue("count") as number).toLocaleString()}
                </div>
            ),
        },
        {
            accessorKey: "avgDurationMs",
            header: "Avg Duration",
            cell: ({ row }) => {
                const duration = row.getValue("avgDurationMs") as number;
                return (
                    <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{duration.toLocaleString()}ms</span>
                    </div>
                );
            },
        },
    ];

    const rawColumns: ColumnDef<RawLogData>[] = [
        {
            accessorKey: "createdAt",
            header: "Timestamp",
            cell: ({ row }) => (
                <div className="text-xs text-gray-500 font-mono">
                    {new Date(row.getValue("createdAt")).toLocaleString()}
                </div>
            )
        },
        {
            accessorKey: "method",
            header: "Method",
            cell: ({ row }) => {
                const method = row.getValue("method") as string;
                let color: "primary" | "success" | "warning" | "error" | "info" = "info";
                switch (method) {
                    case "GET": color = "primary"; break;
                    case "POST": color = "success"; break;
                    case "PUT": color = "warning"; break;
                    case "PATCH": color = "warning"; break;
                    case "DELETE": color = "error"; break;
                }
                return <Badge color={color} className="font-bold px-2 py-0.5 text-[10px]">{method}</Badge>;
            }
        },
        {
            accessorKey: "endpoint",
            header: "Endpoint",
            cell: ({ row }) => (
                <div className="text-sm font-medium text-gray-700 truncate max-w-[200px]" title={row.getValue("endpoint")}>
                    {row.getValue("endpoint")}
                </div>
            )
        },
        {
            accessorKey: "statusCode",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("statusCode") as number;
                const color = status < 300 ? "text-success-600" : status < 500 ? "text-warning-600" : "text-error-600";
                return <span className={`font-mono font-bold ${color}`}>{status}</span>;
            }
        },
        {
            accessorKey: "userId",
            header: "User",
            cell: ({ row }) => (
                <div className="text-xs text-gray-400">
                    {row.getValue("userId") || "Guest"}
                </div>
            )
        },
        {
            accessorKey: "durationMs",
            header: "Duration",
            cell: ({ row }) => (
                <div className="text-xs text-gray-500">
                    {row.getValue("durationMs") ? `${row.getValue("durationMs")}ms` : "-"}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Terminal className="w-6 h-6 text-brand-500" />
                        API Log Report
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Traffic analysis and performance metrics for API endpoints.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Badge color="primary" className="px-4 py-2 rounded-xl border border-brand-100 bg-brand-50/50">
                        <span className="flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5" />
                            Live Monitoring
                        </span>
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <Filter
                fields={filterFields}
                onFilter={(vals) => setFilters(vals)}
                title="Log Filters"
            />

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Requests"
                    value={stats.totalRequests.toLocaleString()}
                    icon={<BarChart3 className="w-5 h-5 text-blue-500" />}
                    trend="+12.5%"
                    color="blue"
                />
                <MetricCard
                    title="Success Rate"
                    value={`${stats.successRate}%`}
                    icon={<CheckCircle2 className="w-5 h-5 text-success-500" />}
                    trend="Stable"
                    color="success"
                />
                <MetricCard
                    title="Avg Latency"
                    value={`${stats.avgDuration}ms`}
                    icon={<Clock className="w-5 h-5 text-warning-500" />}
                    trend="-45ms"
                    color="warning"
                />
                <MetricCard
                    title="Total Errors"
                    value={stats.errorRequests.toLocaleString()}
                    icon={<AlertCircle className="w-5 h-5 text-error-500" />}
                    trend="+2"
                    color="error"
                />
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl overflow-hidden min-h-[400px]">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                        {isFiltered ? (
                            <><Layout className="w-4 h-4 text-brand-500" /> Filtered Logs</>
                        ) : (
                            <><Activity className="w-4 h-4 text-brand-500" /> Request Summary</>
                        )}
                    </h2>
                    {isFiltered && !isLoading && (
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            Showing latest {rawLogs.length} matching logs
                        </span>
                    )}
                </div>

                {isLoading ? (
                    <div className="p-10">
                        <TableLoader message="Fetching log data..." />
                    </div>
                ) : (
                    <DataTable
                        columns={isFiltered ? rawColumns : summaryColumns}
                        data={isFiltered ? rawLogs : summaryData}
                    />
                )}
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, trend, color }: {
    title: string,
    value: string,
    icon: React.ReactNode,
    trend: string,
    color: 'blue' | 'success' | 'warning' | 'error'
}) {
    const colorMap = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        success: "bg-success-50 text-success-600 border-success-100",
        warning: "bg-warning-50 text-warning-600 border-warning-100",
        error: "bg-error-50 text-error-600 border-error-100"
    };

    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-theme-xs group hover:shadow-theme-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl border ${colorMap[color]}`}>
                    {icon}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-success-600 bg-success-50 px-2 py-0.5 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    {trend}
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
        </div>
    );
}
