"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Image from "@tiptap/extension-image";
import { Save, ChevronLeft, Loader, Send, Check, Plus } from "lucide-react";
import Link from "next/link";
import imageCompression from "browser-image-compression";
import { cn } from "@/lib/utils";
import { Montserrat } from "next/font/google";
import { useRouter } from "next/navigation";
import {
  useBlogCategories,
  useBlogTags,
} from "@/features/manage-blogs/queries";
import { useCreateBlogPostMutation } from "@/features/manage-blogs/mutations";
import {
  CreateBlogPostSchema,
  createBlogPostSchema,
} from "@/validators/manage-blogs.validator";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/uitripled/notification-center-shadcnui";
import { extractPublicIdFromUrl, uploadToCloudinary } from "@/lib/helpers";
import { ImagePicker } from "@/components/form/image-picker";
import { api } from "@/lib/axios";
import MainEditor from "@/components/form/rich-editor/main-editor";

// Inisialisasi Font Montserrat untuk area editor
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

// Konten Awal
const initialContent = `
<h2>Welcome to Vectolio's Digital Asset Hub</h2>
<p>Discover high-quality vector illustrations, icons, and creative resources tailored for modern designers and developers.</p>
<h3>Why Choose Vectolio?</h3>
<ul>
  <li><strong>Premium Vectors:</strong> Handcrafted SVG, PNG, and EPS graphics ready for production.</li>
  <li><strong>Community Driven:</strong> Empowering creators worldwide to share and monetize their digital assets.</li>
  <li><strong>Seamless Integration:</strong> Optimized for web, mobile apps, and UI/UX design workflows.</li>
</ul>
<blockquote>"Elevate your visual storytelling with precision-crafted vectors."</blockquote>
`;

