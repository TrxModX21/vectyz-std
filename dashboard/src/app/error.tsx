"use client";

import ErrorClient from "@/components/dashboard/error-client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorClient error={error} reset={reset} />;
}
