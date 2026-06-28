"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import VectyzLogo from "@/components/common/vectyz-logo";
import { Menu, X, Users, CircleIcon, CircleCheckIcon } from "lucide-react";
import { useState } from "react";
import { useGetFileTypes } from "@/hooks/use-file-type";
import Link from "next/link";
import CreditTopUp from "./credit-topup";
import { cn } from "@/lib/utils";

const MobileNav = ({ user }: { user: User | undefined }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const { data: fileTypeResponse } = useGetFileTypes({
    sort: "asc",
    includeCategories: true,
    limit: 20,
  });
  const fileTypes = fileTypeResponse?.fileTypes ?? [];

  return (
    <Drawer
      open={isMobileNavOpen}
      onOpenChange={setIsMobileNavOpen}
      direction="left"
    >
      <DrawerTrigger asChild className="xl:hidden">
        <Menu className="size-6 text-gray-400" />
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="text-left">
          <div className="flex items-center justify-between">
            <VectyzLogo width={120} height={120} />

            <DrawerClose asChild>
              <Button variant="outline" size="icon-sm">
                <X className="size-6 text-gray-400" />
              </Button>
            </DrawerClose>
          </div>

          <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
          <DrawerDescription className="sr-only">
            Menu in vectyz.com
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="w-full max-h-[80vh]">
          <Accordion type="multiple" className="w-full px-4">
            <AccordionItem value="explore">
              <AccordionTrigger>Explore</AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-4 text-balance pl-4 pt-2">
                  <li className="flex items-center gap-2">
                    <Users className="size-4" />
                    <Link
                      href="/members"
                      onClick={() => setIsMobileNavOpen(false)}
                    >
                      <Label className="cursor-pointer">Vectyzen</Label>
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <CircleIcon className="size-4" />
                    <Link href="#" onClick={() => setIsMobileNavOpen(false)}>
                      <Label className="cursor-pointer">Collections</Label>
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <CircleCheckIcon className="size-4" />
                    <Link href="#" onClick={() => setIsMobileNavOpen(false)}>
                      <Label className="cursor-pointer">Premium</Label>
                    </Link>
                  </li>

                  <Separator />

                  <li>
                    <Link href="#" onClick={() => setIsMobileNavOpen(false)}>
                      <Label className="cursor-pointer">Featured</Label>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" onClick={() => setIsMobileNavOpen(false)}>
                      <Label className="cursor-pointer">Popular</Label>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" onClick={() => setIsMobileNavOpen(false)}>
                      <Label className="cursor-pointer">Most downloads</Label>
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {fileTypes.map((fileType) => (
              <AccordionItem key={fileType.id} value={fileType.id}>
                <AccordionTrigger>{fileType.name}</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-3 text-balance pl-4">
                  <div className="flex flex-col gap-1 pt-2">
                    <Label>{fileType.name} Categories</Label>
                    <Separator className="w-20!" />
                  </div>

                  <ul className="flex flex-col gap-3">
                    {fileType.categories && fileType.categories.length > 0 ? (
                      <>
                        {fileType.categories.map((category: any) => (
                          <li key={category.id} className="list-none">
                            <Link
                              href={`/explore/${fileType.slug}/${category.slug}`}
                              onClick={() => setIsMobileNavOpen(false)}
                            >
                              <Label className="cursor-pointer text-muted-foreground">
                                {category.name}
                              </Label>
                            </Link>
                          </li>
                        ))}
                        <li className="list-none">
                          <Link
                            href={`/explore/${fileType.slug}`}
                            onClick={() => setIsMobileNavOpen(false)}
                          >
                            <Label className="cursor-pointer text-primary font-semibold">
                              See all...
                            </Label>
                          </Link>
                        </li>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground py-2">
                        No categories found.
                      </div>
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className={cn("flex gap-4 px-4 mt-8 flex-col")}>
            <Button asChild onClick={() => setIsMobileNavOpen(false)}>
              <Link href="/pricing">Plans</Link>
            </Button>
            {!user ? (
              <Button
                variant="secondary"
                asChild
                onClick={() => setIsMobileNavOpen(false)}
              >
                <Link href="/auth/sign-in">Sign in</Link>
              </Button>
            ) : (
              <CreditTopUp user={user} className="flex w-full" />
            )}
          </div>
        </ScrollArea>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNav;
