"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const hasVerified = useRef(false);
  useEffect(() => {
    // Mencegah double-fetch di React Strict Mode
    if (hasVerified.current) return;
    if (!token) {
      setStatus("error");
      setErrorMsg("Token verifikasi tidak ditemukan.");
      return;
    }
    const verify = async () => {
      hasVerified.current = true;
      try {
        // Proses validasi token ke Better Auth
        const { error } = await authClient.verifyEmail({
          query: { token },
        });
        if (error) throw error;

        setStatus("success");
        // Opsional: otomatis redirect setelah sukses
        setTimeout(() => router.push("/vectyzen/me"), 3000);
      } catch (err: any) {
        setStatus("error");
        setErrorMsg(err.message || "Token tidak valid atau sudah kedaluwarsa.");
      }
    };
    verify();
  }, [token, router]);
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {status === "loading" && (
        <>
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <h1 className="text-2xl font-bold">Verifying Email...</h1>
          <p className="text-muted-foreground mt-2">Please wait a moment.</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold">Email Successfully Verified!</h1>
          <p className="text-muted-foreground mt-2 mb-6">
            Your email address has been updated. Redirecting you...
          </p>
          <Button asChild>
            <Link href="/vectyzen/me">Go Back Now</Link>
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="h-16 w-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold">Verification Failed</h1>
          <p className="text-muted-foreground mt-2 mb-6">{errorMsg}</p>
          <Button asChild>
            <Link href="/vectyzen/me">Back to Settings</Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default VerifyEmailContent;