export function PostEditorView() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch Dynamic Taxonomy (Categories & Tags)
  const { data: categoriesRes } = useBlogCategories();
  const { data: tagsRes } = useBlogTags();
  const createPostMutation = useCreateBlogPostMutation();
  const categories = categoriesRes?.data || [];
  const availableTags = tagsRes?.data || [];

  // 2. React Hook Form Setup
  const form = useForm<CreateBlogPostSchema>({
    resolver: zodResolver(createBlogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      coverImage: undefined,
      status: "DRAFT",
      categoryId: null,
      tags: [],
      seoTitle: "",
      seoDescription: "",
    },
  });

  const selectedTags = form.watch("tags") || [];

  // 3. Setup Tiptap Editor dengan Font Montserrat
  const editor = useEditor({
    extensions: [StarterKit, Markdown, Image],
    content: initialContent,
    immediatelyRender: true,
    onUpdate: ({ editor }) => {
      const md = (editor as any).getMarkdown();
      form.setValue("content", md, { shouldValidate: true });
    },
    editorProps: {
      attributes: {
        class: cn(
          montserrat.className,
          "prose prose-invert max-w-none focus:outline-none min-h-[450px] mt-4 text-[15px] leading-relaxed text-cyber-body " +
            "[&_h2]:text-cyber-heading [&_h2]:[font-family:inherit] [&_h2]:tracking-wider [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-4 " +
            "[&_h3]:text-neon [&_h3]:[font-family:inherit] [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-3 " +
            "[&_a]:text-neon [&_a]:underline-offset-4 hover:[&_a]:text-[#3DC8DB] " +
            "[&_blockquote]:border-l-2 [&_blockquote]:border-neon [&_blockquote]:bg-cyber-surface-active [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:italic [&_blockquote]:text-cyber-heading " +
            "[&_code]:bg-cyber-surface-active [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-sm [&_code]:text-[#FF3366] [&_code]:font-mono [&_code]:text-[13px] " +
            "[&_pre]:bg-[#04040A] [&_pre]:border [&_pre]:border-cyber-border [&_pre]:p-4 [&_pre]:rounded-cyber [&_pre_code]:bg-transparent [&_pre_code]:text-cyber-body",
        ),
      },
    },
  });

  // Set initial markdown content ke form saat editor siap
  useEffect(() => {
    if (editor) {
      const md = (editor as any).getMarkdown();
      form.setValue("content", md);
    }
  }, [editor, form]);

  // 4. Tag Toggle Handler
  const toggleTag = (tagId: string) => {
    const currentTags = form.getValues("tags") || [];
    if (currentTags.includes(tagId)) {
      form.setValue(
        "tags",
        currentTags.filter((id) => id !== tagId),
      );
    } else {
      form.setValue("tags", [...currentTags, tagId]);
    }
  };

  // 5. Submit Handler (Save Draft / Publish Now)
  const handleSubmitPost = async (targetStatus: "DRAFT" | "PUBLISHED") => {
    form.setValue("status", targetStatus);
    form.handleSubmit(async (payload) => {
      try {
        setIsUploading(true);
        const toastId = toast.loading(
          targetStatus === "PUBLISHED"
            ? "Publishing article..."
            : "Saving draft...",
        );

        // ==========================================
        // 🧹 MULAI LOGIKA SAPU BERSIH GAMBAR
        // ==========================================
        toast.update(toastId, "Cleaning up unused images...", "info");

        const finalHtml = editor?.getHTML() || "";
        const dom = new DOMParser().parseFromString(finalHtml, "text/html");

        // Ambil semua URL gambar yang masih tersisa di editor
        const currentImages = Array.from(dom.querySelectorAll("img")).map(
          (img) => img.src,
        );
        // Cari gambar yang di-upload tapi sudah dihapus (orphaned)
        const orphanedImages = uploadedImageUrls.filter(
          (url) => !currentImages.includes(url),
        );
        // Hapus gambar yatim piatu di Cloudinary via endpoint bawaan Vectyz
        if (orphanedImages.length > 0) {
          await Promise.all(
            orphanedImages.map((url) => {
              const publicId = extractPublicIdFromUrl(url);
              if (publicId) {
                return api.post("/uploads/delete", { publicId });
              }
            }),
          );
        }
        // Reset state tracker ke gambar yang benar-benar ada
        setUploadedImageUrls(currentImages);
        // ==========================================
        // ✅ AKHIR LOGIKA SAPU BERSIH
        // ==========================================

        let coverImageUrl = "";
        // Upload cover image jika ada file baru yang dipilih
        if (payload.coverImage && typeof payload.coverImage === "object") {
          toast.update(toastId, "Uploading cover image... 0%", "info");
          const uploadResult = await uploadToCloudinary(
            payload.coverImage,
            (progress) => {
              toast.update(
                toastId,
                `Uploading cover image... ${progress}%`,
                "info",
              );
            },
            "vectyz/blog/posts",
          );
          coverImageUrl = uploadResult.url;
        }
        toast.update(toastId, "Creating article...", "info");
        await createPostMutation.mutateAsync({
          ...payload,
          coverImage: coverImageUrl,
          status: targetStatus,
          categoryId: payload.categoryId || null,
        });
        toast.update(
          toastId,
          targetStatus === "PUBLISHED"
            ? "Article published successfully!"
            : "Draft saved successfully!",
          "success",
        );
        // Redirect kembali ke tabel postingan blog
        router.push("/manage-blog/posts");
      } catch (error: any) {
        console.error("Failed to save post:", error);
        toast.error(error?.response?.data?.message || "Failed to save article");
      } finally {
        setIsUploading(false);
      }
    })();
  };

  const handleBlogContentImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);

    try {
      const options = {
        maxSizeMB: 0.5, // Target ukuran maksimal 500KB
        maxWidthOrHeight: 1200, // Dimensi maksimal 1200px (Sangat cukup untuk artikel web)
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      // 1. Langsung gunakan fungsi upload bawaan Vectyz
      const uploadResult = await uploadToCloudinary(
        compressedFile,
        undefined,
        "vectyz/blog/posts",
      );

      const imageUrl = uploadResult.url;
      // 2. Masukkan ke editor Tiptap
      editor?.chain().focus().setImage({ src: imageUrl }).run();
      // 3. Catat URL ini di state untuk pelacakan
      setUploadedImageUrls((prev) => [...prev, imageUrl]);
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isSaving = isUploading || createPostMutation.isPending;

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* ── Main Editor Area ── */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Top Header Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-cyber-border">
          <Link
            href="/manage-blog/posts"
            className="flex items-center gap-2 text-cyber-body hover:text-neon transition-colors text-[13px]"
          >
            <ChevronLeft size={16} />
            Back to Posts
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSubmitPost("DRAFT")}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-cyber border border-neon bg-[rgba(84,234,253,0.1)] px-4 py-1.5 text-[13px] font-medium text-neon hover:bg-[rgba(84,234,253,0.2)] transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <Loader size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Save Draft
            </button>
          </div>
        </div>

        {/* Editor Surface */}
        <div className="cyber-card clip-card flex flex-col p-6 w-full">
          {/* Post Title Input */}
          <input
            type="text"
            placeholder="Post Title..."
            {...form.register("title")}
            className={cn(
              montserrat.className,
              "w-full bg-transparent text-3xl text-cyber-heading placeholder:text-cyber-body-subtle focus:outline-none mb-2 tracking-wide",
            )}
          />
          {form.formState.errors.title && (
            <p className="text-xs font-medium text-[#FF003C] mb-4">
              {form.formState.errors.title.message}
            </p>
          )}

          {/* Tiptap Editor */}
          <MainEditor
            editor={editor}
            isUploadingImage={isUploadingImage}
            fileInputRef={fileInputRef}
            handleBlogContentImageUpload={handleBlogContentImageUpload}
          />
          {form.formState.errors.content && (
            <p className="text-xs font-medium text-[#FF003C] mt-2">
              {form.formState.errors.content.message}
            </p>
          )}
        </div>
      </div>

      {/* ── Sidebar Properties ── */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 lg:sticky lg:top-32 lg:self-start lg:overflow-y-auto [&::-webkit-scrollbar]:hidden pb-10">
        {/* Publish Settings */}
        <div className="cyber-card clip-card flex flex-col p-5">
          <h3 className="text-[14px] font-heading text-cyber-heading mb-4 border-b border-cyber-border pb-2">
            Publishing
          </h3>
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => handleSubmitPost("PUBLISHED")}
              disabled={isSaving}
              className="w-full flex justify-center items-center gap-2 rounded-cyber border-none bg-neon px-4 py-2.5 text-[13px] font-bold text-[#04040A] hover:bg-[#3DC8DB] transition-colors disabled:opacity-70"
            >
              {isSaving ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              Publish Now
            </button>
          </div>
        </div>

        {/* Taxonomy */}
        <div className="cyber-card clip-card flex flex-col p-5">
          <h3 className="text-[14px] font-heading text-cyber-heading mb-4 border-b border-cyber-border pb-2">
            Taxonomy
          </h3>
          <div className="space-y-4">
            {/* Category Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-cyber-body-subtle">
                Category
              </label>
              <select
                {...form.register("categoryId")}
                className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-[13px] text-cyber-heading focus:border-neon focus:outline-none"
              >
                <option value="">Select Category (None)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Tags Badges Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-cyber-body-subtle">Tags</label>
              {availableTags.length === 0 ? (
                <p className="text-[11px] text-cyber-body-subtle italic">
                  No tags available.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.id);
                    return (
                      <button
                        type="button"
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={cn(
                          "flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border transition-colors",
                          isSelected
                            ? "bg-[rgba(255,51,102,0.15)] border-[#FF3366] text-[#FF3366]"
                            : "bg-cyber-surface-active border-cyber-border text-cyber-body hover:border-cyber-border-subtle",
                        )}
                      >
                        {isSelected ? <Check size={12} /> : <Plus size={12} />}
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="cyber-card clip-card flex flex-col p-5">
          <h3 className="text-[14px] font-heading text-cyber-heading mb-4 border-b border-cyber-border pb-2">
            Featured Image
          </h3>
          <Controller
            control={form.control}
            name="coverImage"
            render={({ field, fieldState }) => (
              <ImagePicker
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* SEO Metadata */}
        <div className="cyber-card clip-card flex flex-col p-5">
          <h3 className="text-[14px] font-heading text-cyber-heading mb-4 border-b border-cyber-border pb-2">
            SEO Metadata
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-cyber-body-subtle">
                Custom URL Slug (Optional)
              </label>
              <input
                type="text"
                placeholder="my-awesome-post"
                {...form.register("slug")}
                className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:outline-none font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-cyber-body-subtle">
                Custom SEO Title (Optional)
              </label>
              <input
                type="text"
                placeholder="SEO Optimized Title"
                {...form.register("seoTitle")}
                className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-cyber-body-subtle">
                Meta Description (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Brief summary for Google search results..."
                {...form.register("seoDescription")}
                className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
