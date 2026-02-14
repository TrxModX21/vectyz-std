import { Row } from "@tanstack/react-table";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { IconDotsVertical } from "@tabler/icons-react";
import { useState } from "react";
import BanConfirmationDialog from "./ban-confirmation-dialog";

const AllUserTableAction = ({ row }: { row: Row<User> }) => {
  const { id, banned, name } = row.original;
  const [showBanDialog, setShowBanDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="min-w-32 max-w-60">
          <DropdownMenuItem asChild>
            <Link href={`/manage-users/${id}`}>Details</Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant={banned ? "default" : "destructive"}
            onClick={() => setShowBanDialog(true)}
          >
            {banned ? "Unban Member" : "Ban Member"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BanConfirmationDialog
        open={showBanDialog}
        onOpenChange={setShowBanDialog}
        id={id}
        banned={banned}
        name={name}
      />
    </>
  );
};

export default AllUserTableAction;
