"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar/sidebar";
import { Header } from "./header/header";
import { DatalinesWithGrid } from "../neonblade-ui/datalines-with-grid";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-dvh bg-cyber-bg">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="lg:pl-64">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="relative p-4 md:p-6 lg:p-8">
          {/* Background grid pattern */}
          <div
            className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-50 lg:left-64"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto max-w-[1152px] min-h-dvh">
            {children}
          </div>

          <DatalinesWithGrid maxLines={20} />
        </main>
      </div>
    </div>
  );
}
