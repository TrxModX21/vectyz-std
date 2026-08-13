"use client";

import { Mail, Lock, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/form/input";
import { PasswordInput } from "@/components/form/password-input";
import { toast } from "@/components/uitripled/notification-center-shadcnui";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LoginSchemaType, loginSchema } from "@/validators/auth.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signOut } from "@/lib/auth-client";

const SignInPage = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchemaType) => {
    setIsPending(true);
    try {
      await signIn.email(
        {
          email: values.email,
          password: values.password,
        },
        {
          onSuccess: async (ctx) => {
            // Check if user is admin
            if (ctx.data.user.role !== "admin") {
              toast.error("Access Denied: You are not an admin");
              await signOut(); // Force logout
              setIsPending(false);
              return;
            }

            toast.success("Login successfully");
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

  return (
    <>
      {/* Brand */}
      <div className="mb-10 flex items-center gap-3">
        <div className="relative h-9 w-9">
          <Image
            src="/icon.png"
            alt="Vectolio"
            fill
            sizes="36px"
            className="object-contain"
          />
        </div>
        <span className="text-lg font-heading tracking-wider text-cyber-heading">
          VECTOLIO
        </span>
      </div>

      {/* Heading */}
      <h1 className="mb-2 text-2xl tracking-[2px] md:text-3xl">Welcome Back</h1>
      <p className="mb-8 text-sm text-cyber-body">
        Sign in to your account to continue
      </p>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Two-column field grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Email */}
          <Input
            id="login-email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            icon={Mail}
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />

          <PasswordInput
            id="login-password"
            label="Password"
            placeholder="••••••••"
            icon={Lock}
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />
        </div>

        {/* Remember me + Forgot password row */}
        <div className="flex items-center justify-end">
          <Link
            href="#"
            className="text-[13px] font-medium text-[#54EAFD] transition-colors duration-150 hover:text-neon-strong hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isPending}
          className="glow-neon w-full py-3 text-[13px] font-medium uppercase tracking-wider transition-all duration-150 ease-out clip-button bg-[#54EAFD] text-[#04040A] hover:bg-neon-strong flex gap-1 items-center justify-center"
        >
          {isPending && <Loader className="animate-spin mr-2" />}
          Sign In
        </button>
      </form>
    </>
  );
};

export default SignInPage;
