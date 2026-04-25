"use client"

import { useState } from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageSizeOptions?: number[]
  defaultPageSize?: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSizeOptions = [10, 20, 30, 50],
  defaultPageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const totalRows = table.getPrePaginationRowModel().rows.length
  const currentRows = table.getRowModel().rows.length
  const safePageCount = Math.max(table.getPageCount(), 1)
  const startRow =
    totalRows === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1
  const endRow = totalRows === 0 ? 0 : startRow + currentRows - 1

  const getSortIcon = (columnId: string) => {
    const columnSort = sorting.find(s => s.id === columnId)
    if (!columnSort) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-gray-400" />
    return columnSort.desc 
      ? <ArrowDown className="ml-1 h-3.5 w-3.5 text-brand-600" />
      : <ArrowUp className="ml-1 h-3.5 w-3.5 text-brand-600" />
  }

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="group relative overflow-visible rounded-2xl bg-white shadow-theme-md transition-all duration-500 hover:shadow-theme-xl">
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, #346739 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-25/30 via-transparent to-blue-light-25/20" />
        
        {/* Borders */}
        <div className="absolute inset-0 rounded-2xl border-2 border-brand-200/40" />
        <div className="absolute inset-0.5 rounded-[14px] border border-brand-200/60" />
        
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 via-brand-400 to-brand-300 rounded-t-2xl" />
        
        {/* Decorative glows */}
        <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-brand-200/20 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-20 w-20 rounded-full bg-blue-light-200/20 blur-2xl" />

        <div className="relative">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow 
                  key={headerGroup.id} 
                  className="border-b-2 border-brand-200/60 bg-gradient-to-r from-brand-25/70 via-brand-25/40 to-transparent hover:bg-transparent"
                >
                  {headerGroup.headers.map((header) => {
                    const isSortable = header.column.getCanSort()
                    return (
                      <TableHead
                        key={header.id}
                        onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                        className={`
                          px-5 py-4 text-sm font-semibold tracking-wide text-brand-800
                          ${isSortable ? 'cursor-pointer select-none hover:text-brand-900' : ''}
                        `}
                      >
                        <div className="flex items-center">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {isSortable && getSortIcon(header.column.id)}
                        </div>
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`
                      group/row relative border-b border-brand-100/40 transition-all duration-200
                      hover:bg-gradient-to-r hover:from-brand-25/60 hover:to-transparent
                      ${index % 2 === 0 ? 'bg-white' : 'bg-brand-25/15'}
                    `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-5 py-4 text-gray-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="rounded-full bg-brand-50 p-3">
                        <svg className="h-6 w-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <p className="text-base font-medium text-gray-500">No items found</p>
                      <p className="text-sm text-gray-400">Try adjusting your filters or add new items</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 border border-brand-200">
            <span className="text-sm font-bold text-brand-700">{totalRows}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">
            {totalRows > 0
              ? `Showing ${startRow}-${endRow} of ${totalRows} entries`
              : "No entries to display"}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600">Rows per page</label>
            <div className="relative">
              <select
                value={pagination.pageSize}
                onChange={(event) => table.setPageSize(Number(event.target.value))}
                className="h-9 appearance-none rounded-lg border-2 border-brand-200 bg-white py-1.5 pl-3 pr-8 text-sm font-medium text-gray-700 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg className="h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-8 items-center rounded-lg border border-brand-200 bg-brand-25/50 px-3">
              <span className="text-sm font-semibold text-brand-700">{pagination.pageIndex + 1}</span>
              <span className="mx-1 text-brand-300">/</span>
              <span className="text-sm font-medium text-gray-500">{safePageCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="First page"
              className="group flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-200 bg-white text-brand-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:shadow-sm disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-brand-200"
            >
              <ChevronFirst className="h-4 w-4 transition-transform group-hover:scale-110" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
              className="group flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-200 bg-white text-brand-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:shadow-sm disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-brand-200"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </button>
            
            {/* Quick page numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, safePageCount) }, (_, i) => {
                let pageNum: number
                if (safePageCount <= 5) {
                  pageNum = i
                } else if (pagination.pageIndex < 3) {
                  pageNum = i
                } else if (pagination.pageIndex > safePageCount - 4) {
                  pageNum = safePageCount - 5 + i
                } else {
                  pageNum = pagination.pageIndex - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => table.setPageIndex(pageNum)}
                    className={`
                      flex h-9 w-9 items-center justify-center rounded-lg border-2 text-sm font-medium transition-all
                      ${pageNum === pagination.pageIndex
                        ? 'border-brand-500 bg-brand-500 text-white shadow-md'
                        : 'border-brand-200 bg-white text-brand-700 hover:border-brand-300 hover:bg-brand-50'
                      }
                    `}
                  >
                    {pageNum + 1}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
              className="group flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-200 bg-white text-brand-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:shadow-sm disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-brand-200"
            >
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => table.setPageIndex(safePageCount - 1)}
              disabled={!table.getCanNextPage()}
              aria-label="Last page"
              className="group flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-200 bg-white text-brand-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:shadow-sm disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-brand-200"
            >
              <ChevronLast className="h-4 w-4 transition-transform group-hover:scale-110" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
