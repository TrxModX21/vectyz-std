"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  Save,
  Image as ImageIcon,
  ChevronLeft,
  X,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Komponen Toolbar Editor
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const buttons = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      label: "Bold",
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      label: "Italic",
    },
    {
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
      label: "Strikethrough",
    },
    { divider: true },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
      label: "Heading 2",
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
      label: "Heading 3",
    },
    { divider: true },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      label: "Bullet List",
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      label: "Ordered List",
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
      label: "Quote",
    },
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive("codeBlock"),
      label: "Code Block",
    },
    { divider: true },
    {
      icon: Undo,
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      label: "Undo",
    },
    {
      icon: Redo,
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      label: "Redo",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-cyber border border-cyber-border bg-cyber-surface-active p-1 sticky top-0 z-10 shadow-md">
      {buttons.map((btn, index) => {
        if (btn.divider) {
          return (
            <div
              key={`divider-${index}`}
              className="mx-1 h-5 w-px bg-cyber-border"
            />
          );
        }

        const Icon = btn.icon!;
        return (
          <button
            key={btn.label}
            onClick={btn.action}
            title={btn.label}
            className={cn(
              "p-1.5 rounded-sm transition-colors",
              btn.isActive
                ? "bg-[rgba(84,234,253,0.15)] text-neon"
                : "text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading"
            )}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
};

export function PostEditorView() {
  const [title, setTitle] = useState("");
  const [markdownOutput, setMarkdownOutput] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
    ],
    content: `
      <h2>Ini adalah Heading 2 Cyberpunk</h2>
      <p>Coba ketik sesuatu di sini. Anda dapat memformat teks menggunakan <strong>tombol di atas</strong> atau sintaks <em>Markdown</em> langsung.</p>
      <ul>
        <li>Gaya list modern</li>
        <li>Tampilan bersih</li>
      </ul>
      <blockquote>"Masa depan sudah ada di sini, ia hanya belum terdistribusi secara merata." - William Gibson</blockquote>
    `,
    onUpdate: ({ editor }) => {
      // Dapatkan output dalam format Markdown berkat @tiptap/markdown
      const md = (editor as any).getMarkdown();
      setMarkdownOutput(md);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[400px] mt-4 text-[15px] leading-relaxed text-cyber-body " +
          // Custom Cyberpunk Prose Styles overriding default prose
          "[&_h2]:text-cyber-heading [&_h2]:font-heading [&_h2]:tracking-wider [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-4 " +
          "[&_h3]:text-neon [&_h3]:font-heading [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-3 " +
          "[&_a]:text-neon [&_a]:underline-offset-4 hover:[&_a]:text-[#3DC8DB] " +
          "[&_blockquote]:border-l-2 [&_blockquote]:border-neon [&_blockquote]:bg-cyber-surface-active [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:italic [&_blockquote]:text-cyber-heading " +
          "[&_code]:bg-cyber-surface-active [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-sm [&_code]:text-[#FF3366] [&_code]:font-mono [&_code]:text-[13px] " +
          "[&_pre]:bg-[#04040A] [&_pre]:border [&_pre]:border-cyber-border [&_pre]:p-4 [&_pre]:rounded-cyber [&_pre_code]:bg-transparent [&_pre_code]:text-cyber-body",
      },
    },
  });

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
            <span className="text-[11px] text-cyber-body-subtle flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] glow-neon"></span>
              Draft Autosaved
            </span>
            <button className="flex items-center gap-2 rounded-cyber border border-neon bg-[rgba(84,234,253,0.1)] px-4 py-1.5 text-[13px] font-medium text-neon hover:bg-[rgba(84,234,253,0.2)] transition-colors">
              <Save size={14} />
              Save
            </button>
          </div>
        </div>

        {/* Editor Surface */}
        <div className="cyber-card clip-card flex flex-col p-6 w-full">
          {/* Post Title Input */}
          <input
            type="text"
            placeholder="Post Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-3xl font-heading text-cyber-heading placeholder:text-cyber-border-subtle focus:outline-none mb-6 tracking-wide"
          />

          {/* Tiptap Editor */}
          <div className="relative">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* ── Sidebar Properties ── */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        
        {/* Publish Settings */}
        <div className="cyber-card clip-card flex flex-col p-5">
          <h3 className="text-[14px] font-heading text-cyber-heading mb-4 border-b border-cyber-border pb-2">
            Publishing
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-cyber-body-subtle">Status</label>
              <select className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-[13px] text-cyber-heading focus:border-neon focus:outline-none">
                <option>Draft</option>
                <option>Published</option>
                <option>Scheduled</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-cyber-body-subtle">Visibility</label>
              <select className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-[13px] text-cyber-heading focus:border-neon focus:outline-none">
                <option>Public</option>
                <option>Private</option>
              </select>
            </div>
            <button className="w-full flex justify-center items-center gap-2 rounded-cyber border-none bg-neon px-4 py-2 text-[13px] font-bold text-[#04040A] hover:bg-[#3DC8DB] transition-colors mt-2">
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
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-cyber-body-subtle">Category</label>
              <select className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-[13px] text-cyber-heading focus:border-neon focus:outline-none">
                <option>Design</option>
                <option>Tutorials</option>
                <option>Development</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-cyber-body-subtle">Tags</label>
              <input
                type="text"
                placeholder="e.g. UI/UX, Cyberpunk"
                className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="cyber-card clip-card flex flex-col p-5">
          <h3 className="text-[14px] font-heading text-cyber-heading mb-4 border-b border-cyber-border pb-2">
            Featured Image
          </h3>
          <div className="relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-cyber border-2 border-dashed border-cyber-border bg-cyber-surface-active p-4 text-center transition-colors hover:border-neon hover:bg-cyber-surface-hover">
            <ImageIcon size={24} className="mb-2 text-cyber-body-subtle" />
            <p className="text-[12px] font-medium text-cyber-heading">
              Upload Image
            </p>
            <p className="mt-1 text-[10px] text-cyber-body-subtle">
              WebP or AVIF (1200x630px)
            </p>
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="cyber-card clip-card flex flex-col p-5">
          <h3 className="text-[14px] font-heading text-cyber-heading mb-4 border-b border-cyber-border pb-2">
            SEO Metadata
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-cyber-body-subtle">Custom URL Slug</label>
              <input
                type="text"
                placeholder="my-awesome-post"
                className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:outline-none font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-cyber-body-subtle">Meta Description</label>
              <textarea
                rows={3}
                placeholder="Brief summary for Google search results..."
                className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
