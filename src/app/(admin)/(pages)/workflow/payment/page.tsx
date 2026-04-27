"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardDialog } from "@/components/common/DashboardDialog";
import { DataTable } from "@/components/tables/DataTable";
import { getPaymentColumns, PaymentItem } from "@/components/tables/paymentColumns";
import { paymentApis } from "@/utils/api/api";
import { TableLoader } from "@/components/table-loader/table-loader";
import Badge from "@/components/ui/badge/Badge";
import { Filter, FilterField } from "@/components/common/Filter";

const formatDateValue = (date: string) => {
  const parsedDate = new Date(date);
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [viewingPayment, setViewingPayment] = useState<PaymentItem | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        id: "method",
        label: "Method",
        type: "select",
        options: [
          { value: "CASH", label: "Cash" },
          { value: "UPI", label: "UPI" },
          { value: "CARD", label: "Card" },
          { value: "BANK_TRANSFER", label: "Bank Transfer" },
        ],
        placeholder: "All Methods",
      },
      {
        id: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "PENDING", label: "Pending" },
          { value: "COMPLETED", label: "Completed" },
          { value: "FAILED", label: "Failed" },
          { value: "REFUNDED", label: "Refunded" },
        ],
        placeholder: "All Statuses",
      },
      {
        id: "date",
        label: "Date",
        type: "date",
        placeholder: "Select Date",
      },
    ],
    []
  );

  const fetchPayments = async () => {
    setIsPageLoading(true);
    try {
      const response = await paymentApis.getAllPayments();
      if (response.success) {
        const data = Array.isArray(response.data?.data) 
          ? response.data.data 
          : Array.isArray(response.data) 
            ? response.data 
            : [];
        setPayments(data);
      }
    } catch (error: any) {
      console.error(error);
      // alert(error.message);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const columns = useMemo(
    () =>
      getPaymentColumns({
        onView: setViewingPayment,
      }),
    []
  );

  const filteredPayments = useMemo(() => {
    const paymentsArray = Array.isArray(payments) ? payments : [];
    return paymentsArray.filter((payment) => {
      const methodMatch = !filters.method || payment.method === filters.method;
      const statusMatch = !filters.status || payment.status === filters.status;
      const paymentDate = formatDateValue(payment.createdAt);
      const dateMatch = !filters.date || paymentDate === filters.date;

      return methodMatch && statusMatch && dateMatch;
    });
  }, [payments, filters]);

  if (isPageLoading) return <TableLoader message="Loading Payments..." />;

  return (
    <div className="p-6 space-y-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">Payments</h1>
      </div>

      <Filter
        fields={filterFields}
        onFilter={setFilters}
        title="Payment Filters"
      />

      <DataTable columns={columns} data={filteredPayments} />

      <DashboardDialog
        isOpen={Boolean(viewingPayment)}
        onClose={() => setViewingPayment(null)}
        title="Payment Details"
        description="Detailed information about the selected payment."
        className="mx-4 max-w-xl p-6 sm:p-8"
      >
        {viewingPayment ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Payment ID</p>
              <p className="mt-1 font-medium text-gray-900">#{viewingPayment.id}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Order ID</p>
              <p className="mt-1 font-medium text-gray-900">#{viewingPayment.orderId}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(Number(viewingPayment.amount))}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Status</p>
              <div className="mt-1">
                <Badge
                  size="sm"
                  color={
                    viewingPayment.status === "COMPLETED" ? "success" :
                      viewingPayment.status === "PENDING" ? "warning" : "error"
                  }
                >
                  {viewingPayment.status}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Method</p>
              <p className="mt-1 font-medium text-gray-900">{viewingPayment.method.replace("_", " ")}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Reference No.</p>
              <p className="mt-1 font-medium text-gray-900">{viewingPayment.referenceNumber ?? "N/A"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Date & Time</p>
              <p className="mt-1 font-medium text-gray-900">
                {new Date(viewingPayment.createdAt).toLocaleString("en-IN", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </p>
            </div>
            {/* If there are notes, show them */}
            {(viewingPayment as any).notes && (
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Notes</p>
                <p className="mt-1 text-sm text-gray-700">{(viewingPayment as any).notes}</p>
              </div>
            )}
          </div>
        ) : null}
      </DashboardDialog>
    </div>
  );
}
