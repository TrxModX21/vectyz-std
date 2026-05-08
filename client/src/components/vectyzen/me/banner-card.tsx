import ProfileBanner from "@/components/profile/profile-banner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { useUpdateBanner } from "@/hooks/use-profile";
import { uploadToCloudinary } from "@/lib/helpers";
import {
  UpdateAvatarAndBannerSchema,
  updateAvatarAndBannerSchema,
} from "@/validators/profile.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const BannerCard = ({ user }: { user: User | undefined }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useUpdateBanner();
  const form = useForm<UpdateAvatarAndBannerSchema>({
    resolver: zodResolver(updateAvatarAndBannerSchema),
  });

  const updateLoading = isPending || isUploading;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview);
      const objectUrl = URL.createObjectURL(file as any);
      setPreview(objectUrl);
      form.setValue("image", file);
    } else {
      e.target.value = "";
    }
  };

  const handleUpdate = async (values: UpdateAvatarAndBannerSchema) => {
    try {
      setIsUploading(true);
      toast.loading("Uploading image...", { id: "update-banner" });

      const uploadedAvatar = await uploadToCloudinary(
        values.image!,
        (progress) => {
          setUploadProgress(progress);
        },
        "vectyz/users/banners",
      );

      mutate(
        { image: uploadedAvatar.url },
        {
          onSuccess: () => {
            toast.success("Banner updated successfully", {
              id: "update-banner",
            });
            form.reset();
            setPreview(null);
            setUploadProgress(0);
            setIsUploading(false);
          },
          onError: (err) => {
            toast.error("An error occured during banner update", {
              id: "update-banner",
            });
            setIsUploading(false);
          },
        },
      );
    } catch (err) {
      toast.error("An error occurred during banner update", {
        id: "update-banner",
      });
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleUpdate)}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Banner</CardTitle>
          <CardDescription className="flex flex-col gap-1">
            <span className="text-muted-foreground">
              This banner will show on your profile page.
            </span>
            <p>Recomended banner dimension: 1367 x 768 px</p>
          </CardDescription>
          <CardAction>
            <Field>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                disabled={updateLoading}
              />
              <Button
                variant="outline"
                type="button"
                className="bg-v-green text-background hover:bg-v-green/90 hover:text-background/90"
                onClick={() => !updateLoading && fileInputRef.current?.click()}
              >
                Change Banner
              </Button>
            </Field>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ProfileBanner preview={preview} user={user} />
        </CardContent>
        {preview && (
          <CardFooter>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <Button type="submit" disabled={updateLoading} className="w-full">
                {updateLoading && <Loader className="animate-spin" />}
                {updateLoading ? `Uploading (${uploadProgress}%)` : "Save"}
              </Button>
              <Button
                variant="destructive"
                disabled={updateLoading}
                className="w-full"
                onClick={() => {
                  setPreview(null);
                  form.reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </form>
  );
};

export default BannerCard;
