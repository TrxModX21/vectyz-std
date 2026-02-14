import { Label } from "@/components/ui/label";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { useGetFileTypes } from "@/hooks/use-file-type";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";

const HeaderNavigationMenu = () => {
  const { data: fileTypeResponse, isLoading: fileTypeLoading } =
    useGetFileTypes({ sort: "asc", includeCategories: true, limit: 10 });
  const fileTypes = fileTypeResponse?.fileTypes ?? [];

  return (
    <NavigationMenu viewport={false} className="hidden xl:block">
      <NavigationMenuList className="flex-wrap">
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger useIcon={false}>Explore</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="#" className="flex-row items-center gap-2">
                    <CircleHelpIcon />
                    <Label>Members</Label>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#" className="flex-row items-center gap-2">
                    <CircleIcon />
                    <Label>Collections</Label>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#" className="flex-row items-center gap-2">
                    <CircleCheckIcon />
                    <Label>Premium</Label>
                  </Link>
                </NavigationMenuLink>

                <Separator />

                <NavigationMenuLink asChild>
                  <Link href="#">Featured</Link>
                </NavigationMenuLink>

                <NavigationMenuLink asChild>
                  <Link href="#">Popular</Link>
                </NavigationMenuLink>

                <NavigationMenuLink asChild>
                  <Link href="#">Most Downloaded</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {fileTypes.map((fileType) => (
          <NavigationMenuItem key={fileType.id}>
            <NavigationMenuTrigger useIcon={false}>
              {fileType.name}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 md:w-[400px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3 flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <Label>{fileType.name} Collections</Label>
                    <Separator />
                  </div>

                  <NavigationMenuLink asChild>
                    <Link
                      className="group/link relative flex h-full w-full flex-col justify-end overflow-hidden rounded-md bg-transparent p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6 min-h-[250px] max-h-[250px]"
                      href="/"
                    >
                      {fileType.collectionImage && (
                        <NextImage
                          src={fileType.collectionImage}
                          alt={fileType.name}
                          fill
                          className="absolute inset-0 z-0 object-cover transition-transform duration-300 group-hover/link:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

                      <div className="relative z-20">
                        <div className="mb-2 text-lg font-medium text-white sm:mt-4">
                          {fileType.name} Collection
                        </div>
                        <p className="text-sm leading-tight text-white/90">
                          Explore our curated collection of {fileType.name}{" "}
                          assets.
                        </p>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <Label>{fileType.name} Categories</Label>
                    <Separator />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {fileType.categories && fileType.categories.length > 0 ? (
                      <>
                        {fileType.categories.map((category: any) => (
                          <ListItem
                            key={category.id}
                            href={`/explore/${fileType.slug}/${category.slug}`}
                            title={category.name}
                          >
                            {/* Re-usable components built using Radix UI and Tailwind CSS. */}
                          </ListItem>
                        ))}
                        <ListItem
                          href={`/explore/${fileType.slug}`}
                          title="See all..."
                          className="text-primary font-semibold"
                        />
                      </>
                    ) : (
                      <div className="col-span-2 text-sm text-muted-foreground p-2">
                        No categories with active stocks found.
                      </div>
                    )}
                  </div>
                </div>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          {children && (
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              {children}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default HeaderNavigationMenu;
