import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SeoSettingsView } from "@/components/dashboard/blog/seo-settings-view";

export default function BlogSettingsPage() {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl tracking-[2px] mb-1 text-cyber-heading font-heading">Blog Settings</h2>
          <p className="text-[13px] text-cyber-body">
            Global SEO configuration, defaults, and media settings.
          </p>
        </div>
      </div>
      <div className="w-full">
        <SeoSettingsView />
      </div>
    </DashboardLayout>
  );
}
