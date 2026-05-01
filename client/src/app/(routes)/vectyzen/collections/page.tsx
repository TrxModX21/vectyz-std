import FadeIn from "@/components/common/fade-in";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";

const collections = [
  {
    title: "Lifestyle",
    resources: 85,
    images: [
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80",
      "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&q=80",
      "https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=400&q=80",
    ],
  },
  {
    title: "Freepik Content Choice Mockup",
    resources: 85,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80",
    ],
  },
  {
    title: "Bold Minimalist",
    resources: 256,
    images: [
      "https://images.unsplash.com/photo-1540306351817-ffeb3ef4187e?w=400&q=80",
      "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=400&q=80",
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=80",
    ],
  },
  {
    title: "Traditional Cartoon",
    resources: 111,
    images: [
      "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=400&q=80",
      "https://images.unsplash.com/photo-1580477651163-95e50529d3c5?w=400&q=80",
      "https://images.unsplash.com/photo-1606335543042-57c525922933?w=400&q=80",
    ],
  },
];

const CollectionsPage = () => {
  return (
    <FadeIn>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Collection</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {collections.map((collection, idx) => (
          <CollectionCard key={idx} collection={collection} />
        ))}
      </div>
    </FadeIn>
  );
};

function CollectionCard({ collection }: { collection: any }) {
  return (
    <div className="group cursor-pointer">
      {/* Image Grid Container */}
      <div className="bg-background rounded-xl overflow-hidden aspect-4/3 mb-3 relative flex gap-[2px] border border-border/50 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1 group-hover:border-primary/20">
        {/* Left Side (2 images stacked) */}
        <div className="w-1/2 flex flex-col gap-[2px]">
          <div className="h-1/2 relative bg-muted overflow-hidden">
            <img
              src={collection.images[0]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="h-1/2 relative bg-muted overflow-hidden">
            <img
              src={collection.images[1]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
        {/* Right Side (1 image full height) */}
        <div className="w-1/2 relative bg-muted overflow-hidden">
          <img
            src={collection.images[2]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Overlay on hover (optional) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
      </div>

      {/* Info Section */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-tight mb-1 text-foreground truncate">
            {collection.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {collection.resources} resources
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 -mr-1 -mt-0.5 rounded-md hover:bg-muted focus:outline-none">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild  className="cursor-pointer">
              <Link href="/vectyzen/collections/edit/tes">
                <Edit2 className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Hapus</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default CollectionsPage;
