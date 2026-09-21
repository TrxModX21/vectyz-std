"use client";

import { ImagePicker } from "@/components/form/image-picker";
import { Input } from "@/components/form/input";
import { toast } from "@/components/uitripled/notification-center-shadcnui";
import { useUpdateBlogSettingsMutation } from "@/features/manage-blogs/mutations";
import { useBlogSettings } from "@/features/manage-blogs/queries";
import { uploadToCloudinary } from "@/lib/helpers";
import {
  UpdateBlogSettingSchema,
  updateBlogSettingSchema,
} from "@/validators/manage-blogs.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";
import { Save, Globe, Server, Hash, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export function SeoSettingsView() {
  const [isUploading, setIsUploading] = useState(false);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  // 1. Fetch data setting blog dari backend
  const { data: settingsResponse, isLoading: isLoadingSettings } =
    useBlogSettings();
  const updateSettingsMutation = useUpdateBlogSettingsMutation();
  const settings = settingsResponse?.data;

  // 2. Inisialisasi React Hook Form
  const form = useForm<UpdateBlogSettingSchema>({
    resolver: zodResolver(updateBlogSettingSchema),
    defaultValues: {
      defaultSeoTitle: "",
      defaultSeoDescription: "",
      defaultSocialImage: undefined,
      facebookUrl: "",
      twitterUrl: "",
      instagramUrl: "",
      linkedinUrl: "",
      youtubeUrl: "",
    },
  });

  // 3. Sinkronisasi data saat data selesai di-fetch dari backend
  useEffect(() => {
    if (settings) {
      form.reset({
        defaultSeoTitle: settings.defaultSeoTitle || "",
        defaultSeoDescription: settings.defaultSeoDescription || "",
        defaultSocialImage: undefined,
        facebookUrl: settings.facebookUrl || "",
        twitterUrl: settings.twitterUrl || "",
        instagramUrl: settings.instagramUrl || "",
        linkedinUrl: settings.linkedinUrl || "",
        youtubeUrl: settings.youtubeUrl || "",
      });
      setIsImageRemoved(false);
    }
  }, [settings, form]);

  // 4. Submit Handler (Upload image ke Cloudinary jika baru, lalu PATCH ke API)
  const onSubmit = async (payload: UpdateBlogSettingSchema) => {
    try {
      setIsUploading(true);
      const toastId = toast.loading("Saving blog configuration...");
      // Default: gunakan gambar lama kecuali jika user menghapusnya
      let finalImageUrl: string | null = isImageRemoved
        ? null
        : settings?.defaultSocialImage || null;
      // Jika user memilih file baru
      if (
        payload.defaultSocialImage &&
        typeof payload.defaultSocialImage === "object"
      ) {
        toast.update(toastId, "Uploading social image... 0%", "info");
        const uploadResult = await uploadToCloudinary(
          payload.defaultSocialImage as File,
          (progress) => {
            toast.update(
              toastId,
              `Uploading social image... ${progress}%`,
              "info",
            );
          },
          "vectyz/blog/settings",
        );
        finalImageUrl = uploadResult.url;
      }
      toast.update(toastId, "Updating settings...", "info");
      await updateSettingsMutation.mutateAsync({
        ...payload,
        defaultSocialImage: finalImageUrl,
      });
      toast.update(
        toastId,
        "Blog configuration saved successfully!",
        "success",
      );
    } catch (error: any) {
      console.error("Failed to save blog settings:", error);
      toast.error(
        error?.response?.data?.message || "Failed to save configuration",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const isPending = isUploading || updateSettingsMutation.isPending;

  if (isLoadingSettings) {
    return (
      <div className="flex h-64 w-full max-w-4xl items-center justify-center">
        <Loader className="animate-spin text-neon" size={32} />
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-8 w-full max-w-4xl pb-10"
    >
      {/* Search Engine Optimization */}
      <section className="cyber-card clip-card flex flex-col p-4 lg:p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-cyber-border pb-4">
          <Globe className="text-neon" size={20} />
          <h3 className="text-lg font-medium text-cyber-heading">
            Search Engine Optimization
          </h3>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Input
              label="Default SEO Title Suffix"
              placeholder='e.g. " | Vectolio Blog"'
              error={form.formState.errors.defaultSeoTitle?.message}
              {...form.register("defaultSeoTitle")}
            />
            <p className="text-[11px] text-cyber-body-subtle">
              Appended to all blog post titles (e.g. "My Article | Vectolio
              Blog")
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-cyber-heading">
              Global Meta Description
            </label>
            <textarea
              rows={3}
              placeholder="Discover the best UI design trends, digital assets, and development tutorials on Vectolio."
              className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-sm text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:outline-none transition-colors resize-none clip-input"
              {...form.register("defaultSeoDescription")}
            />
            {form.formState.errors.defaultSeoDescription && (
              <p className="text-xs font-medium text-[#FF003C]">
                {form.formState.errors.defaultSeoDescription.message}
              </p>
            )}
            <p className="text-[11px] text-cyber-body-subtle">
              Used as a fallback when an article lacks a specific meta
              description.
            </p>
          </div>
        </div>
      </section>

      {/* Social Media & Open Graph */}
      <section className="cyber-card clip-card flex flex-col p-4 lg:p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-cyber-border pb-4">
          <Hash className="text-[#FF3366]" size={20} />
          <h3 className="text-lg font-medium text-cyber-heading">
            Social Media (Open Graph)
          </h3>
        </div>

        <div className="space-y-5">
          {/* Default OG Image Picker */}
          <div>
            <Controller
              control={form.control}
              name="defaultSocialImage"
              render={({ field, fieldState }) => (
                <ImagePicker
                  label="Default Open Graph Image"
                  value={field.value as any}
                  onChange={(file) => {
                    field.onChange(file);
                    if (file) setIsImageRemoved(false);
                  }}
                  onRemove={() => {
                    field.onChange(null);
                    setIsImageRemoved(true);
                  }}
                  error={fieldState.error?.message}
                  defaultPreviewUrl={
                    !field.value && !isImageRemoved
                      ? settings?.defaultSocialImage || undefined
                      : undefined
                  }
                />
              )}
            />
            <p className="mt-1.5 text-[11px] text-cyber-body-subtle">
              Used when a post doesn't have a featured image. Recommended:
              1200x630px
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Input
              label="Facebook URL"
              icon={IconBrandFacebook}
              placeholder="https://facebook.com/yourpage"
              error={form.formState.errors.facebookUrl?.message}
              {...form.register("facebookUrl")}
            />
            <Input
              label="Twitter / X URL"
              icon={IconBrandTwitter}
              placeholder="https://x.com/yourhandle"
              error={form.formState.errors.twitterUrl?.message}
              {...form.register("twitterUrl")}
            />
            <Input
              label="Instagram URL"
              icon={IconBrandInstagram}
              placeholder="https://instagram.com/yourprofile"
              error={form.formState.errors.instagramUrl?.message}
              {...form.register("instagramUrl")}
            />
            <Input
              label="LinkedIn URL"
              icon={IconBrandLinkedin}
              placeholder="https://linkedin.com/company/yourcompany"
              error={form.formState.errors.linkedinUrl?.message}
              {...form.register("linkedinUrl")}
            />
            <div className="md:col-span-2">
              <Input
                label="YouTube URL"
                icon={IconBrandYoutube}
                placeholder="https://youtube.com/@yourchannel"
                error={form.formState.errors.youtubeUrl?.message}
                {...form.register("youtubeUrl")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Preferences */}
      <section className="cyber-card clip-card flex flex-col p-4 lg:p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-cyber-border pb-4">
          <Server className="text-cyber-heading" size={20} />
          <h3 className="text-lg font-medium text-cyber-heading">
            Content Preferences
          </h3>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between p-3 rounded-cyber border border-cyber-border bg-cyber-surface-active">
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-cyber-heading">
                Enable Comments
              </span>
              <span className="text-[11px] text-cyber-body-subtle">
                Allow users to leave comments on published posts.
              </span>
            </div>
            <div className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-[rgba(84,234,253,0.3)] transition-colors">
              <span className="inline-block h-4 w-4 translate-x-4 transform rounded-full bg-neon shadow glow-neon transition-transform" />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-cyber border border-cyber-border bg-cyber-surface-active">
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-cyber-heading">
                Auto-publish Scheduled Posts
              </span>
              <span className="text-[11px] text-cyber-body-subtle">
                Requires CRON jobs to be properly configured.
              </span>
            </div>
            <div className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-cyber-border transition-colors">
              <span className="inline-block h-4 w-4 translate-x-0.5 transform rounded-full bg-cyber-body-subtle transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => settings && form.reset(settings as any)}
          disabled={isPending}
          className="rounded-cyber border border-cyber-border bg-transparent px-4 py-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors disabled:opacity-50"
        >
          Discard Changes
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-cyber border-none bg-neon px-6 py-2 text-[13px] font-bold text-[#04040A] hover:bg-[#3DC8DB] transition-all disabled:opacity-70"
        >
          {isPending ? (
            <Loader size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Configuration
        </button>
      </div>
    </form>
  );
}
