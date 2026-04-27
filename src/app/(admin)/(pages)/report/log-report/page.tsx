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
    ip?: string;
}

export default function LogReportPage() {
    const [summaryData, setSummaryData] = useState<LogSummaryData[]>([]);
    const [rawLogs, setRawLogs] = useState<RawLogData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFiltered, setIsFiltered] = useState(false);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const handleFilter = useCallback((vals: Record<string, any>) => {
        setFilters(vals);
        setPagination((prev) => (
            prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }
        ));
    }, []);

    const fetchData = useCallback(async (currentFilters: Record<string, any>) => {
        setIsLoading(true);
        try {
            const response = await reportApis.getLogReportFiltered(currentFilters);
            // The backend returns { success: true, data: { total, rows, ... } }
            const rows = response.data?.rows || [];
            setRawLogs(rows);
            setTotalRows(response.data?.total || rows.length);
            setTotalPages(response.data?.totalPages || Math.max(1, Math.ceil((response.data?.total || rows.length) / pagination.pageSize)));

            setIsFiltered(true); // Always treat as detailed view now
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.pageSize]);

    useEffect(() => {
        fetchData({
            ...filters,
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
        });
    }, [filters, pagination.pageIndex, pagination.pageSize, fetchData]);

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

    const filterFields: FilterField[] = useMemo(() => [
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
            id: "from",
            label: "From",
            type: "date"
        },
        {
            id: "to",
            label: "To",
            type: "date"
        }
    ], []);


    const rawColumns: ColumnDef<RawLogData>[] = [
        {
            id: "slNo",
            header: "Sl No",
            cell: ({ row }) => (
                <span className="text-gray-500 font-medium">
                    {pagination.pageIndex * pagination.pageSize + row.index + 1}
                </span>
            ),
            size: 50,
        },
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
            cell: ({ row }) => {
                const endpoint = row.getValue("endpoint") as string;
                const lastWord = endpoint?.split('/').filter(Boolean).pop() || endpoint;
                return (
                    <div className="text-sm font-medium text-gray-700 truncate max-w-[200px]" title={endpoint}>
                        {lastWord}
                    </div>
                );
            }
        },
        {
            accessorKey: "ip",
            header: "IP Address",
            cell: ({ row }) => (
                <div className="text-xs text-gray-500 font-mono">
                    {row.original.ip || "-"}
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

            {/* Table Section */}
            <div className="bg-white rounded-2xl overflow-hidden min-h-[400px]">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Layout className="w-4 h-4 text-brand-500" /> API Activity Logs
                    </h2>
                    {isFiltered && !isLoading && (
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            Showing latest {rawLogs.length} matching logs
                        </span>
                    )}
                </div>
                <div className="px-6 pt-4">
                    <Filter
                        fields={filterFields}
                        onFilter={handleFilter}
                        title="Log Filters"
                    />
                </div>

                {isLoading ? (
                    <div className="p-10 pt-6">
                        <TableLoader message="Fetching log data..." />
                    </div>
                ) : (
                    <div className="pt-4">
                        <DataTable
                            columns={rawColumns}
                            data={rawLogs}
                            manualPagination={true}
                            totalCount={totalRows}
                            pageCount={totalPages}
                            pagination={pagination}
                            onPaginationChange={setPagination}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
