"use client";

import FadeIn from "@/components/common/fade-in";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Loader2, TrendingUp } from "lucide-react";
import { useGetEarningsOverview, useGetEarningsHistory } from "@/hooks/use-earnings";
import { useState } from "react";
import EarningsTable from "@/components/vectyzen/earnings/earnings-table";
import PayoutDialog from "@/components/vectyzen/earnings/payout-dialog";
import { format } from "date-fns";

const EarningsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: overviewData, isLoading: isLoadingOverview } = useGetEarningsOverview();
  const { data: historyData, isLoading: isLoadingHistory } = useGetEarningsHistory({
    page,
    limit,
  });

  const overview = overviewData?.data;
  const history = historyData?.history || [];

  return (
    <FadeIn>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Earnings & Payouts</h1>
          <p className="text-muted-foreground">
            Track your revenue and withdrawal history.
          </p>
        </div>
        {overview ? (
          <PayoutDialog withdrawableBalance={overview.withdrawableBalance} />
        ) : (
          <div />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingOverview ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {overview?.totalBalance?.toFixed(2)} CR
                </div>
                <p className="text-xs text-muted-foreground">
                  ≈ Rp {(overview?.totalBalance! * 1000).toLocaleString("id-ID")}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoadingOverview ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  +{overview?.thisMonthEarnings?.toFixed(2)} CR
                </div>
                <p className="text-xs text-muted-foreground">
                  Direct Sales & Donations
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Pool Earning</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingOverview ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  +{overview?.estimatedPoolShare?.toFixed(2)} CR
                </div>
                <p className="text-xs text-muted-foreground">
                  Distributed on {overview?.nextPayoutDate ? format(new Date(overview.nextPayoutDate), "MMM dd, yyyy") : ""}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent earnings and payouts.</CardDescription>
        </CardHeader>
        <CardContent>
          <EarningsTable
            isLoading={isLoadingHistory}
            transactions={history}
            totalCount={historyData?.totalCount || 0}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onPageSizeChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </CardContent>
      </Card>
    </FadeIn>
  );
};

export default EarningsPage;
