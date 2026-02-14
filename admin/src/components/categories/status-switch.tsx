import { Switch } from "@/components/ui/switch";
import { useUpdateCategoryStatus } from "@/hooks/use-category";
import { useState } from "react";

const StatusSwitch = ({
  id,
  initialStatus,
}: {
  id: string;
  initialStatus: string;
}) => {
  const { mutate: updateStatus, isPending } = useUpdateCategoryStatus();
  const [status, setStatus] = useState(initialStatus === "active");

  const handleStatusChange = (checked: boolean) => {
    // Optimistic update locally
    setStatus(checked);

    updateStatus(
      { id, status: checked },
      {
        onError: () => {
          // Revert on error
          setStatus(!checked);
        },
      },
    );
  };

  return (
    <Switch
      checked={status}
      onCheckedChange={handleStatusChange}
      disabled={isPending}
    />
  );
};

export default StatusSwitch;
