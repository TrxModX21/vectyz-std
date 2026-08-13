"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export interface CustomDialogProps {
  /** The trigger element to open the dialog, e.g. a Button */
  trigger?: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Controlled open state change handler */
  onOpenChange?: (open: boolean) => void;
  /** Title of the dialog */
  title: string;
  /** Optional description beneath the title */
  description?: string;
  /** Main body content of the dialog */
  children?: ReactNode;
  /** Label for the cancel button. Defaults to "Cancel" */
  cancelText?: string;
  /** Handler for the cancel button */
  onCancel?: () => void;
  /** Label for the confirm/action button. Defaults to "Confirm" */
  confirmText?: string;
  /** Handler for the confirm/action button */
  onConfirm?: () => void;
  /** If true, the action button uses a destructive red cyberpunk style */
  destructive?: boolean;
  /** Optional max width container class, e.g. "sm:max-w-md", "sm:max-w-lg" */
  maxWidth?: string;
  isLoading?: boolean;
}

export function CustomDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  children,
  cancelText = "Cancel",
  onCancel,
  confirmText = "Confirm",
  onConfirm,
  destructive = false,
  maxWidth = "sm:max-w-md",
  isLoading = false,
}: CustomDialogProps) {
  // Wrap onCancel if the dialog is uncontrolled but we still want the cancel button to close it.
  // Actually, Shadcn Dialog handles its own close state internally if uncontrolled,
  // but clicking Cancel should ideally close it. The easiest way is to use DialogClose if we don't
  // want to force it to be completely controlled. But for a generic dialog, developers usually control it.

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className={maxWidth}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children && (
          <div className="px-5 py-6 space-y-6 text-[15px] leading-relaxed text-cyber-body">
            {children}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            disabled={isLoading}
            onClick={() => {
              if (onCancel) onCancel();
              else if (onOpenChange) onOpenChange(false);
            }}
            className="text-cyber-body-subtle hover:text-cyber-heading"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={
              destructive
                ? "glow-neon-red clip-button bg-[#FF003C] text-white hover:bg-[#FF003C]/80 shadow-[0_0_15px_rgba(255,0,60,0.4)] border border-[#FF003C]/50"
                : "glow-neon clip-button bg-[#54EAFD] text-[#04040A] hover:bg-neon-strong shadow-[0_0_15px_rgba(84,234,253,0.3)] border border-[#54EAFD]/50"
            }
          >
            {isLoading && <Loader className="animate-spin mr-2" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
