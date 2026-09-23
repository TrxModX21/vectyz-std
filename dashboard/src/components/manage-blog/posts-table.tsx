"use client";

import { useEffect, useState } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useManageBlogPosts } from "@/features/manage-blogs/queries";
import { useDeleteBlogPostMutation, useBulkDeleteBlogPostMutation } from "@/features/manage-blogs/mutations";
import { BlogPostData } from "../../../types/manage-blogs";
import { toast } from "../uitripled/notification-center-shadcnui";
import { getBlogColumns } from "./columns";
import PostsToolbar from "./posts-toolbar";
import { DataTable } from "../common/data-table";
import PostsPagination from "./pagination";
import { CustomDialog } from "../common/dialog";

export function BlogPostsTable() {
  const [queryState, setQueryState] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
      search: parseAsString.withDefault(""),
      status: parseAsString.withDefault(""),
      categoryId: parseAsString.withDefault(""),
    },
    {
      history: "push",
    },
  );

  const {
    data: postsResponse,
    isLoading,
    refetch,
  } = useManageBlogPosts(queryState);
  const postsData = postsResponse?.data;

  // Local States
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [openHideMenu, setOpenHideMenu] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState(queryState.search);
  
  const [postToDelete, setPostToDelete] = useState<BlogPostData | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  // Kalkulasi data untuk Bulk Actions
  const selectedIndexes = Object.keys(rowSelection).filter(
    (key) => (rowSelection as any)[key],
  );
  const selectedPosts = selectedIndexes
    .map((index) => postsData?.items[Number(index)])
    .filter(Boolean) as BlogPostData[];
  const selectedIds = selectedPosts.map((p) => p.id);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue !== queryState.search) {
        setQueryState({ search: searchValue, page: 1 });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue, queryState.search, setQueryState]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const deleteMutation = useDeleteBlogPostMutation();
  const bulkDeleteMutation = useBulkDeleteBlogPostMutation();

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    try {
      await deleteMutation.mutateAsync(postToDelete.id);
      toast.success(`Post "${postToDelete.title}" has been deleted`);
      setPostToDelete(null);
      setRowSelection({});
      refetch();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete post",
      );
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkDeleteMutation.mutateAsync(selectedIds);
      toast.success(`${selectedIds.length} posts have been deleted`);
      setIsBulkDeleteDialogOpen(false);
      setRowSelection({});
      refetch();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete posts",
      );
    }
  };

  const allColumns = getBlogColumns({
    openMenuId,
    setOpenMenuId,
    setPostToDelete,
  });

  const visibleColumns = allColumns.filter(
    (col) => !hiddenColumns.includes((col as any).accessorKey || col.id),
  );

  return (
    <div className="cyber-card clip-card flex flex-col p-4 lg:p-6 w-full relative z-0">
      
      <PostsToolbar
        selectedIds={selectedIds}
        setRowSelection={setRowSelection}
        setIsBulkDeleteDialogOpen={setIsBulkDeleteDialogOpen}
        isLoading={isLoading}
        totalItems={postsData?.meta?.totalItems || 0}
        searchValue={searchValue}
        handleSearch={handleSearch}
        openHideMenu={openHideMenu}
        setOpenHideMenu={setOpenHideMenu}
        allColumns={allColumns}
        hiddenColumns={hiddenColumns}
        setHiddenColumns={setHiddenColumns}
        openFilterMenu={openFilterMenu}
        setOpenFilterMenu={setOpenFilterMenu}
        queryState={queryState as any}
        setQueryState={setQueryState}
      />

      <DataTable
        columns={visibleColumns}
        data={postsData?.items || []}
        isLoading={isLoading}
        showPagination={false}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />

      <PostsPagination
        queryState={queryState as any}
        setQueryState={setQueryState}
        meta={postsData?.meta}
      />

      {/* ── Dialog Delete Single ── */}
      <CustomDialog
        open={!!postToDelete}
        onOpenChange={(open) => !open && setPostToDelete(null)}
        title="Delete Blog Post"
        description="This action cannot be undone. This will permanently delete the blog post."
        confirmText="Yes, delete it"
        onConfirm={handleDeletePost}
        isLoading={false}
        destructive
      >
        <p>
          Are you sure you want to delete the post{" "}
          <strong className="text-white">{postToDelete?.title}</strong>?
        </p>
      </CustomDialog>

      {/* ── Dialog Delete Bulk ── */}
      <CustomDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
        title="Delete Selected Posts"
        description="This action cannot be undone. This will permanently delete all selected blog posts."
        confirmText="Yes, delete them all"
        onConfirm={handleBulkDelete}
        isLoading={false}
        destructive
      >
        <p>
          Are you sure you want to delete{" "}
          <strong className="text-white">
            {selectedIds.length} posts
          </strong>
          ?
        </p>
      </CustomDialog>
    </div>
  );
}
