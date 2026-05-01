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

const downloadChartData = [
  { month: "Jan", downloads: 186 },
  { month: "Feb", downloads: 305 },
  { month: "Mar", downloads: 237 },
  { month: "Apr", downloads: 273 },
  { month: "May", downloads: 209 },
  { month: "Jun", downloads: 314 },
];

const downloadChartConfig = {
  downloads: {
    label: "Downloads",
    color: "var(--color-chart-1)",
  },
};

const earningChartData = [
  { month: "Jan", earnings: 1860 },
  { month: "Feb", earnings: 3050 },
  { month: "Mar", earnings: 2370 },
  { month: "Apr", earnings: 2730 },
  { month: "May", earnings: 2090 },
  { month: "Jun", earnings: 3140 },
];

const earningChartConfig = {
  earnings: {
    label: "Earnings",
    color: "var(--color-chart-2)",
  },
};

const DashboardPage = () => {
  return (
    <FadeIn>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/dashboard/upload">
          <Button>
            <Upload className="mr-2 h-4 w-4" /> Upload New Asset
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="hover:shadow-lg hover:-translate-y-1 hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Credits
            </CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">240</div>
            <div className="mt-2 text-xs text-muted-foreground">
              <TopUpDialog>
                <span className="text-primary font-medium cursor-pointer hover:underline">
                  Top up now
                </span>
              </TopUpDialog>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg hover:-translate-y-1 hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Crown className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              Premium
              <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider font-bold">
                PRO
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Renews on{" "}
              <span className="font-medium text-foreground">Mar 15, 2026</span>
            </p>
          </CardContent>
        </Card>
        <StatsCard
          title="Total Earnings"
          value="$420.50"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          change="+8%"
        />
        <StatsCard
          title="Total Downloads"
          value="1,294"
          icon={<Download className="h-4 w-4 text-muted-foreground" />}
          change="+12%"
        />
        <StatsCard
          title="Active Assets"
          value="34"
          icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
          change="+2"
        />
        <StatsCard
          title="Profile Views"
          value="843"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          change="+24%"
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
                  data={downloadChartData}
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
              <CardTitle>Earnings Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={earningChartConfig}
                className="h-[300px] w-full"
              >
                <BarChart
                  data={earningChartData}
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
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${i % 2 === 0 ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}
                    >
                      {i % 2 === 0 ? (
                        <Download className="h-4 w-4" />
                      ) : (
                        <DollarSign className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {i % 2 === 0 ? "Asset Downloaded" : "Sale Completed"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </FadeIn>
  );
};

function StatsCard({
  title,
  value,
  icon,
  change,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
}) {
  return (
    <Card className="hover:shadow-lg hover:-translate-y-1 hover:border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-green-500 font-medium">{change}</span> from last
          month
        </p>
      </CardContent>
    </Card>
  );
}

export default DashboardPage;
