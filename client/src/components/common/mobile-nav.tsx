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
import { Menu, X } from "lucide-react";
import { useState } from "react";

const dummyMenu = [
  "item 1",
  "item 2",
  "item 3",
  "item 4",
  "item 5",
  "item 6",
  "item 7",
  "item 8",
  "item 9",
  "item 10",
];

const MobileNav = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

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
            <AccordionItem value="item-1">
              <AccordionTrigger>Explore</AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-3 text-balance pl-4">
                  <li className="flex items-center gap-2">
                    <Menu />
                    <Label>Members</Label>
                  </li>
                  <li className="flex items-center gap-2">
                    <Menu />
                    <Label>Collections</Label>
                  </li>
                  <li className="flex items-center gap-2">
                    <Menu />
                    <Label>Premium</Label>
                  </li>

                  <Separator />

                  <li>
                    <Label>Featured</Label>
                  </li>
                  <li>
                    <Label>Popular</Label>
                  </li>
                  <li>
                    <Label>Most downloads</Label>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Photos</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 text-balance pl-4">
                <div className="flex flex-col gap-1">
                  <Label>Category Name</Label>
                  <Separator className="w-20!" />
                </div>

                {dummyMenu.map((menu, index) => (
                  <li key={index} className="list-none">
                    <Label>{menu}</Label>
                  </li>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Vector</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 text-balance pl-4">
                <div className="flex flex-col gap-1">
                  <Label>Category Name</Label>
                  <Separator className="w-20!" />
                </div>

                {dummyMenu.map((menu, index) => (
                  <li key={index} className="list-none">
                    <Label>{menu}</Label>
                  </li>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Slide</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 text-balance pl-4">
                <div className="flex flex-col gap-1">
                  <Label>Category Name</Label>
                  <Separator className="w-20!" />
                </div>

                {dummyMenu.map((menu, index) => (
                  <li key={index} className="list-none">
                    <Label>{menu}</Label>
                  </li>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>AI</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 text-balance pl-4">
                <div className="flex flex-col gap-1">
                  <Label>Category Name</Label>
                  <Separator className="w-20!" />
                </div>

                {dummyMenu.map((menu, index) => (
                  <li key={index} className="list-none">
                    <Label>{menu}</Label>
                  </li>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>UI/UX</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 text-balance pl-4">
                <div className="flex flex-col gap-1">
                  <Label>Category Name</Label>
                  <Separator className="w-20!" />
                </div>

                {dummyMenu.map((menu, index) => (
                  <li key={index} className="list-none">
                    <Label>{menu}</Label>
                  </li>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>PNGs</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 text-balance pl-4">
                <div className="flex flex-col gap-1">
                  <Label>Category Name</Label>
                  <Separator className="w-20!" />
                </div>

                {dummyMenu.map((menu, index) => (
                  <li key={index} className="list-none">
                    <Label>{menu}</Label>
                  </li>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex flex-col gap-4 px-4 mt-8">
            <Button>Plans</Button>
            <Button variant="secondary">Sign in</Button>
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
