import {
  BarChart3,
  BookUser,
  FileType,
  LayoutDashboard,
  Newspaper,
  Package,
  ShoppingCart,
  TableProperties,
  Users,
} from "lucide-react";

export const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  {
    icon: BarChart3,
    label: "Analytics",
    href: "#",
    children: [
      { label: "Revenue", href: "#" },
      { label: "Traffic", href: "#" },
    ],
  },
  {
    icon: TableProperties,
    label: "Manage Categories",
    href: "/manage-categories",
  },
  {
    icon: FileType,
    label: "Manage Filetypes",
    href: "/manage-filetypes",
  },
  {
    icon: BookUser,
    label: "Manage Vectyzen",
    href: "/manage-vectyzen",
  },
  {
    icon: Package,
    label: "Manage Stocks",
    href: "/manage-stocks",
  },
  {
    icon: Newspaper,
    label: "Manage Blog",
    href: "#",
    children: [
      { label: "Posts", href: "/manage-blog/posts" },
      { label: "Taxonomy", href: "/manage-blog/taxonomy" },
      { label: "Authors", href: "/manage-blog/authors" },
      { label: "Settings", href: "/manage-blog/settings" },
    ],
  },
  // { icon: Package, label: "Products", href: "#" },
  // { icon: ShoppingCart, label: "Orders", href: "#" },
  // { icon: Users, label: "Customers", href: "#" },
];
