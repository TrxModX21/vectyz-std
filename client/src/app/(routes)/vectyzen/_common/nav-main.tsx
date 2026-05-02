"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  IconCirclePlusFilled,
  IconDashboard,
  IconFileTypography,
  IconListDetails,
  IconPalette,
} from "@tabler/icons-react";
import { ChevronRight, CreditCard, DollarSign, Download } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import UploadStock from "./upload-stock";
import { useState } from "react";

const data = [
  {
    title: "Dashboard",
    url: "/vectyzen",
    icon: IconDashboard,
    type: "one",
  },
  {
    title: "Files",
    url: "/vectyzen/stocks", // ✅ beda dari dashboard
    icon: IconListDetails,
    type: "two",
    items: [
      {
        title: "Upload",
        url: "/vectyzen/stocks/upload",
      },
      {
        title: "Under Revision",
        url: "/vectyzen/stocks/revision",
      },
      {
        title: "Rejections",
        url: "/vectyzen/stocks/rejected",
      },
      {
        title: "Published",
        url: "/vectyzen/stocks/published",
      },
    ],
  },
  {
    title: "Collections",
    url: "/vectyzen/collections",
    icon: IconPalette,
    type: "one",
  },
  {
    title: "Downloads",
    url: "/vectyzen/downloads",
    icon: Download,
    type: "one",
  },
  {
    title: "Earnings",
    url: "/vectyzen/earnings",
    icon: DollarSign,
    type: "one",
  },
  {
    title: "Transactions",
    url: "/vectyzen/transactions",
    icon: CreditCard,
    type: "one",
  },
];

const NavMain = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [openUploadForm, setOpenUploadForm] = useState(false);

  const isOpen = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/");
  };
  const isActive = (url: string) => {
    return pathname === url;
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Upload Files"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                onClick={() => router.push("/vectyzen/create-stock")}
              >
                <div className="flex gap-2 items-center">
                  <IconCirclePlusFilled />
                  <span>Upload Files</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <Separator className="my-2" />

          <SidebarMenu>
            {data.map((item) => {
              if (item.type === "one") {
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive(item.url)}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              }

              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isOpen(item.url)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive(item.url)}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(subItem.url)}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* TODO::: MARK TO DELETE */}
      {/* <UploadStock open={openUploadForm} onOpenChange={setOpenUploadForm} /> */}
    </>
  );
};

export default NavMain;
