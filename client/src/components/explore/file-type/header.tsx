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
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import {
  ChevronDown,
  CreditCard,
  Folder,
  Globe,
  HelpCircle,
  Languages,
  LogOut,
  Moon,
  Search,
  Settings,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const {
    data: session,
    isPending: sessionLoading, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

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
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Filters */}
            <div className="hidden lg:flex items-center gap-2 mr-2">
              <Button
                variant="ghost"
                size="sm"
                className="bg-muted/30 gap-1 rounded-md text-muted-foreground font-normal hover:text-foreground"
              >
                <span className="opacity-70">License</span>{" "}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="bg-muted/30 gap-1 rounded-md text-muted-foreground font-normal hover:text-foreground"
              >
                <span className="opacity-70">Color</span>{" "}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="bg-muted/30 gap-1 rounded-md text-muted-foreground font-normal hover:text-foreground"
              >
                <span className="opacity-70">File type</span>{" "}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </div>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={session.user.image || ""}
                        alt="shadcn"
                      />
                      <AvatarFallback className="bg-v-green">
                        {session.user.name.slice(0)[0]}
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
                        src={session.user.image || ""}
                        alt="shadcn"
                      />
                      <AvatarFallback className="bg-v-green">
                        {session.user.name.slice(0)[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-bold leading-none">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 flex flex-col gap-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                      Get a plan
                    </Button>
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
                    <DropdownMenuItem className="cursor-pointer">
                      <Globe className="mr-2 size-4" />
                      Creator profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Folder className="mr-2 size-4" />
                      My collections
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuGroup className="mt-2">
                    <div className="flex items-center justify-between px-2 py-1.5 text-sm">
                      <div className="flex items-center gap-2">
                        <Languages className="size-4" />
                        Language
                      </div>
                      <div className="flex items-center gap-2 border rounded-md px-2 py-1 text-xs">
                        English
                        <ChevronDown className="size-3" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2 py-1.5 text-sm">
                      <div className="flex items-center gap-2">
                        <Moon className="size-4" />
                        Theme
                      </div>
                      <div className="flex items-center gap-2 border rounded-md px-2 py-1 text-xs">
                        Dark
                        <ChevronDown className="size-3" />
                      </div>
                    </div>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer">
                      <Ticket className="mr-2 size-4" />
                      Use AI code
                    </DropdownMenuItem>
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
            ) : (
              <>
                <Link href="/auth/sign-up">
                  <Button className="bg-v-green hover:bg-[#95b514] text-black font-semibold rounded-md px-6">
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
