import { useMySessions } from "@/features/session/queries";

const PageHeader = () => {
  const { data, isLoading } = useMySessions();
  const user = data?.data;

  return (
    <div className="mb-8">
      <h2 className="text-2xl tracking-[2px] mb-1">Manage Filetypes</h2>
      <p className="text-[13px] text-cyber-body">
        Welcome back,{" "}
        {isLoading ? (
          <span className="h-4 w-24 bg-cyber-body/30 rounded-sm animate-pulse inline-block" />
        ) : (
          <span className="font-medium text-cyber-heading">{user?.name}</span>
        )}
        . Here&apos;s you can manage filetypes for Vectolio.
      </p>
    </div>
  );
};

export default PageHeader;
