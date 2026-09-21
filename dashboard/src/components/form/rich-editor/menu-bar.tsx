import { cn } from "@/lib/utils";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  Loader,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";

const MenuBar = ({
  editor,
  onImageClick,
  isUploadingImage,
}: {
  editor: any;
  onImageClick: () => void;
  isUploadingImage: boolean;
}) => {
  if (!editor) return null;
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
    // -----------------------------------------------------
    // TOMBOL INSERT IMAGE BARU
    // -----------------------------------------------------
    {
      icon: ImageIcon,
      action: onImageClick,
      isActive: false,
      label: "Insert Image",
      isLoading: isUploadingImage,
    },
    { divider: true },
    // -----------------------------------------------------
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
    <div className="flex flex-wrap items-center gap-1 rounded-cyber border border-cyber-border bg-cyber-surface-active p-1 sticky top-32 z-10 shadow-md">
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
            type="button"
            key={btn.label}
            onClick={btn.action}
            title={btn.label}
            disabled={btn.isLoading}
            className={cn(
              "p-1.5 rounded-sm transition-colors",
              btn.isActive
                ? "bg-[rgba(84,234,253,0.15)] text-neon"
                : "text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading",
              btn.isLoading && "opacity-50 cursor-not-allowed",
            )}
          >
            {btn.isLoading ? (
              <Loader size={16} className="animate-spin text-neon" />
            ) : (
              <Icon size={16} />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MenuBar;
