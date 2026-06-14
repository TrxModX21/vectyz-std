"use client";

import VectyzLogo from "@/components/common/vectyz-logo";
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
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import {
  Banknote,
  ChevronDown,
  CreditCard,
  Folder,
  Globe,
  HelpCircle,
  Languages,
  LogOut,
  Moon,
  Plus,
  Search,
  Settings,
  Ticket,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import TopUpDialog from "@/components/common/top-up-dialog";
import { useCurrency } from "@/store/use-currency";

const Header = () => {
  const { data: userProfileResponse, isLoading } = useAuth();
  const session = userProfileResponse?.user;

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const { currency, setCurrency } = useCurrency();

  const router = useRouter();
  const searchParams = useSearchParams();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Sync with URL on mount / update
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const updateUrl = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // If searching or filtering, ensure we are on the search page
    if (!window.location.pathname.startsWith("/explore/search")) {
      router.push(`/explore/search?${params.toString()}`);
    } else {
      router.replace(`/explore/search?${params.toString()}`);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateUrl("search", searchQuery);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <VectyzLogo width={120} height={120} />

            {/* Home Button */}
            <Link href="/">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 hidden md:flex"
                size="sm"
              >
                Home
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <Input
              type="text"
              placeholder="Search asset here"
              className="w-full rounded-full pl-6 pr-10 h-10 border-muted-foreground/20 bg-muted/20 focus-visible:ring-offset-0 focus-visible:ring-blue-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            {searchQuery ? (
              <X
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => {
                  setSearchQuery("");
                  updateUrl("search", null);
                }}
              />
            ) : (
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            {session ? (
              <>
                <TopUpDialog>
                  <Button
                    variant="outline"
                    className="hidden md:flex h-9 gap-1 border-primary/20 hover:bg-primary/5 hover:text-primary"
                  >
                    <Zap className="h-4 w-4 text-primary fill-primary/20" />
                    <span className="font-semibold">
                      {session?.creditBalance || 0}
                    </span>
                    <Plus className="h-3 w-3 ml-1 opacity-50" />
                  </Button>
                </TopUpDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Avatar className="size-10">
                        <AvatarImage src={session.image || ""} alt="shadcn" />
                        <AvatarFallback className="bg-v-green">
                          {session.name.slice(0)[0]}
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
                          src={session.image as string}
                          alt="profile image"
                        />
                        <AvatarFallback className="bg-v-green">
                          {session.name.slice(0)[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-bold leading-none">
                          {session.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.email}
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
                  <Button className="hidden lg:block bg-v-green hover:bg-[#95b514] text-black font-semibold rounded-md px-6">
                    Sign Up Free
                  </Button>
                </Link>
                <Link href="/auth/sign-in">
                  <Button
                    variant="secondary"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md px-6"
                  >
                    Sign in
                  </Button>
                </Link>
              </>
            )}
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

export default Header;
