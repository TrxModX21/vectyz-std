"use client";

import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PostEditorView } from "@/components/manage-blog/post-editor-view";
import { useBlogPost } from "@/features/manage-blogs/queries";
import { Loader2 } from "lucide-react";

export default function EditPostPage() {
  const params = useParams();
  const postId = params.id as string;

  const { data: postRes, isLoading, isError } = useBlogPost(postId);
  const postData = postRes?.data;

  return (
    <DashboardLayout>
      <div className="w-full h-full pb-10">
        {isLoading ? (
          <div className="flex h-100 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError || !postData ? (
          <div className="flex h-100 flex-col items-center justify-center space-y-2">
            <p className="text-xl font-semibold">Failed to load post</p>
            <p className="text-sm text-muted-foreground">
              The post you are trying to edit could not be found.
            </p>
          </div>
        ) : (
          <PostEditorView postData={postData} />
        )}
      </div>
    </DashboardLayout>
  );
}
