"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader, Mail, Send } from "lucide-react";
import { Input } from "@/components/form/input";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsPending(true);
    // Simulate API transmission
    setTimeout(() => {
      setIsPending(false);
      setIsSubmitted(true);
    }, 1000);
  };

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

      {isSubmitted ? (
        /* Success State */
        <div className="space-y-6">
          <div className="p-6 rounded-cyber border border-neon/30 bg-cyber-surface clip-card text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-neon/10 border border-neon/30 text-neon">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h2 className="text-base font-heading font-bold uppercase tracking-wider text-cyber-heading">
                  Transmission Sent
                </h2>
                <p className="text-xs text-cyber-body">
                  Recovery instructions dispatched
                </p>
              </div>
            </div>

            <p className="text-sm text-cyber-body leading-relaxed mb-4">
              We have transmitted password reset coordinates to{" "}
              <strong className="text-neon font-medium">{email}</strong>. Please
              inspect your terminal inbox and follow the authorization link.
            </p>

            <div className="text-xs text-cyber-body-subtle p-3 rounded-sm bg-cyber-surface-active border border-cyber-border font-mono">
              &gt; STATUS: 200_DISPATCH_OK
              <br />
              &gt; TOKEN_EXPIRY: 15_MINUTES
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="w-full py-2.5 text-xs font-medium uppercase tracking-wider transition-all duration-150 ease-out clip-button border border-cyber-border bg-cyber-surface hover:bg-cyber-surface-hover hover:border-neon text-cyber-heading"
            >
              Resend Transmission
            </button>

            <Link
              href="/auth/sign-in"
              className="flex items-center justify-center gap-2 text-[13px] font-medium text-neon hover:text-neon-strong hover:underline transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Return to Sign In</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Request Form State */
        <>
          {/* Heading */}
          <h1 className="mb-2 text-2xl tracking-[2px] md:text-3xl">
            Recover Access
          </h1>
          <p className="mb-8 text-sm text-cyber-body">
            Enter your registered operator email to receive security key reset
            instructions.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="forgot-email"
              type="email"
              label="Operator Email"
              placeholder="you@example.com"
              icon={Mail}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Submit button */}
            <button
              type="submit"
              disabled={isPending}
              className="glow-neon w-full py-3 text-[13px] font-medium uppercase tracking-wider transition-all duration-150 ease-out clip-button bg-[#54EAFD] text-[#04040A] hover:bg-neon-strong flex gap-2 items-center justify-center disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader className="animate-spin" size={16} />
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Send Reset Link</span>
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

export default ForgotPasswordPage;
