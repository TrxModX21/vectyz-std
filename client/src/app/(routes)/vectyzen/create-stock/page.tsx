"use client";

import FadeIn from "@/components/common/fade-in";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileIcon, ImageIcon, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

const CreateStockPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [previewDragActive, setPreviewDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handlePreviewDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setPreviewDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setPreviewFile(file);
      setPreviewUrl(URL.createObjectURL(file as any));
    }
  };

  return (
    <FadeIn>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Upload New Asset</h1>
          <p className="text-muted-foreground">
            Share your creativity with the world.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Asset Details</CardTitle>
            <CardDescription>
              Provide accurate information to help users find your asset.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="e.g. Modern Abstract Background" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vectors">Vectors</SelectItem>
                    <SelectItem value="photos">Photos</SelectItem>
                    <SelectItem value="psd">PSD</SelectItem>
                    <SelectItem value="icons">Icons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">File Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eps">EPS</SelectItem>
                    <SelectItem value="ai">AI</SelectItem>
                    <SelectItem value="jpg">JPG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separated by comma)</Label>
              <Input
                id="tags"
                placeholder="abstract, modern, colorful, geometric..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your asset in detail..."
                className="min-h-[150px]"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline">Cancel</Button>
              <Button>Upload Asset</Button>
            </div>
          </CardContent>
        </Card>

        {/* File Drag & Drop */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>File Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:bg-muted/50"
                }`}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  multiple
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files) {
                      setFiles((prev) => [
                        ...prev,
                        ...Array.from(e.target.files!),
                      ]);
                    }
                  }}
                />
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center pointer-events-none">
                    <UploadCloud className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="pointer-events-none">
                    <p className="font-medium">
                      Click or drag file to this area to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Support for EPS, AI, PSD, JPG, PNG
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    className="pointer-events-none"
                  >
                    Select File
                  </Button>
                </div>
              </div>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm truncate max-w-[150px] sm:max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFiles((prev) =>
                            prev.filter((_, i) => i !== index),
                          );
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`aspect-video bg-muted rounded-md flex items-center justify-center border text-muted-foreground overflow-hidden relative cursor-pointer transition-colors ${
                  previewDragActive
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/80"
                }`}
                onDragEnter={() => setPreviewDragActive(true)}
                onDragLeave={() => setPreviewDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handlePreviewDrop}
                onClick={() => previewInputRef.current?.click()}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={previewInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      setPreviewFile(file);
                      setPreviewUrl(URL.createObjectURL(file as any));
                    }
                  }}
                />
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 pointer-events-none">
                    <ImageIcon className="h-8 w-8 opacity-50" />
                    <span className="text-xs">
                      Click or drag image for preview
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FadeIn>
  );
};

export default CreateStockPage;
