import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { useUpdateAvatar } from "@/hooks/use-profile";
import { uploadToCloudinary } from "@/lib/helpers";
import {
  UpdateAvatarAndBannerSchema,
  updateAvatarAndBannerSchema,
} from "@/validators/profile.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, MapPin } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const AvatarCard = ({ user }: { user: User | undefined }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  let userLocation = "Not set";
  if (user?.profile?.city && user?.profile.countryName) {
    userLocation = `${user?.profile?.city}, ${user?.profile?.countryName}`;
  }

  const { mutate, isPending } = useUpdateAvatar();
  const form = useForm<UpdateAvatarAndBannerSchema>({
    resolver: zodResolver(updateAvatarAndBannerSchema),
  });

  const avatarUpdateLoading = isPending || isUploading;

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

  const handleUpdateAvatar = async (values: UpdateAvatarAndBannerSchema) => {
    try {
      setIsUploading(true);
      toast.loading("Uploading image...", { id: "update-avatar" });

      const uploadedAvatar = await uploadToCloudinary(
        values.image!,
        (progress) => {
          setUploadProgress(progress);
        },
        "vectyz/users/avatars",
      );

      mutate(
        { image: uploadedAvatar.url },
        {
          onSuccess: () => {
            toast.success("Avatar updated successfully", {
              id: "update-avatar",
            });
            form.reset();
            setPreview(null);
            setUploadProgress(0);
            setIsUploading(false);
          },
          onError: (err) => {
            toast.error("An error occured during avatar update", {
              id: "update-avatar",
            });
            setIsUploading(false);
          },
        },
      );
    } catch (err) {
      toast.error("An error occurred during avatar update", {
        id: "update-avatar",
      });
      setIsUploading(false);
    }
  };

  return (
    <Card className="md:col-span-1 h-fit md:sticky md:top-24">
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Avatar className="h-32 w-32 mb-4">
          <AvatarImage src={preview || user?.image} alt="shadcn" />
          <AvatarFallback className="bg-v-green">
            {user?.name.slice(0)[0] || "VT"}
          </AvatarFallback>
        </Avatar>

        <div className="text-center my-2">
          <h3 className="font-bold text-lg leading-none">{user?.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            @{user?.username}
          </p>
        </div>

        {userLocation && (
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1 mb-2">
            <MapPin className="h-3 w-3" />
            <span>{userLocation}</span>
          </div>
        )}

        <form
          onSubmit={form.handleSubmit(handleUpdateAvatar)}
          className="w-full"
        >
          <Field>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              disabled={avatarUpdateLoading}
            />
            <Button
              variant="outline"
              className="w-full bg-v-green text-background hover:bg-v-green/90 hover:text-background/90"
              type="button"
              onClick={() =>
                !avatarUpdateLoading && fileInputRef.current?.click()
              }
            >
              Change Avatar
            </Button>
            {preview && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <Button
                  type="submit"
                  disabled={avatarUpdateLoading}
                  className="w-full"
                >
                  {avatarUpdateLoading && <Loader className="animate-spin" />}
                  {avatarUpdateLoading
                    ? `Uploading (${uploadProgress}%)`
                    : "Save"}
                </Button>
                <Button
                  variant="destructive"
                  disabled={avatarUpdateLoading}
                  className="w-full"
                  onClick={() => {
                    setPreview(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </Field>
        </form>
      </CardContent>
    </Card>
  );
};

export default AvatarCard;
