"use client";

import FadeIn from "@/components/common/fade-in";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Download,
  Loader2,
  RefreshCcw,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useGetUserTransactions } from "@/hooks/use-transactions";
import { TransactionItem } from "../../../../../types/transaction";
import { format } from "date-fns";

const TransactionsPage = () => {
  const [filter, setFilter] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionItem | null>(null);
  const [open, setOpen] = useState(false);

  // You can also add pagination state here if you want
  const { data: response, isLoading } = useGetUserTransactions({
    limit: 50, // Get last 50 transactions for now
    type: filter === "all" ? undefined : filter,
  });

  const transactions = response?.transactions || [];

  const handleRowClick = (txn: TransactionItem) => {
    setSelectedTransaction(txn);
    setOpen(true);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "TOPUP_CREDIT":
      case "EARNING_ASSET":
      case "POOL_EARNING":
      case "DONATION": // assuming donation received
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case "WITHDRAWAL":
        return <ArrowUpRight className="h-4 w-4 text-orange-500" />;
      case "SUBSCRIPTION":
        return <RefreshCcw className="h-4 w-4 text-blue-500" />;
      case "BUY_ASSET":
        return <Download className="h-4 w-4 text-purple-500" />;
      default:
        return <CreditCard className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "TOPUP_CREDIT":
        return "Top Up Credits";
      case "WITHDRAWAL":
        return "Withdrawal";
      case "SUBSCRIPTION":
        return "Subscribe Plan";
      case "BUY_ASSET":
        return "Buy Stock";
      case "EARNING_ASSET":
        return "Direct Sale";
      case "POOL_EARNING":
        return "Pool Share";
      case "DONATION":
        return "Donation";
      default:
        return type;
    }
  };

  const getDesc = (txn: TransactionItem) => {
    switch (txn.type) {
      case "TOPUP_CREDIT":
        return "Wallet Top Up";
      case "WITHDRAWAL":
        return "Payout to Bank Account";
      case "SUBSCRIPTION":
        return `Subscribe: ${txn.plan?.name || "Premium"}`;
      case "BUY_ASSET":
        return `Purchase: ${txn.stock?.title || "Asset"}`;
      case "EARNING_ASSET":
        return `Sale: ${txn.stock?.title || "Asset"}`;
      case "POOL_EARNING":
        return "Monthly Pool Distribution";
      case "DONATION":
        return `Donation from ${txn.targetUser?.name || "User"}`;
      default:
        return "Transaction";
    }
  };

  const getAmountDisplay = (txn: TransactionItem) => {
    let sign = "";
    let prefix = "";
    let value = "0";

    // Income
    if (
      txn.type === "TOPUP_CREDIT" ||
      txn.type === "EARNING_ASSET" ||
      txn.type === "POOL_EARNING" ||
      txn.type === "DONATION"
    ) {
      sign = "+";
    } else {
      sign = "-"; // Expenses
    }

    if (txn.creditAmount && Number(txn.creditAmount) > 0) {
      // Transaction using credits
      value = Number(txn.creditAmount).toFixed(2);
      return { text: `${sign} ${value} CR`, isCredit: true, sign };
    } else {
      // Transaction using IDR
      prefix = "Rp ";
      value = Number(txn.amount).toLocaleString("id-ID");
      return { text: `${sign} ${prefix}${value}`, isCredit: false, sign };
    }
  };

  return (
    <FadeIn>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            History of your payments and wallet activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export CSV</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View all your incoming and outgoing transactions.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search transactions..." className="pl-8" />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="TOPUP_CREDIT">Top Up Credits</SelectItem>
                  <SelectItem value="SUBSCRIPTION">Subscribe Plan</SelectItem>
                  <SelectItem value="BUY_ASSET">Buy Stock</SelectItem>
                  <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                  <SelectItem value="EARNING_ASSET">Asset Sales</SelectItem>
                  <SelectItem value="DONATION">Donations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((txn: TransactionItem) => {
                    const formattedDate = format(new Date(txn.createdAt), "MMM dd, yyyy");
                    const amtInfo = getAmountDisplay(txn);

                    return (
                      <TableRow
                        key={txn.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(txn)}
                      >
                        <TableCell>
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            {getIcon(txn.type)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {getDesc(txn)}
                          <div className="text-xs text-muted-foreground md:hidden">
                            {formattedDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10">
                            {getTypeLabel(txn.type)}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {formattedDate}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                              txn.status === "PAID"
                                ? "bg-green-50 text-green-700 ring-green-600/20"
                                : txn.status === "PENDING"
                                  ? "bg-yellow-50 text-yellow-800 ring-yellow-600/20"
                                  : "bg-red-50 text-red-700 ring-red-600/20"
                            }`}
                          >
                            {txn.status === "PAID" ? "Completed" : txn.status}
                          </span>
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            amtInfo.sign === "+" ? "text-green-600" : ""
                          }`}
                        >
                          {amtInfo.text}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Transaction ID: {selectedTransaction?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg border border-dashed">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  {getIcon(selectedTransaction.type)}
                </div>
                <span
                  className={`text-2xl font-bold ${getAmountDisplay(selectedTransaction).sign === "+" ? "text-green-600" : "text-foreground"}`}
                >
                  {getAmountDisplay(selectedTransaction).text}
                </span>
                <span className="text-sm text-muted-foreground mt-1 text-center">
                  {getDesc(selectedTransaction)}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="flex items-center gap-2">
                    {selectedTransaction.status === "PAID" && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {selectedTransaction.status === "PENDING" && (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm font-medium">
                      {selectedTransaction.status === "PAID" ? "Completed" : selectedTransaction.status}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Date</span>
                  <span className="text-sm font-medium">
                    {format(new Date(selectedTransaction.createdAt), "MMM dd, yyyy HH:mm")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-medium">
                    {getTypeLabel(selectedTransaction.type)}
                  </span>
                </div>

                {selectedTransaction.paymentMethod && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">
                      Payment Method
                    </span>
                    <span className="text-sm font-medium uppercase">
                      {selectedTransaction.paymentMethod.replace(/_/g, " ")}
                    </span>
                  </div>
                )}
                
                {selectedTransaction.stock && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">
                      Item Name
                    </span>
                    <span className="text-sm font-medium truncate max-w-[200px]" title={selectedTransaction.stock.title}>
                      {selectedTransaction.stock.title}
                    </span>
                  </div>
                )}

                {selectedTransaction.plan && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">Plan</span>
                    <span className="text-sm font-medium">
                      {selectedTransaction.plan.name} {selectedTransaction.billingCycle ? `(${selectedTransaction.billingCycle})` : ""}
                    </span>
                  </div>
                )}

                {(selectedTransaction.externalId || selectedTransaction.snapToken) && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">
                      Reference No.
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium font-mono truncate max-w-[150px]" title={selectedTransaction.externalId || selectedTransaction.snapToken!}>
                        {selectedTransaction.externalId || selectedTransaction.snapToken}
                      </span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            {/* If there's a receipt, we can implement download later */}
            <Button disabled>Download Receipt</Button>
          </div>
        </DialogContent>
      </Dialog>
    </FadeIn>
  );
};

export default TransactionsPage;
