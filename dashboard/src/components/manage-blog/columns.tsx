"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { MoreHorizontal, Edit2, Trash2, Eye, CalendarDays } from "lucide-react";
import Link from "next/link";
import { BlogPostData } from "../../../types/manage-blogs";
import dayjs from "dayjs";

interface GetBlogColumnsProps {
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  setPostToDelete: (post: BlogPostData) => void;
}

export const getBlogColumns = ({
  openMenuId,
  setOpenMenuId,
  setPostToDelete,
}: GetBlogColumnsProps): ColumnDef<BlogPostData>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-cyber-border-subtle data-[state=checked]:bg-neon data-[state=checked]:text-black"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-cyber-body data-[state=checked]:bg-neon data-[state=checked]:text-black"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Post Title",
    cell: ({ row }) => {
      const title = row.original.title;
      const slug = row.original.slug;
      const coverImage = row.original.coverImage || "/icon.png";

      return (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-14 overflow-hidden rounded-md border border-cyber-border-subtle bg-cyber-surface-active shrink-0">
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-cyber-heading truncate max-w-50">
              {title}
            </span>
            <span className="text-[11px] text-cyber-body-subtle truncate max-w-50">
              /{slug}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const author = row.original.author;
      return (
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6 overflow-hidden rounded-full border border-cyber-border-subtle shrink-0">
            <Image
              src={author?.image || "/icon.png"}
              alt={author?.name || "Unknown"}
              fill
              sizes="24px"
              className="object-cover"
            />
          </div>
          <span className="text-cyber-body font-medium">
            {author?.name || "Unknown"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyber-border bg-cyber-surface-active px-2.5 py-0.5 text-[11px] font-medium text-cyber-body">
          {category?.name || "Uncategorized"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const isPublished = status === "PUBLISHED";
      const statusColor = isPublished ? "#00E676" : "#F5A623";

      return (
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: statusColor,
              boxShadow: `0 0 8px ${statusColor}`,
            }}
          />
          <span className="text-cyber-heading font-medium">
            {isPublished ? "Published" : "Draft"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return (
        <div className="flex items-center gap-1.5 text-cyber-heading font-medium">
          <CalendarDays size={14} className="text-cyber-body-subtle" />
          {dayjs(date).format("DD MMM YYYY")}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center w-full">Actions</div>,
    cell: ({ row }) => {
      const post = row.original;
      const isMenuOpen = openMenuId === post.id;
      const isPublished = post.status === "PUBLISHED";

      return (
        <div className="text-center relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(isMenuOpen ? null : post.id);
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-cyber text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>

          {isMenuOpen && (
            <>
              {/* Overlay untuk menutup menu jika klik di luar */}
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(null);
                }}
              />
              <div className="absolute right-8 top-8 z-20 w-44 rounded-cyber border border-cyber-border bg-[#0a0a0f] p-2 shadow-lg glow-neon">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-sm p-2 text-[14px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                >
                  <Eye size={16} />
                  Preview
                </button>

                <Link
                  href={`/manage-blog/posts/edit/${post.id}`}
                  className="flex w-full items-center gap-2 rounded-sm p-2 text-[14px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                >
                  <Edit2 size={16} />
                  Edit Post
                </Link>

                <div className="my-1 border-t border-cyber-border" />

                <button
                  type="button"
                  onClick={() => {
                    setPostToDelete(post);
                    setOpenMenuId(null);
                  }}
                  className="flex w-full items-center gap-2 rounded-sm p-2 text-[14px] font-medium text-[#FF3366] hover:bg-[#FF3366]/10 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete Post
                </button>
              </div>
            </>
          )}
        </div>
      );
    },
  },
];
