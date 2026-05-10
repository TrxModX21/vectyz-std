import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  useCheckUsernameAvailable,
  useUpdateProfileBio,
  useLinkedAccounts,
} from "@/hooks/use-profile";
import ChangeEmailDialog from "./change-email-dialog";
import {
  UpdateProfileBioShcema,
  updateProfileBioSchema,
} from "@/validators/profile.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";

const BioCard = ({
  user,
  profile,
}: {
  user: User | undefined;
  profile: Profile | undefined;
}) => {
  const { mutate, isPending } = useUpdateProfileBio();
  const { data: linkedAccounts } = useLinkedAccounts();
  
  const hasPassword = linkedAccounts?.some((acc) => acc.providerId === "credential");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  const form = useForm<UpdateProfileBioShcema>({
    resolver: zodResolver(updateProfileBioSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      mobile: profile?.mobile || "",
      address: profile?.address || "",
      city: profile?.city || "",
      state: profile?.state || "",
      country: profile?.countryName || "",
      zip: profile?.zip || "",
    },
  });

  const watchUsername = form.watch("username");
  const [debouncedUsername] = useDebounceValue(watchUsername, 500);

  const isUsernameChanged = debouncedUsername !== user?.username;

  const { data: isAvailable, isFetching: isCheckingUsername } =
    useCheckUsernameAvailable(isUsernameChanged, debouncedUsername);

  const isUsernameTaken = isAvailable === false && isUsernameChanged;
  const isButtonDisabled = isPending || isCheckingUsername || isUsernameTaken;

  const onSubmit = (values: UpdateProfileBioShcema) => {
    try {
      mutate(values, {
        onSuccess: () => {
          toast.success("Profile updated successfully!");
        },
      });
    } catch (err) {
      toast.error("An error occurred during updating information");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your public profile details.</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="fullName" className="gap-0">
                Full Name <span className="text-red-500">*</span>
              </FieldLabel>
              <Input id="fullName" {...form.register("name")} />
              {form.formState.errors.name && (
                <FieldError>{form.formState.errors.name.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="username" className="gap-0">
                Username <span className="text-red-500">*</span>
              </FieldLabel>
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <Input id="username" {...form.register("username")} />
                </div>
                {isCheckingUsername && (
                  <Loader className="animate-spin w-5 h-5 text-muted-foreground" />
                )}
                {!isCheckingUsername &&
                  isUsernameChanged &&
                  debouncedUsername.length >= 3 &&
                  (isAvailable ? (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 hover:bg-green-100 whitespace-nowrap"
                    >
                      <BadgeCheck className="w-3 h-3 mr-1 inline" /> Available
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="whitespace-nowrap">
                      Unavailable
                    </Badge>
                  ))}
              </div>
              {form.formState.errors.username && (
                <FieldError>
                  {form.formState.errors.username.message}
                </FieldError>
              )}
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="mobile" className="gap-0">
                Mobile Phone
              </FieldLabel>
              <Input
                id="mobile"
                placeholder="+628520000000"
                {...form.register("mobile")}
              />
              {form.formState.errors.mobile && (
                <FieldError>{form.formState.errors.mobile.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Email Address</FieldLabel>
              <ButtonGroup>
                <Input value={user?.email} readOnly />
                {hasPassword === false ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className="cursor-default hover:bg-secondary text-muted-foreground whitespace-nowrap"
                    disabled
                  >
                    Linked to Google
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEmailDialogOpen(true)}
                    className="bg-v-green text-background hover:bg-green-500 hover:text-background"
                  >
                    Change
                  </Button>
                )}
              </ButtonGroup>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="address" className="gap-0">
              Address
            </FieldLabel>
            <Input
              id="address"
              placeholder="123 Main St"
              {...form.register("address")}
            />
            {form.formState.errors.address && (
              <FieldError>{form.formState.errors.address.message}</FieldError>
            )}
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="city" className="gap-0">
                City
              </FieldLabel>
              <Input
                id="city"
                placeholder="New York"
                {...form.register("city")}
              />
              {form.formState.errors.city && (
                <FieldError>{form.formState.errors.city.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="state" className="gap-0">
                State
              </FieldLabel>
              <Input id="state" placeholder="NY" {...form.register("state")} />
              {form.formState.errors.state && (
                <FieldError>{form.formState.errors.state.message}</FieldError>
              )}
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="country" className="gap-0">
                Country
              </FieldLabel>
              <Input
                id="country"
                placeholder="United States"
                {...form.register("country")}
              />
              {form.formState.errors.country && (
                <FieldError>{form.formState.errors.country.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="zip" className="gap-0">
                Zip Code
              </FieldLabel>
              <Input id="zip" placeholder="23236" {...form.register("zip")} />
              {form.formState.errors.zip && (
                <FieldError>{form.formState.errors.zip.message}</FieldError>
              )}
            </Field>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end mt-4">
          <Button disabled={isButtonDisabled}>
            {(isPending || isCheckingUsername) && (
              <Loader className="animate-spin mr-2" />
            )}
            Save Changes
          </Button>
        </CardFooter>
      </form>
      <ChangeEmailDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
      />
    </Card>
  );
};

export default BioCard;
