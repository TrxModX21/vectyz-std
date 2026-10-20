"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { PasswordInput } from "@/components/form/password-input";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    setIsPending(true);
    // Simulate API update
    setTimeout(() => {
      setIsPending(false);
      setIsSuccess(true);
    }, 1000);
  };

  const hasMinLength = password.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(password);
  const isMatching = password.length > 0 && password === confirmPassword;

  return (
    <>
      {/* Brand */}
      <div className="mb-10 flex items-center gap-3">
        <div className="relative h-9 w-9">
          <Image
            src="/icon.png"
            alt="Nadev"
            fill
            sizes="36px"
            className="object-contain"
            priority
          />
        </div>
        <span className="text-lg font-heading tracking-wider text-cyber-heading">
          Nadev
        </span>
      </div>

      {isSuccess ? (
        /* Success State */
        <div className="space-y-6">
          <div className="p-6 rounded-cyber border border-neon/30 bg-cyber-surface clip-card text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-neon/10 border border-neon/30 text-neon">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h2 className="text-base font-heading font-bold uppercase tracking-wider text-cyber-heading">
                  Security Key Updated
                </h2>
                <p className="text-xs text-cyber-body">
                  New credentials registered
                </p>
              </div>
            </div>

            <p className="text-sm text-cyber-body leading-relaxed mb-4">
              Your operator credentials have been successfully updated in the
              neural authentication matrix. You may now authenticate with your
              new password.
            </p>

            <div className="text-xs text-cyber-body-subtle p-3 rounded-sm bg-cyber-surface-active border border-cyber-border font-mono">
              &gt; STATUS: CREDENTIALS_REHASHED_OK
              <br />
              &gt; ENCRYPTION: SHA-256 // AES-GCM
            </div>
          </div>

          <Link
            href="/auth/sign-in"
            className="glow-neon w-full py-3 text-[13px] font-medium uppercase tracking-wider transition-all duration-150 ease-out clip-button bg-[#54EAFD] text-[#04040A] hover:bg-neon-strong flex items-center justify-center gap-2"
          >
            <KeyRound size={15} />
            <span>Proceed to Sign In</span>
          </Link>
        </div>
      ) : (
        /* Reset Password Form */
        <>
          {/* Heading */}
          <h1 className="mb-2 text-2xl tracking-[2px] md:text-3xl">
            Reset Password
          </h1>
          <p className="mb-8 text-sm text-cyber-body">
            Establish a new security key to restore your operator clearance.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <PasswordInput
              id="new-password"
              label="New Security Key"
              placeholder="••••••••"
              icon={Lock}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Confirm Password */}
            <PasswordInput
              id="confirm-password"
              label="Confirm Security Key"
              placeholder="••••••••"
              icon={Lock}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={error || undefined}
            />

            {/* Cyber Security Requirements Card */}
            <div className="p-3.5 rounded-cyber bg-cyber-surface-raised border border-cyber-border text-xs space-y-2">
              <span className="font-heading uppercase text-[10px] tracking-wider text-cyber-body-subtle block">
                Security Parameters
              </span>
              <div className="flex items-center gap-2 text-cyber-body font-mono text-[11px]">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    hasMinLength ? "bg-neon" : "bg-cyber-body-subtle"
                  }`}
                />
                <span className={hasMinLength ? "text-cyber-heading" : ""}>
                  Minimum 8 characters
                </span>
              </div>
              <div className="flex items-center gap-2 text-cyber-body font-mono text-[11px]">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    hasNumberOrSymbol ? "bg-neon" : "bg-cyber-body-subtle"
                  }`}
                />
                <span className={hasNumberOrSymbol ? "text-cyber-heading" : ""}>
                  Includes number or special character
                </span>
              </div>
              <div className="flex items-center gap-2 text-cyber-body font-mono text-[11px]">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isMatching ? "bg-neon" : "bg-cyber-body-subtle"
                  }`}
                />
                <span className={isMatching ? "text-cyber-heading" : ""}>
                  Passwords match
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="glow-neon w-full py-3 text-[13px] font-medium uppercase tracking-wider transition-all duration-150 ease-out clip-button bg-[#54EAFD] text-[#04040A] hover:bg-neon-strong flex gap-2 items-center justify-center disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader className="animate-spin" size={16} />
                  <span>Updating Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Save New Password</span>
                </>
              )}
            </button>

            {/* Back link */}
            <div className="flex items-center justify-center pt-2">
              <Link
                href="/auth/sign-in"
                className="flex items-center gap-1.5 text-[13px] font-medium text-cyber-body transition-colors duration-150 hover:text-neon hover:underline"
              >
                <ArrowLeft size={14} />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default ResetPasswordPage;
