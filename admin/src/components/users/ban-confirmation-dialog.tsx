import { useBanUser } from "@/hooks/use-users";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface BanConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  banned: boolean;
  name: string;
}

const BanConfirmationDialog = ({
  open,
  onOpenChange,
  id,
  banned,
  name,
}: BanConfirmationDialogProps) => {
  const { mutate: banUser, isPending } = useBanUser();

  const handleBanUser = () => {
    banUser(
      { userId: id },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will {banned ? "unban" : "ban"} {name || "this user"}.
            {banned
              ? " They will regain access to the platform."
              : " They will lose access to the platform immediately."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleBanUser}
            className={
              banned
                ? ""
                : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            }
          >
            {isPending ? "Processing..." : banned ? "Unban User" : "Ban User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BanConfirmationDialog;
