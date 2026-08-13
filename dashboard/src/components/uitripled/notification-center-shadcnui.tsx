"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Info,
  LucideIcon,
  X,
} from "lucide-react";
import { useCallback, useState, useEffect } from "react";

type NotificationType = "success" | "error" | "warning" | "info";

type NotificationConfig = {
  title: string;
  message: string;
  description: string;
  action: {
    label: string;
    onClick: () => void;
  };
  icon: LucideIcon;
  toneClassName: string;
};

export type ToastProps = {
  title?: string;
  message?: string;
  description?: string;
};

type ActiveNotification = {
  id: string;
  type: NotificationType;
  props?: ToastProps;
};

// Global event emitter for toast
type ToastEvent = {
  type: NotificationType;
  props?: ToastProps | string;
  id?: string;
  action?: "create" | "update" | "remove";
};

const listeners = new Set<(event: ToastEvent) => void>();

export const toast = {
  success: (props: ToastProps | string) => {
    listeners.forEach((listener) => listener({ type: "success", props, action: "create" }));
  },
  error: (props: ToastProps | string) => {
    listeners.forEach((listener) => listener({ type: "error", props, action: "create" }));
  },
  warning: (props: ToastProps | string) => {
    listeners.forEach((listener) => listener({ type: "warning", props, action: "create" }));
  },
  info: (props: ToastProps | string) => {
    listeners.forEach((listener) => listener({ type: "info", props, action: "create" }));
  },
  loading: (props: ToastProps | string) => {
    const id = Math.random().toString(36).slice(2, 9);
    listeners.forEach((listener) => listener({ type: "info", props, id, action: "create" }));
    return id;
  },
  update: (id: string, props: ToastProps | string, type: NotificationType = "info") => {
    listeners.forEach((listener) => listener({ type, props, id, action: "update" }));
  },
  remove: (id: string) => {
    listeners.forEach((listener) => listener({ type: "info", id, action: "remove" }));
  }
};

const NOTIFICATION_CONFIGS: Record<NotificationType, NotificationConfig> = {
  success: {
    title: "Success",
    message: "Operation completed successfully",
    description: "",
    action: {
      label: "View Details",
      onClick: () => console.log("View details"),
    },
    icon: CheckCircle,
    toneClassName: "text-[#54EAFD]", // Using neon blue instead of green for cyberpunk feel
  },
  error: {
    title: "Error Occurred",
    message: "Something went wrong",
    description: "",
    action: { label: "Retry", onClick: () => console.log("Retry") },
    icon: AlertCircle,
    toneClassName: "text-[#FF003C]", // Cyberpunk red
  },
  warning: {
    title: "Warning",
    message: "Please review this action",
    description: "",
    action: { label: "Learn More", onClick: () => console.log("Learn more") },
    icon: AlertTriangle,
    toneClassName: "text-[#F5A623]",
  },
  info: {
    title: "Information",
    message: "New feature available",
    description: "",
    action: { label: "Explore", onClick: () => console.log("Explore") },
    icon: Info,
    toneClassName: "text-[#3DC8DB]",
  },
};

