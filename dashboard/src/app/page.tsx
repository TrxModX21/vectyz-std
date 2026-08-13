import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentSalesActivity } from "@/components/dashboard/recent-activity";
import { WidgetTraffic } from "@/components/dashboard/widget-traffic";
import { WidgetGeoSessions } from "@/components/dashboard/widget-geo-sessions";
import { WidgetTopItems } from "@/components/dashboard/widget-top-items";
import { WidgetTopContributors } from "@/components/dashboard/widget-top-contributors";
import OverviewStats from "@/components/dashboard/overview-stats";
import PageHeader from "@/components/dashboard/page-header";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Page header */}
      <PageHeader />

      {/* Stat Cards Grid */}
      <OverviewStats />

      {/* Widget Charts Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <WidgetTraffic className="col-span-1" />
        <WidgetGeoSessions className="col-span-2" />
        {/* <WidgetTeamProgress /> */}
      </div>

      {/* Chart Area */}
      {/* <div className="mt-6">
        <ChartPlaceholder />
      </div> */}

      {/* Top Items Section */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <WidgetTopItems tier="free" title="Top Free Assets" />
        <WidgetTopItems tier="premium" title="Top Premium Assets" />
        <WidgetTopContributors />
      </div>

      {/* Bottom Section: Activity + Quick Actions */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentSalesActivity />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  );
}
