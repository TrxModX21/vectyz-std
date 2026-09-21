import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BlogPostsTable } from "@/components/manage-blog/posts-table";
import { Suspense } from "react";

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
        <Suspense fallback={<div className="p-4 text-center text-cyber-body-subtle">Loading posts data...</div>}>
          <BlogPostsTable />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
