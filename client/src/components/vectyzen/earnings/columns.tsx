import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { TransactionHistoryItem } from "../../../../types/earning";

export const columns: ColumnDef<TransactionHistoryItem>[] = [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const type = row.original.type;
      const stockTitle = row.original.stock?.title;
      const userName = row.original.user?.name;

      let description = "Transaction";

      switch (type) {
        case "EARNING_ASSET":
          description = `Direct Sale: ${stockTitle || "Asset"}`;
          break;
        case "POOL_EARNING":
          description = "Monthly Pool Share";
          break;
        case "DONATION":
          description = `Donation from ${userName || "User"}`;
          break;
        case "WITHDRAWAL":
          description = "Withdrawal to Bank Account";
          break;
      }

      return <span className="font-medium">{description}</span>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      let label = "Unknown";
      let variant: "default" | "secondary" | "outline" | "destructive" =
        "default";

      switch (type) {
        case "EARNING_ASSET":
        case "POOL_EARNING":
        case "DONATION":
          label = "Credit";
          variant = "secondary";
          break;
        case "WITHDRAWAL":
          label = "Payout";
          variant = "outline";
          break;
      }

      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const formatted = format(
        new Date(row.original.createdAt),
        "MMM dd, yyyy",
      );
      return <span className="text-muted-foreground">{formatted}</span>;
    },
  },
  {
    accessorKey: "creditAmount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = Number(row.original.creditAmount);
      const isPositive = amount > 0;

      return (
        <div
          className={`text-right font-medium ${isPositive ? "text-green-600" : "text-foreground"}`}
        >
          {isPositive ? "+" : ""}
          {amount.toFixed(2)} CR
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="text-right capitalize text-muted-foreground">
          {status.toLowerCase()}
        </div>
      );
    },
  },
];
