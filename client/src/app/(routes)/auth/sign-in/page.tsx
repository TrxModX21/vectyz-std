"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import VectyzLogo from "@/components/common/vectyz-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ArrowRight, Eye, EyeOff, Loader } from "lucide-react";
import { LoginSchema, loginSchema } from "@/validators/auth.validation";

const SignInPage = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    setIsPending(true);
    try {
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
        },
        {
          onSuccess: async (ctx) => {
            toast.success("Login successful");
            router.push("/");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
            setIsPending(false);
          },
        },
      );
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Connection failed to server. Try again later");
      setIsPending(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL,
    });
    setGoogleLoading(false);
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
            Sign in
          </h1>
          <p className="text-sm text-gray-500">
            New user?{" "}
            <Link
              href="/auth/sign-up"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create an account
            </Link>
          </p>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          variant="outline"
          className="w-full h-11 rounded-full border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 font-normal shadow-sm"
        >
          {googleLoading && <Loader className="animate-spin" />}
          <GoogleIcon />
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or</span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel
                htmlFor="email"
                className="text-gray-500 text-xs font-normal ml-1"
              >
                Email address
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="rounded-full h-11 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <FieldError>{form.formState.errors.email.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel
                htmlFor="password"
                className="text-gray-500 text-xs font-normal ml-1"
              >
                Password
              </FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="rounded-full h-11 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600"
                  placeholder="*********"
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
                <FieldError>
                  {form.formState.errors.password.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <div className="flex items-center justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-bold"
                >
                  Forgot your password?
                </Link>
              </div>
            </Field>

            <Field>
              <Button
                disabled={isPending}
                type="submit"
                className="w-full h-11 rounded-full bg-[#0047AB] hover:bg-blue-600 text-white font-semibold shadow-md"
              >
                {isPending && <Loader className="animate-spin mr-2" />}
                Sign in
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};

const GoogleIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
};

export default SignInPage;
