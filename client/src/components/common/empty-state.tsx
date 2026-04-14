import { ReactNode } from "react";
import FadeIn from "./fade-in";
import { cn } from "@/lib/utils";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  backgroundText?: string;
  className?: string;
  fullPage?: boolean;
}

const EmptyState = ({
  icon,
  title = "No Content Yet",
  description = "Sorry, it looks like there is no data or content to display here right now.",
  action,
  backgroundText = "EMPTY",
  className,
  fullPage = false,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 text-center",
        fullPage ? "min-h-[70vh] mt-8" : "py-16 md:py-24",
        className,
      )}
    >
      <FadeIn className="max-w-2xl w-full flex flex-col items-center">
        <div className="relative mb-10 flex justify-center w-full">
          {/* Subtle Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-tr from-muted to-muted/20 dark:from-muted/20 dark:to-transparent blur-[80px] rounded-full -z-10" />

          {/* Background Big Text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-[100px] md:text-[160px] tracking-widest text-foreground/5 dark:text-foreground/5 z-0 select-none whitespace-nowrap pointer-events-none">
            {backgroundText}
          </div>

          {/* Icon Container */}
          <div className="flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-background/50 backdrop-blur-sm border border-border shadow-xl shadow-foreground/5 relative z-10 mx-auto">
            {icon ? (
              icon
            ) : (
              <FolderOpen
                className="w-10 h-10 md:w-14 md:h-14 text-muted-foreground"
                strokeWidth={1.5}
              />
            )}
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-foreground">
          {title}
        </h2>

        <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed max-w-lg mx-auto">
          {description}
        </p>

        {action && (
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            {action}
          </div>
        )}
      </FadeIn>
    </div>
  );
};

export default EmptyState;
