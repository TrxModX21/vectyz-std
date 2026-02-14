import {
  IconCamera,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileTypography,
  IconFileWord,
  IconHelp,
  IconListDetails,
  IconPalette,
  IconReport,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";
import { FileStack, SquareTerminal } from "lucide-react";

export const sidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Categories",
      url: "/categories",
      icon: IconListDetails,
    },
    {
      title: "Colors",
      url: "/colors",
      icon: IconPalette,
    },
    {
      title: "File Type",
      url: "/file-type",
      icon: IconFileTypography,
    },
  ],
  nestedNav: [
    {
      title: "User Management",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "All Vectyzen",
          url: "/manage-users/all",
        },
        {
          title: "Active Vectyzen",
          url: "#",
        },
        {
          title: "Banned Vectyzen",
          url: "#",
        },
      ],
    },
    {
      title: "Stock Management",
      url: "#",
      icon: FileStack,
      items: [
        {
          title: "All Stock",
          url: "/manage-stocks/all",
        },
        {
          title: "Active Vectyzen",
          url: "#",
        },
        {
          title: "Banned Vectyzen",
          url: "#",
        },
      ],
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};
