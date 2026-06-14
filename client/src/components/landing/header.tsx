"use client";

import LogoutDialog from "@/components/logout-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import VectyzLogo from "@/components/common/vectyz-logo";
import {
  Bell,
  ChevronDown,
  CreditCard,
  Folder,
  Globe,
  HelpCircle,
  Languages,
  LogOut,
  Moon,
  Plus,
  Settings,
  Ticket,
  Zap,
  Banknote,
  Wallet,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import MobileNav from "../common/mobile-nav";
import HeaderNavigationMenu from "../common/nav-menu";
import { Skeleton } from "@/components/ui/skeleton";
import ImpersonateMode from "../impersonate-mode";
import TopUpDialog from "../common/top-up-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useCurrency } from "@/store/use-currency";

const Header = () => {
  const router = useRouter();
  const { currency, setCurrency } = useCurrency();
  const [mounted, setMounted] = useState(false);
  const isLargeDevice = useMediaQuery("(min-width: 1024px)");

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const { data: userProfileResponse, isLoading } = useAuth();
  const user = userProfileResponse?.user;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) return <HeaderSkeleton />;

  return (
    <>
      <ImpersonateMode />

      <header className="relative z-40 container mx-auto">
        <div className="px-4 lg:px6">
          <div className="h-18 lg:h-20 flex justify-between items-center">
            <div className="flex items-center justify-center gap-2">
              <MobileNav />

              <VectyzLogo
                width={isLargeDevice ? 140 : 120}
                height={isLargeDevice ? 140 : 120}
              />

              <HeaderNavigationMenu />
            </div>

            <div className="flex items-center justify-center gap-2 lg:gap-4">
              <Button
                size="icon-lg"
                variant="ghost"
                className="hidden xl:block"
              >
                <Bell className="size-8 text-blue-900" />
              </Button>

              <Link href="/pricing" className="hidden md:block">
                <Button size={isLargeDevice ? "default" : "sm"}>Plans</Button>
              </Link>

              {user ? (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <TopUpDialog>
                            <Button
                              variant="outline"
                              className="hidden md:flex h-9 gap-1 border-primary/20 hover:bg-primary/5 hover:text-primary"
                            >
                              <Zap className="h-4 w-4 text-primary fill-primary/20" />
                              <span className="font-semibold">
                                {Number(user?.creditBalance || 0)}
                              </span>
                              <Plus className="h-3 w-3 ml-1 opacity-50" />
                            </Button>
                          </TopUpDialog>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="p-3 gap-2 flex flex-col w-48">
                        <p className="font-semibold text-center border-b pb-2 mb-1">Credit Balance</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Wallet className="h-3 w-3" /> Purchased:
                          </span>
                          <span className="font-mono font-medium">{Number(user?.purchasedCredit || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Earned:
                          </span>
                          <span className="font-mono font-medium">{Number(user?.earnedCredit || 0)}</span>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <Avatar className="size-10">
                          <AvatarImage src={user.image || ""} alt="shadcn" />
                          <AvatarFallback className="bg-v-green">
                            {user.name.slice(0)[0]}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-72 p-2"
                      sideOffset={10}
                      align="end"
                    >
                      <div className="flex items-center gap-3 p-2">
                        <Avatar className="size-10">
                          <AvatarImage
                            src={user.image as string}
                            alt="profile image"
                          />
                          <AvatarFallback className="bg-v-green">
                            {user.name.slice(0)[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-0.5">
                          <p className="text-sm font-bold leading-none">
                            {user.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="p-2 flex flex-col gap-2">
                        <Link href="/pricing">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                            Get a plan
                          </Button>
                        </Link>
                        <Link href="/vectyzen">
                          <Button
                            variant="outline"
                            className="w-full bg-transparent border-input hover:bg-accent hover:text-accent-foreground"
                          >
                            Dashboard
                          </Button>
                        </Link>
                      </div>

                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        <DropdownMenuItem className="cursor-pointer">
                          <CreditCard className="mr-2 size-4" />
                          Plan & billing
                          <span className="ml-auto text-xs bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
                            Free
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Settings className="mr-2 size-4" />
                          Settings
                        </DropdownMenuItem>
                        <Link href="/vectyzen/me">
                          <DropdownMenuItem className="cursor-pointer">
                            <Globe className="mr-2 size-4" />
                            Creator profile
                          </DropdownMenuItem>
                        </Link>

                        <Link href="/vectyzen/collections">
                          <DropdownMenuItem className="cursor-pointer">
                            <Folder className="mr-2 size-4" />
                            My collections
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>

                      <DropdownMenuGroup className="mt-2">
                        <div className="flex items-center justify-between px-2 py-1.5 text-sm">
                          <div className="flex items-center gap-2">
                            <Banknote className="size-4" />
                            Currency
                          </div>
                          <Select
                            value={currency}
                            onValueChange={(val) => {
                              setCurrency(val as "IDR" | "USD");
                              router.refresh();
                            }}
                          >
                            <SelectTrigger className="w-[70px] h-[26px] px-2 py-1 text-xs">
                              <SelectValue placeholder="Currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IDR">IDR</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between px-2 py-1.5 text-sm">
                          <div className="flex items-center gap-2">
                            <Languages className="size-4" />
                            Language
                          </div>
                          <Select value="EN" disabled={true}>
                            <SelectTrigger className="w-[100px] h-[26px] px-2 py-1 text-xs">
                              <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EN">English</SelectItem>
                              <SelectItem value="ID">Indonesia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* <div className="flex items-center justify-between px-2 py-1.5 text-sm">
                          <div className="flex items-center gap-2">
                            <Moon className="size-4" />
                            Theme
                          </div>
                          <div className="flex items-center gap-2 border rounded-md px-2 py-1 text-xs">
                            Dark
                            <ChevronDown className="size-3" />
                          </div>
                        </div> */}
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        {/* <DropdownMenuItem className="cursor-pointer">
                          <Ticket className="mr-2 size-4" />
                          Use AI code
                        </DropdownMenuItem> */}
                        <DropdownMenuItem className="cursor-pointer">
                          <HelpCircle className="mr-2 size-4" />
                          Help center
                        </DropdownMenuItem>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onSelect={() => setLogoutDialogOpen(true)}
                        >
                          <LogOut className="mr-2 size-4" />
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link href="/auth/sign-up">
                    <Button className="bg-v-green hover:bg-[#a6c91698] text-dark hidden xl:block">
                      Sign Up Free
                    </Button>
                  </Link>

                  <Link href="/auth/sign-in">
                    <Button
                      variant="secondary"
                      size={isLargeDevice ? "default" : "sm"}
                    >
                      Sign in
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <LogoutDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
      />
    </>
  );
};

const HeaderSkeleton = () => {
  return (
    <header className="relative z-40 container mx-auto">
      <div className="px-4 lg:px-6">
        <div className="h-18 lg:h-20 flex justify-between items-center">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* Mobile menu icon */}
            <Skeleton className="h-6 w-6 xl:hidden animate-pulse" />

            {/* Logo */}
            <Skeleton className="h-8 w-[120px] lg:w-[140px] animate-pulse" />

            {/* Desktop navigation */}
            <div className="hidden xl:flex items-center gap-6 ml-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-4 w-[70px] rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Bell */}
            <Skeleton className="animate-pulse h-10 w-10 hidden xl:block rounded-full" />

            {/* Plans */}
            <Skeleton className="animate-pulse h-9 w-[70px] lg:h-10 lg:w-[90px]" />

            {/* Sign up */}
            <Skeleton className="animate-pulse h-9 w-[110px] hidden xl:block" />

            {/* Sign in */}
            <Skeleton className="animate-pulse h-9 w-[70px] lg:h-10 lg:w-[90px]" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
