import * as TablerIcons from "@tabler/icons-react";
import React from "react";
import { cn } from "@/lib/utils";

interface IconRendererProps {
  /** The name of the icon from @tabler/icons-react (e.g., "IconBrandReact") */
  iconName: string | null | undefined;
  /** Optional CSS classes to apply to the icon or the fallback element */
  className?: string;
  /** Custom fallback element to render when icon is missing or invalid */
  fallback?: React.ReactNode;
}

export function IconRenderer({
  iconName,
  className,
  fallback = "-",
}: IconRendererProps) {
  if (!iconName) {
    return (
      <span className={cn("text-cyber-body-subtle", className)}>
        {fallback}
      </span>
    );
  }

  // Load the icon component dynamically from the TablerIcons object
  const Icon = TablerIcons[
    iconName as keyof typeof TablerIcons
  ] as React.ElementType;

  if (!Icon) {
    return (
      <span className={cn("text-cyber-body-subtle", className)}>
        {fallback}
      </span>
    );
  }

  return <Icon className={cn("size-6", className)} />;
}
