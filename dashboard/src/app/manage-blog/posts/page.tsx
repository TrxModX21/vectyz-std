import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BlogPostsTable } from "@/components/dashboard/blog/posts-table";

export default function BlogPostsPage() {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl tracking-[2px] mb-1">Blog Posts</h2>
          <p className="text-[13px] text-cyber-body">
            Manage your articles, drafts, and scheduled posts.
          </p>
        </div>
      </div>
      <div className="w-full">
        <BlogPostsTable />
      </div>
    </DashboardLayout>
  );
}
