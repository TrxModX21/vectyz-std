"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VectyzLogo from "@/components/common/vectyz-logo";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import Link from "next/link";
import { Field, FieldLabel } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import {
  ForgotPasswordSchema,
  forgotPasswordSchema,
} from "@/validators/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordSchema) => {
    setIsPending(true);
    await authClient.requestPasswordReset(
      {
        email: values.email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      },
      {
        onSuccess: () => {
          toast.success("If an account exists, a reset link has been sent.");
          setIsPending(false);
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
            Forgot Password?
          </h1>
          <p className="text-sm text-gray-500">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Email */}
          <Field className="space-y-2">
            <FieldLabel
              htmlFor="email"
              className="text-gray-500 text-xs font-normal ml-1"
            >
              Email address
            </FieldLabel>
            <Input
              id="email"
              className="rounded-full h-11 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600"
              type="email"
              placeholder="m@example.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </Field>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 rounded-full bg-[#0047AB] hover:bg-blue-600 text-white font-semibold shadow-md"
          >
            {isPending && <Loader className="animate-spin mr-2" />}
            Send Reset Link
            <ArrowRight className="ml-2 size-4" />
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

export default ForgotPasswordPage;
