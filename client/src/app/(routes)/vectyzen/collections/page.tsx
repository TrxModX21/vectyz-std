"use client";

import FadeIn from "@/components/common/fade-in";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit2, MoreVertical, Trash2, FolderOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useMyCollections } from "@/hooks/use-collection";
import { Collection } from "../../../../../types/collection";
import { EditCollectionDialog } from "@/components/common/edit-collection-dialog";
import { DeleteCollectionDialog } from "@/components/common/delete-collection-dialog";

const CollectionsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 12;
  const [editingCollection, setEditingCollection] = useState<any>(null);
  const [deletingCollection, setDeletingCollection] = useState<any>(null);

  const { data, isLoading } = useMyCollections({ page, limit });

  return (
    <FadeIn>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Collection</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : data?.collections?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-border rounded-xl bg-muted/20">
          <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            You don't have any collections yet
          </h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Start saving your favorite assets by creating a collection or
            exploring new ones.
          </p>
          <Button asChild>
            <Link href="/explore/search">Explore Assets</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.collections.map((collection: any) => (
              <CollectionCard 
                key={collection.id} 
                collection={collection} 
                onEdit={setEditingCollection} 
                onDelete={setDeletingCollection}
              />
            ))}
          </div>

          {data?.totalPages && data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
      
      <EditCollectionDialog 
        collection={editingCollection} 
        onClose={() => setEditingCollection(null)} 
      />
      
      <DeleteCollectionDialog 
        collection={deletingCollection} 
        onClose={() => setDeletingCollection(null)} 
      />
    </FadeIn>
  );
};

function CollectionCard({ 
  collection, 
  onEdit,
  onDelete
}: { 
  collection: Collection;
  onEdit: (collection: Collection) => void;
  onDelete: (collection: Collection) => void;
}) {
  // Ambil URL gambar dari 3 item pertama. Fallback ke empty array jika items tidak ada
  const items = collection.items || [];
  const images = Array.from({ length: 3 }).map((_, index) => {
    // Kita asumsikan struktur path dari Prisma include file yang diberikan:
    // item.stock.files[0].fileUrl atau url. Kita menggunakan property path/fileUrl dari vectyz
    const file = items[index]?.stock?.files?.[0];
    return file?.url || null;
  });

  return (
    <>
      <div className="group cursor-pointer">
        <Link
          href={`/vectyzen/collections/${collection.slug}`}
          className="block"
        >
          {/* Image Grid Container */}
          <div className="bg-background rounded-xl overflow-hidden aspect-4/3 mb-3 relative flex gap-[2px] border border-border/50 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1 group-hover:border-primary/20">
            {/* Left Side (2 images stacked) */}
            <div className="w-1/2 flex flex-col gap-[2px]">
              <div className="h-1/2 relative bg-muted overflow-hidden flex items-center justify-center">
                {images[0] ? (
                  <Image
                    src={images[0]}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-fill transition-transform duration-500"
                  />
                ) : (
                  <FolderOpen className="w-6 h-6 text-muted-foreground/30" />
                )}
              </div>
              <div className="h-1/2 relative bg-muted overflow-hidden flex items-center justify-center">
                {images[1] ? (
                  <Image
                    src={images[1]}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-fill transition-transform duration-500"
                  />
                ) : (
                  <FolderOpen className="w-6 h-6 text-muted-foreground/30" />
                )}
              </div>
            </div>
            {/* Right Side (1 image full height) */}
            <div className="w-1/2 relative bg-muted overflow-hidden flex items-center justify-center">
              {images[2] ? (
                <Image
                  src={images[2]}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-fill transition-transform duration-500"
                />
              ) : (
                <FolderOpen className="w-8 h-8 text-muted-foreground/30" />
              )}
            </div>

            {/* Overlay on hover (optional) */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
          </div>
        </Link>

        {/* Info Section */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight mb-1 text-foreground truncate">
              {collection.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {collection._count?.items || 0} resources
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 -mr-1 -mt-0.5 rounded-md hover:bg-muted focus:outline-none">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onEdit(collection)}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={() => onDelete(collection)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}

export default CollectionsPage;
