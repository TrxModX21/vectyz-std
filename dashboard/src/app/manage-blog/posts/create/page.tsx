import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PostEditorView } from "@/components/dashboard/blog/post-editor-view";

export default function CreatePostPage() {
  return (
    <DashboardLayout>
      <div className="w-full h-full pb-10">
        <PostEditorView />
      </div>
    </DashboardLayout>
  );
}
