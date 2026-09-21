import React, { RefObject } from "react";
import MenuBar from "./menu-bar";
import { Editor, EditorContent } from "@tiptap/react";

const MainEditor = ({
  editor,
  isUploadingImage,
  fileInputRef,
  handleBlogContentImageUpload,
}: {
  editor: Editor | null;
  isUploadingImage: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleBlogContentImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => Promise<void>;
}) => {
  return (
    <div className="relative">
      <MenuBar
        editor={editor}
        onImageClick={() => fileInputRef.current?.click()}
        isUploadingImage={isUploadingImage}
      />
      {/* Hidden input untuk memicu dialog pilih file */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleBlogContentImageUpload}
      />
      <EditorContent editor={editor} />
    </div>
  );
};

export default MainEditor;
