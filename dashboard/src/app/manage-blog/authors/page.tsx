import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AuthorsTable } from "@/components/dashboard/blog/authors-table";

export default function AuthorsPage() {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl tracking-[2px] mb-1 text-cyber-heading font-heading">Blog Authors</h2>
          <p className="text-[13px] text-cyber-body">
            Manage your editorial team and their roles.
          </p>
        </div>
      </div>
      <div className="w-full">
        <AuthorsTable />
      </div>
    </DashboardLayout>
  );
}
