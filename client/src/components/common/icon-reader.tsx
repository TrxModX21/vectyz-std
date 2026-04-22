import * as TablerIcons from "@tabler/icons-react";

const IconReader = ({ name, className }: { name: string; className?: string }) => {
  const iconName = name;

  if (!iconName) return <span className="text-muted-foreground">-</span>;
  const Icon = TablerIcons[
    iconName as keyof typeof TablerIcons
  ] as React.ElementType;

  return Icon ? <Icon className={className || "size-8"} /> : <TablerIcons.IconVector className={className || "size-8"} />;
};

export default IconReader;
