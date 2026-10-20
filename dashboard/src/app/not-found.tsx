import type { Metadata } from "next";
import NotFoundClient from "@/components/dashboard/not-found-client";

export const metadata: Metadata = {
  title: "404 — Sector Not Found | Nadev Dashboard",
  description: "Unreachable sector coordinates in Nadev Dashboard matrix.",
};

export default function NotFound() {
  return <NotFoundClient />;
}