export function Toaster() {
  const [notifications, setNotifications] = useState<ActiveNotification[]>([]);
  const prefersReducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const handleToast = (event: ToastEvent) => {
      const id = event.id || Math.random().toString(36).slice(2, 9);

      if (event.action === "remove") {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        return;
      }

      const parsedProps =
        typeof event.props === "string"
          ? { message: event.props }
          : event.props;

      setNotifications((prev) => {
        if (event.action === "update") {
          return prev.map((n) => 
            n.id === id ? { ...n, type: event.type, props: { ...n.props, ...parsedProps } } : n
          );
        }
        return [...prev, { id, type: event.type, props: parsedProps }];
      });

      // Auto-dismiss after 5 seconds if not a loading toast (in this custom impl, we will dismiss normally unless updated)
      if (event.action === "create" && !event.id) {
        window.setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((notification) => notification.id !== id),
          );
        }, 5000);
      }
    };

    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
    };
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed left-0 right-0 top-0 z-100 p-4 sm:p-6"
    >
      <div className="pointer-events-auto mx-auto flex max-w-md flex-col gap-3">
        <AnimatePresence initial={false}>
          {notifications.map((notification) => {
            const config = NOTIFICATION_CONFIGS[notification.type];
            // Merge default config with dynamically passed props
            const mergedConfig = {
              ...config,
              title: notification.props?.title ?? config.title,
              message: notification.props?.message ?? config.message,
              description:
                notification.props?.description ?? config.description,
            };

            return (
              <NotificationBar
                key={notification.id}
                config={mergedConfig}
                type={notification.type}
                notificationId={notification.id}
                onDismiss={() => removeNotification(notification.id)}
                prefersReducedMotion={prefersReducedMotion}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

type NotificationBarProps = {
  config: NotificationConfig;
  type: NotificationType;
  notificationId: string;
  onDismiss: () => void;
  prefersReducedMotion: boolean;
};

function NotificationBar({
  config,
  type,
  notificationId,
  onDismiss,
  prefersReducedMotion,
}: NotificationBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    action,
    description,
    icon: Icon,
    message,
    title,
    toneClassName,
  } = config;

  return (
    <motion.div
      role="listitem"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: "easeOut" }}
    >
      <Card className="flex flex-row items-start gap-3 rounded-sm border border-cyber-border bg-cyber-surface-raised clip-card p-4 backdrop-blur-md shadow-[0_0_15px_rgba(84,234,253,0.05)]">
        <div
          aria-hidden="true"
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center bg-cyber-surface border border-cyber-border-subtle",
            toneClassName,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="text-[12px] font-heading font-medium tracking-widest text-cyber-heading uppercase">
                {title}
              </div>
              <p className="text-[13px] mt-0.5 text-cyber-body">{message}</p>
            </div>
            {description && (
              <motion.button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-expanded={isExpanded}
                aria-controls={`notification-details-${notificationId}`}
                whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                className="flex h-8 w-8 items-center justify-center border border-cyber-border bg-cyber-surface text-cyber-body-subtle transition-colors hover:text-neon hover:border-neon/50"
              >
                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.2,
                    ease: "easeOut",
                  }}
                  className="flex"
                >
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </motion.span>
                <span className="sr-only">
                  {isExpanded ? "Hide details" : "Show details"}
                </span>
              </motion.button>
            )}
          </div>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="details"
                id={`notification-details-${notificationId}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.25,
                  ease: "easeOut",
                }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-3 border-t border-cyber-border-subtle pt-3 text-[13px] text-cyber-body-subtle">
                  <p>{description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={action.onClick}
                      className="text-[11px] font-medium tracking-wider uppercase bg-cyber-surface hover:bg-cyber-surface-hover border-cyber-border hover:border-neon/50 hover:text-neon transition-colors"
                    >
                      {action.label}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-[11px] font-medium tracking-wider uppercase text-cyber-body-subtle hover:text-cyber-heading hover:bg-cyber-surface-hover transition-colors"
                      onClick={() => {
                        console.log("Remind me later");
                        onDismiss();
                      }}
                    >
                      Remind me later
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          onClick={onDismiss}
          whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
          className="p-1 text-cyber-body-subtle transition-colors hover:text-[#FF003C]"
          aria-label={`Dismiss ${type} notification`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </motion.button>
      </Card>
    </motion.div>
  );
}

type ButtonIconProps = {
  type: NotificationType;
};

function ButtonIcon({ type }: ButtonIconProps) {
  const Icon = NOTIFICATION_CONFIGS[type].icon;
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      aria-hidden="true"
      whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-muted/60 text-foreground/70"
    >
      <Icon className="h-5 w-5" />
    </motion.div>
  );
}
