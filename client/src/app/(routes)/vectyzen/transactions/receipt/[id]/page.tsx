"use client";

import { useGetTransactionDetail } from "@/hooks/use-transactions";
import { format } from "date-fns";
import { Loader2, Printer } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const ReceiptPage = () => {
  const params = useParams();
  const transactionId = params.id as string;
  const { data: transaction, isLoading } = useGetTransactionDetail(transactionId);
  const [readyToPrint, setReadyToPrint] = useState(false);

  useEffect(() => {
    if (transaction && !isLoading) {
      // Delay sedikit agar gambar/font termuat
      const timer = setTimeout(() => {
        setReadyToPrint(true);
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [transaction, isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Preparing receipt...</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Transaction not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans print:bg-white print:p-0">
      {/* Tombol Print Manual (Tersembunyi saat di-print) */}
      <div className="max-w-2xl mx-auto mb-8 flex justify-end print:hidden">
        <Button onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" />
          Print Receipt
        </Button>
      </div>

      <div className="max-w-2xl mx-auto bg-white border rounded-xl p-8 shadow-sm print:border-none print:shadow-none print:rounded-none">
        {/* Header Resi */}
        <div className="flex justify-between items-start border-b pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">Vectolio</h1>
            <p className="text-gray-500 text-sm mt-1">Payment Receipt</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-black">Receipt No.</p>
            <p className="text-gray-600 font-mono text-sm mt-1 uppercase">
              {transaction.id.split("-")[0]}
            </p>
          </div>
        </div>

        {/* Info Transaksi */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-sm text-gray-500 font-medium">Billed To</p>
            <p className="font-semibold text-black mt-1">{transaction.user?.name}</p>
            <p className="text-sm text-gray-600">{transaction.user?.email}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 font-medium">Payment Date</p>
            <p className="font-semibold text-black mt-1">
              {format(new Date(transaction.createdAt), "MMMM dd, yyyy HH:mm")}
            </p>
            <p className="text-sm text-gray-500 font-medium mt-4">Payment Method</p>
            <p className="font-semibold text-black mt-1 uppercase">
              {(transaction.paymentMethod || "System").replace(/_/g, " ")}
            </p>
          </div>
        </div>

        {/* Tabel Item */}
        <div className="mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 font-semibold text-gray-600">Description</th>
                <th className="py-3 font-semibold text-gray-600 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4">
                  <p className="font-medium text-black">
                    {transaction.type === "TOPUP_CREDIT" && "Wallet Top Up"}
                    {transaction.type === "SUBSCRIPTION" && `Subscribe: ${transaction.plan?.name}`}
                    {transaction.type === "BUY_ASSET" && `Purchase: ${transaction.stock?.title}`}
                    {transaction.type === "DONATION" && "Give Coffee / Donation"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Ref: {transaction.externalId || transaction.snapToken || "-"}
                  </p>
                </td>
                <td className="py-4 text-right font-medium text-black">
                  {transaction.creditAmount && Number(transaction.creditAmount) < 0
                    ? `${Math.abs(Number(transaction.creditAmount)).toFixed(2)} CR`
                    : transaction.amountCurrency === "USD"
                      ? `$${(Number(transaction.amount) / 100).toFixed(2)}`
                      : `Rp ${Number(transaction.amount).toLocaleString("id-ID")}`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end mb-12">
          <div className="w-1/2">
            <div className="flex justify-between py-2 font-bold text-lg border-t-2 border-black">
              <span>Total Paid</span>
              <span>
                {transaction.creditAmount && Number(transaction.creditAmount) < 0
                  ? `${Math.abs(Number(transaction.creditAmount)).toFixed(2)} CR`
                  : transaction.amountCurrency === "USD"
                    ? `$${(Number(transaction.amount) / 100).toFixed(2)}`
                    : `Rp ${Number(transaction.amount).toLocaleString("id-ID")}`}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-12 pt-8 border-t border-gray-200">
          <p>Thank you for your transaction with Vectolio!</p>
          <p className="mt-1">If you have any questions, please contact support@vectolio.com</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
