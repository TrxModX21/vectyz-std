"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import VectyzLogo from "@/components/common/vectyz-logo";
import { ArrowLeft, Eye, EyeOff, Loader, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  ResetPasswordSchema,
  resetPasswordSchema,
} from "@/validators/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { Field, FieldLabel } from "@/components/ui/field";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Protect page: Redirect if no token
  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      router.replace("/");
    }
  }, [token, router]);

  if (!token) return null; // Prevent UI flash

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordSchema) => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    setIsPending(true);
    await authClient.resetPassword(
      {
        newPassword: values.password,
        token,
      },
      {
        onSuccess: () => {
          toast.success("Password has been reset successfully.");
          setIsPending(false);
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsPending(false);
        },
      },
    );
  };

  return (
    <div className="w-full md:w-[65%] flex flex-col items-center justify-center p-8 lg:p-12 relative bg-white">
      {/* Mobile Logo */}
      <div className="md:hidden mb-8">
        <VectyzLogo width={160} height={160} />
      </div>

      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Reset Password
          </h1>
          <p className="text-sm text-gray-500">
            Enter your new password below.
          </p>
        </div>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Field className="space-y-2">
            <FieldLabel
              htmlFor="email"
              className="text-gray-500 text-xs font-normal ml-1"
            >
              New Password
            </FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="rounded-full h-11 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600"
                {...form.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </Field>

          <Field className="space-y-2">
            <FieldLabel
              htmlFor="email"
              className="text-gray-500 text-xs font-normal ml-1"
            >
              Confirm Password
            </FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="rounded-full h-11 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600"
                {...form.register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </Field>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 rounded-full bg-[#0047AB] hover:bg-blue-600 text-white font-semibold shadow-md"
          >
            {isPending && <Loader className="animate-spin mr-2" />}
            <LockKeyhole className="mr-2 size-4" />
            Reset Password
          </Button>

          <Button variant="link" className="w-full" asChild>
            <Link href="/auth/sign-in">
              <ArrowLeft className="mr-2 size-4" />
              Back to Login
            </Link>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
