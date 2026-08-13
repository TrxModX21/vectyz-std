import { CustomDialog } from "@/components/common/dialog";
import { toast } from "@/components/uitripled/notification-center-shadcnui";
import { useMySessions } from "@/features/session/queries";
import { signOut } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const UserProfileBlock = () => {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  const { data: sessionResponse, isLoading: sessionLoading } = useMySessions();
  const user = sessionResponse?.data;

  if (sessionLoading) {
    return <UserProfileBlockSkeleton />;
  }

  const handleLogout = async () => {
    setIsPending(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          setOpen(false);
          //   toast.success("Logout berhasil!");
          router.replace("/");
          router.refresh();
        },
        onError: (ctx) => {
          setOpen(false);
          toast.error(
            ctx.error.message || "Something went wrong, try again later!",
          );
        },
      },
    });
    setIsPending(false);
  };

  return (
    <div className="flex flex-col items-center px-4 pt-8 pb-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-cyber-border">
        <Image
          src={user?.image || "/icon.png"}
          alt="User avatar"
          fill
          sizes="80px"
          loading="eager"
          className="object-cover"
        />
      </div>
      <p className="mt-3 text-sm font-semibold text-cyber-heading">
        {user?.name}
      </p>
      <p className="text-xs text-cyber-body-subtle">{user?.email}</p>

      <CustomDialog
        open={open}
        onOpenChange={setOpen}
        isLoading={isPending || sessionLoading}
        title="Confirm Logout"
        description="This will end your current session and you will need to log in again to access your account."
        cancelText="Cancel"
        confirmText="Logout"
        destructive={true}
        onCancel={() => setOpen(false)}
        onConfirm={handleLogout}
        trigger={
          <button
            onClick={() => setOpen(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-all duration-150 ease-out clip-button border-cyber-border text-cyber-body bg-transparent hover:bg-cyber-surface-hover hover:text-cyber-heading"
          >
            <LogOut size={14} />
            Logout
          </button>
        }
      />
    </div>
  );
};

const UserProfileBlockSkeleton = () => {
  return (
    <div className="flex flex-col items-center px-4 pt-8 pb-4">
      {/* Avatar Skeleton */}
      <div className="h-20 w-20 rounded-full border-2 border-cyber-border bg-cyber-body/30 animate-pulse" />
      
      {/* Name Skeleton */}
      <div className="mt-3 h-5 w-28 bg-cyber-body/30 animate-pulse" />
      
      {/* Email Skeleton */}
      <div className="mt-2 h-3 w-36 bg-cyber-body/20 animate-pulse" />

      {/* Button Skeleton */}
      <div className="mt-3 w-full h-[34px] border border-cyber-border bg-cyber-border/20 animate-pulse clip-button" />
    </div>
  );
};

export default UserProfileBlock;
