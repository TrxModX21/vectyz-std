import FadeIn from "@/components/common/fade-in";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, DollarSign, TrendingUp } from "lucide-react";

const EarningsPage = () => {
  return (
    <FadeIn>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Earnings & Payouts</h1>
          <p className="text-muted-foreground">
            Track your revenue and withdrawal history.
          </p>
        </div>
        <Button>Request Payout</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,240.50</div>
            <p className="text-xs text-muted-foreground">
              Available for withdrawal
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$420.50</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payout</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mar 01, 2026</div>
            <p className="text-xs text-muted-foreground">Estimated</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent earnings and payouts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  Monthly Earnings - Jan
                </TableCell>
                <TableCell>Credit</TableCell>
                <TableCell>Feb 01, 2026</TableCell>
                <TableCell className="text-right text-green-600">
                  +$420.50
                </TableCell>
                <TableCell className="text-right">Completed</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Withdrawal to PayPal
                </TableCell>
                <TableCell>Payout</TableCell>
                <TableCell>Jan 15, 2026</TableCell>
                <TableCell className="text-right text-foreground">
                  -$800.00
                </TableCell>
                <TableCell className="text-right">Completed</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Monthly Earnings - Dec
                </TableCell>
                <TableCell>Credit</TableCell>
                <TableCell>Jan 01, 2026</TableCell>
                <TableCell className="text-right text-green-600">
                  +$380.00
                </TableCell>
                <TableCell className="text-right">Completed</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </FadeIn>
  );
};

export default EarningsPage;
