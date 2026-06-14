"use client";

import FadeIn from "@/components/common/fade-in";
import TopUpDialog from "@/components/common/top-up-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Crown,
  DollarSign,
  Download,
  MoreHorizontal,
  PieChart,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetDashboardAnalytics } from "@/hooks/use-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

const downloadChartConfig = {
  downloads: {
    label: "Downloads",
    color: "var(--color-chart-1)",
  },
};

const earningChartConfig = {
  earnings: {
    label: "Earnings (Credits)",
    color: "var(--color-chart-2)",
  },
};

const DashboardPage = () => {
  const { data, isLoading, isError } = useGetDashboardAnalytics();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Failed to load dashboard data.</p>
      </div>
    );
  }

  const { overview, charts, recentActivities } = data;

  return (
    <FadeIn>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/vectyzen/create-stock">
          <Button>
            <Upload className="mr-2 h-4 w-4" /> Upload New Asset
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Credits
            </CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.credits}</div>
            <div className="mt-2 text-xs text-muted-foreground">
              <TopUpDialog>
                <span className="text-primary font-medium cursor-pointer hover:underline">
                  Top up now
                </span>
              </TopUpDialog>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Crown className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {overview.plan.name}
              {overview.plan.name !== "Free" && (
                <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider font-bold">
                  PRO
                </span>
              )}
            </div>
            {overview.plan.renewalDate ? (
              <p className="text-xs text-muted-foreground mt-2">
                Renews on{" "}
                <span className="font-medium text-foreground">
                  {new Date(overview.plan.renewalDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </p>
            ) : (
               <p className="text-xs text-muted-foreground mt-2">
                Lifetime Access
              </p>
            )}
          </CardContent>
        </Card>
        <StatsCard
          title="Total Earnings"
          value={`${overview.stats.earnings.current.totalCredits} Credits`}
          subValue={`≈ Rp ${overview.stats.earnings.current.fiat.IDR.toLocaleString("id-ID")} / $${overview.stats.earnings.current.fiat.USD.toFixed(2)}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          change={`${overview.stats.earnings.changePercent >= 0 ? "+" : ""}${overview.stats.earnings.changePercent}%`}
          isChangePositive={overview.stats.earnings.changePercent >= 0}
        />
        <StatsCard
          title="Total Downloads"
          value={overview.stats.downloads.current.toLocaleString("id-ID")}
          icon={<Download className="h-4 w-4 text-muted-foreground" />}
          change={`${overview.stats.downloads.changePercent >= 0 ? "+" : ""}${overview.stats.downloads.changePercent}%`}
          isChangePositive={overview.stats.downloads.changePercent >= 0}
        />
        <StatsCard
          title="Active Assets"
          value={overview.stats.activeAssets.current.toLocaleString("id-ID")}
          icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
          change={`${overview.stats.activeAssets.changeValue >= 0 ? "+" : ""}${overview.stats.activeAssets.changeValue}`}
          isChangePositive={overview.stats.activeAssets.changeValue >= 0}
        />
        <StatsCard
          title="Profile Views"
          value={overview.stats.profileViews.current.toLocaleString("id-ID")}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          change={`${overview.stats.profileViews.changePercent >= 0 ? "+" : ""}${overview.stats.profileViews.changePercent}%`}
          isChangePositive={overview.stats.profileViews.changePercent >= 0}
        />
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Download Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={downloadChartConfig}
                className="h-[300px] w-full"
              >
                <AreaChart
                  data={charts.downloads}
                  margin={{ left: 12, right: 12, top: 12, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey="downloads"
                    type="natural"
                    fill="var(--color-chart-1)"
                    fillOpacity={0.4}
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Earnings Summary (Credits)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={earningChartConfig}
                className="h-[300px] w-full"
              >
                <BarChart
                  data={charts.earnings}
                  margin={{ left: 12, right: 12, top: 12, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Bar
                    dataKey="earnings"
                    fill="var(--color-chart-2)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Zap className="h-8 w-8 mb-4 opacity-20" />
                <p>No recent activity yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity, i) => (
                  <div
                    key={activity.id + i}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${activity.type === "DOWNLOAD" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}
                      >
                        {activity.type === "DOWNLOAD" ? (
                          <Download className="h-4 w-4" />
                        ) : (
                          <DollarSign className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-[150px]" title={activity.description}>
                          {activity.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FadeIn>
  );
};

function StatsCard({
  title,
  value,
  subValue,
  icon,
  change,
  isChangePositive,
}: {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  change: string;
  isChangePositive: boolean;
}) {
  return (
    <Card className="hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subValue ? (
          <p className="text-xs text-muted-foreground mt-1">
            {subValue}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-2">
            <span className={`font-medium ${isChangePositive ? "text-green-500" : "text-red-500"}`}>{change}</span> from last
            month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-1">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
