import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TaxonomyView } from "@/components/dashboard/blog/taxonomy-view";

export default function TaxonomyPage() {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl tracking-[2px] mb-1 text-cyber-heading font-heading">Blog Taxonomy</h2>
          <p className="text-[13px] text-cyber-body">
            Manage your blog categories and tags.
          </p>
        </div>
      </div>
      <div className="w-full">
        <TaxonomyView />
      </div>
    </DashboardLayout>
  );
}
