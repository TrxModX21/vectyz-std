"use client";

import { Loader } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (val: boolean) => void;
};

const LogoutDialog = ({ open, onOpenChange }: Props) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          onOpenChange(false);
          toast.success("Logout berhasil!");
          router.replace("/");
          router.refresh();
        },
        onError: (ctx) => {
          onOpenChange(false);
          toast.error(ctx.error.message || "Logout gagal, coba lagi");
        },
      },
    });
    setIsPending(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to log out?</DialogTitle>
          <DialogDescription>
            This will end your current session and you will need to log in again
            to access your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button disabled={isPending} type="button" onClick={handleLogout}>
            {isPending && <Loader className="animate-spin mr-2" />}
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialog;
