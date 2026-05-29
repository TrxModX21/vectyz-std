import {
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FolderPlusIcon } from "../ui/folder-plus";
import {
  useAddItemToCollection,
  useCreateCollection,
  useMyCollections,
  useCheckStockCollections,
  useRemoveItemFromCollection,
} from "@/hooks/use-collection";
import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useDebounce } from "@/hooks/use-debounce";

const AddToCollectionButton = ({
  stock,
  children,
}: {
  stock?: Stock;
  children?: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [isAllCollectionsModalOpen, setIsAllCollectionsModalOpen] =
    useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [collectionPage, setCollectionPage] = useState(1);
  const [searchCollection, setSearchCollection] = useState("");

  const debouncedSearch = useDebounce(searchCollection, 500);

  const { data: recentCollectionsData, isLoading: isLoadingRecent } =
    useMyCollections({ limit: 7 });
  const { mutate: addItemToCollection } = useAddItemToCollection();
  const { mutate: removeItemFromCollection } = useRemoveItemFromCollection();
  const { mutate: createCollection, isPending: isCreating } =
    useCreateCollection();
  const { data: allCollectionsData, isLoading: isLoadingAll } =
    useMyCollections({
      page: collectionPage,
      limit: 10,
      search: debouncedSearch,
    });

  const { data: savedCollectionIds = [] } = useCheckStockCollections(
    stock?.id || "",
    isOpen
  );

  const handleToggleCollection = (collectionId: string) => {
    if (!stock) return;
    if (savedCollectionIds.includes(collectionId)) {
      removeItemFromCollection({ collectionId, stockId: stock.id });
    } else {
      addItemToCollection({ collectionId, stockId: stock.id });
    }
  };

  const handleCreateAndSave = () => {
    if (!newCollectionName.trim() || !stock) return;
    createCollection(
      { name: newCollectionName },
      {
        onSuccess: (data) => {
          setIsCreateCollectionOpen(false);
          setNewCollectionName("");
          if (data?.collection?.id) {
            addItemToCollection({
              collectionId: data.collection.id,
              stockId: stock.id,
            });
          }
        },
      },
    );
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          {children ? (
            children
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-zinc-100"
            >
              <FolderPlusIcon className="h-4 w-4" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Add to Collection</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isLoadingRecent ? (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : recentCollectionsData?.collections?.length ? (
            recentCollectionsData.collections.map((c: any) => (
              <DropdownMenuItem
                key={c.id}
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleCollection(c.id);
                }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center truncate">
                  <Layers className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">{c.name}</span>
                </div>
                {savedCollectionIds.includes(c.id) && (
                  <Check className="h-4 w-4 text-primary shrink-0 ml-2" />
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-2 text-xs text-muted-foreground text-center">
              No collections yet
            </div>
          )}

          {recentCollectionsData?.totalCount! > 7 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsAllCollectionsModalOpen(true)}
              >
                <Search className="mr-2 h-4 w-4 shrink-0" />
                <span>Save to another collection...</span>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsCreateCollectionOpen(true)}>
            <Plus className="mr-2 h-4 w-4 shrink-0" />
            <span>Create New Collection</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Collection Dialog */}
      <Dialog
        open={isCreateCollectionOpen}
        onOpenChange={setIsCreateCollectionOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>
              Organize your favorite assets in one place.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Collection Name</Label>
              <Input
                id="name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="e.g. Minimalist UI, Summer Campaign..."
                className="col-span-3"
                disabled={isCreating}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateCollectionOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateAndSave}
              disabled={isCreating || !newCollectionName.trim()}
            >
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create & Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* All Collection Dialog */}
      <Dialog
        open={isAllCollectionsModalOpen}
        onOpenChange={setIsAllCollectionsModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>All Collections</DialogTitle>
            <DialogDescription>
              Select a collection to save this asset.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search collections..."
                className="pl-8"
                value={searchCollection}
                onChange={(e) => {
                  setSearchCollection(e.target.value);
                  setCollectionPage(1);
                }}
              />
            </div>

            <div className="max-h-[300px] min-h-[300px] overflow-y-auto space-y-2">
              {isLoadingAll ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : allCollectionsData?.collections?.length ? (
                allCollectionsData.collections.map((c: any) => (
                  <Button
                    key={c.id}
                    variant="ghost"
                    className="w-full justify-between font-normal"
                    onClick={() => {
                      handleToggleCollection(c.id);
                      setIsAllCollectionsModalOpen(false);
                    }}
                  >
                    <div className="flex items-center truncate">
                      <Layers className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">{c.name}</span>
                    </div>
                    {savedCollectionIds.includes(c.id) && (
                      <Check className="h-4 w-4 text-primary shrink-0 ml-2" />
                    )}
                  </Button>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                  No collections found.
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {allCollectionsData && allCollectionsData.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCollectionPage((p) => Math.max(1, p - 1))}
                  disabled={collectionPage === 1 || isLoadingAll}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                <span className="text-xs text-muted-foreground">
                  Page {collectionPage} of {allCollectionsData.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCollectionPage((p) =>
                      Math.min(allCollectionsData.totalPages, p + 1),
                    )
                  }
                  disabled={
                    collectionPage === allCollectionsData.totalPages ||
                    isLoadingAll
                  }
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddToCollectionButton;
