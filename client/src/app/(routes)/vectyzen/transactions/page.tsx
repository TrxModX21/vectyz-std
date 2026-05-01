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
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, Copy, CreditCard, Download, RefreshCcw, Search } from "lucide-react";
import { useState } from "react";

type TransactionType = "top_up" | "subscribe" | "buy_stock" | "withdrawal";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: string;
  date: string;
  status: "Completed" | "Processing" | "Failed";
  desc: string;
  details?: {
    method?: string;
    reference?: string;
    item_name?: string;
    license_type?: string;
    plan_name?: string;
    billing_cycle?: string;
  };
}

const transactions: Transaction[] = [
  {
    id: "TXN-001",
    type: "top_up",
    amount: "+$50.00",
    date: "Feb 14, 2026",
    status: "Completed",
    desc: "Wallet Top Up",
    details: { method: "Credit Card (**** 4242)", reference: "REF123456789" },
  },
  {
    id: "TXN-002",
    type: "buy_stock",
    amount: "-$12.50",
    date: "Feb 12, 2026",
    status: "Completed",
    desc: "Purchase: Abstract Waves",
    details: {
      item_name: "Abstract Waves Vector",
      license_type: "Standard License",
      reference: "INV-987654321",
    },
  },
  {
    id: "TXN-003",
    type: "subscribe",
    amount: "-$9.00",
    date: "Feb 01, 2026",
    status: "Completed",
    desc: "Premium Monthly Subscription",
    details: {
      plan_name: "Premium Plan",
      billing_cycle: "Monthly",
      reference: "SUB-456123789",
    },
  },
  {
    id: "TXN-004",
    type: "withdrawal",
    amount: "-$150.00",
    date: "Jan 28, 2026",
    status: "Processing",
    desc: "Payout to PayPal",
    details: {
      method: "PayPal (user@example.com)",
      reference: "PAYOUT-789456123",
    },
  },
  {
    id: "TXN-005",
    type: "buy_stock",
    amount: "-$5.00",
    date: "Jan 20, 2026",
    status: "Completed",
    desc: "Purchase: Business Icon Set",
    details: {
      item_name: "Business Icon Set",
      license_type: "Standard License",
      reference: "INV-321654987",
    },
  },
  {
    id: "TXN-006",
    type: "top_up",
    amount: "+$100.00",
    date: "Jan 15, 2026",
    status: "Completed",
    desc: "Wallet Top Up",
    details: { method: "Bank Transfer", reference: "REF987654321" },
  },
];

const TransactionsPage = () => {
  const [filter, setFilter] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [open, setOpen] = useState(false);

  const handleRowClick = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setOpen(true);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "top_up":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-orange-500" />;
      case "subscribe":
        return <RefreshCcw className="h-4 w-4 text-blue-500" />;
      case "buy_stock":
        return <Download className="h-4 w-4 text-purple-500" />;
      default:
        return <CreditCard className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "top_up":
        return "Top Up Credits";
      case "withdrawal":
        return "Withdrawal";
      case "subscribe":
        return "Subscribe Plan";
      case "buy_stock":
        return "Buy Stock";
      default:
        return type;
    }
  };

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);

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
                  <SelectItem value="top_up">Top Up Credits</SelectItem>
                  <SelectItem value="subscribe">Subscribe Plan</SelectItem>
                  <SelectItem value="buy_stock">Buy Stock</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
              {filteredTransactions.map((txn) => (
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
                    {txn.desc}
                    <div className="text-xs text-muted-foreground md:hidden">
                      {txn.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10">
                      {getTypeLabel(txn.type)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {txn.date}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        txn.status === "Completed"
                          ? "bg-green-50 text-green-700 ring-green-600/20"
                          : txn.status === "Processing"
                            ? "bg-yellow-50 text-yellow-800 ring-yellow-600/20"
                            : "bg-red-50 text-red-700 ring-red-600/20"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      txn.amount.startsWith("+") ? "text-green-600" : ""
                    }`}
                  >
                    {txn.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                  className={`text-2xl font-bold ${selectedTransaction.amount.startsWith("+") ? "text-green-600" : "text-foreground"}`}
                >
                  {selectedTransaction.amount}
                </span>
                <span className="text-sm text-muted-foreground mt-1">
                  {selectedTransaction.desc}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="flex items-center gap-2">
                    {selectedTransaction.status === "Completed" && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {selectedTransaction.status === "Processing" && (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm font-medium">
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Date</span>
                  <span className="text-sm font-medium">
                    {selectedTransaction.date}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-medium">
                    {getTypeLabel(selectedTransaction.type)}
                  </span>
                </div>

                {/* Specific Details based on type */}
                {selectedTransaction.details?.method && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">
                      Payment Method
                    </span>
                    <span className="text-sm font-medium">
                      {selectedTransaction.details.method}
                    </span>
                  </div>
                )}
                {selectedTransaction.details?.item_name && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">
                      Item Name
                    </span>
                    <span className="text-sm font-medium">
                      {selectedTransaction.details.item_name}
                    </span>
                  </div>
                )}
                {selectedTransaction.details?.plan_name && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">Plan</span>
                    <span className="text-sm font-medium">
                      {selectedTransaction.details.plan_name}
                    </span>
                  </div>
                )}

                {selectedTransaction.details?.reference && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">
                      Reference No.
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium font-mono">
                        {selectedTransaction.details.reference}
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
            <Button>Download Receipt</Button>
          </div>
        </DialogContent>
      </Dialog>
    </FadeIn>
  );
};

export default TransactionsPage;
