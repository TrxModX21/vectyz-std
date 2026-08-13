import { Bell } from "lucide-react";

const NotificationSystem = () => {
  return (
    <button className="relative flex h-8 w-8 items-center justify-center transition-colors duration-150 rounded-cyber bg-transparent text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading">
      <Bell size={16} />
      {/* Notification dot */}
      <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 bg-[#FF003C] border-cyber-surface" />
    </button>
  );
};

export default NotificationSystem;
