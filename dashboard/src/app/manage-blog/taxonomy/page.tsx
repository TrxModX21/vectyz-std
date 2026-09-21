import { DashboardLayout } from "@/components/layout/dashboard-layout";
import CategoriesCard from "@/components/manage-blog/categories-card";
import TagsCard from "@/components/manage-blog/tags-card";

export default function TaxonomyPage() {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl tracking-[2px] mb-1 text-cyber-heading font-heading">
            Blog Taxonomy
          </h2>
          <p className="text-[13px] text-cyber-body">
            Manage your blog categories and tags.
          </p>
        </div>
      </div>
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Categories Card */}
          <CategoriesCard />

          {/* Tags Card */}
          <TagsCard />
        </div>
      </div>
    </DashboardLayout>
  );
}
