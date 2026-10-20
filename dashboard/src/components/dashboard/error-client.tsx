"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  LayoutDashboard,
  ArrowLeft,
  Copy,
  Check,
  Terminal,
  Radio,
  Package,
  TableProperties,
  FileType,
  BookUser,
  Newspaper,
  Compass,
  Cpu,
  ShieldAlert,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
  Activity,
  Flame,
} from "lucide-react";
import { DatalinesWithGrid } from "@/components/neonblade-ui/datalines-with-grid";
import { ThemeChanger } from "@/components/layout/theme-changer";

interface ErrorClientProps {
  error: Error & { digest?: string };
  reset: () => void;
  isGlobal?: boolean;
}

const safeLinks = [
  {
    label: "Main Dashboard",
    href: "/",
    icon: LayoutDashboard,
    badge: "CORE",
    desc: "Primary command center & metrics",
  },
  {
    label: "Manage Stocks",
    href: "/manage-stocks",
    icon: Package,
    badge: "STORE",
    desc: "Digital assets inventory",
  },
  {
    label: "Categories",
    href: "/manage-categories",
    icon: TableProperties,
    badge: "INDEX",
    desc: "Taxonomy & categorization",
  },
  {
    label: "File Types",
    href: "/manage-filetypes",
    icon: FileType,
    badge: "SCHEMA",
    desc: "Format definitions & extensions",
  },
  {
    label: "Vectyzen Port",
    href: "/manage-vectyzen",
    icon: BookUser,
    badge: "USERS",
    desc: "Contributor & creator profiles",
  },
  {
    label: "Cyber Blog",
    href: "/manage-blog/posts",
    icon: Newspaper,
    badge: "FEED",
    desc: "Editorial transmissions & news",
  },
];

export default function ErrorClient({ error, reset, isGlobal = false }: ErrorClientProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isRebooting, setIsRebooting] = useState(false);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticStep, setDiagnosticStep] = useState<string | null>(null);
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [showStack, setShowStack] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("00:00:00 UTC");
  const [currentPath, setCurrentPath] = useState<string>("/unknown");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname || "/");
    }

    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().substring(11, 19) + " UTC");
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleReboot = () => {
    setIsRebooting(true);
    setTimeout(() => {
      reset();
      setIsRebooting(false);
    }, 800);
  };

  const handleCopyErrorReport = async () => {
    const reportData = [
      "=== NADEV CYBERNETIC DASHBOARD — CRITICAL 500 INCIDENT REPORT ===",
      `TIMESTAMP: ${new Date().toISOString()}`,
      `ERROR_LEVEL: CRITICAL_KERNEL_PANIC // 500`,
      `TARGET_URI: ${currentPath}`,
      `DIGEST_TOKEN: ${error.digest || "0x500_UNASSIGNED_DIGEST"}`,
      `ERROR_MESSAGE: ${error.message || "Unknown internal server exception"}`,
      `ERROR_STACK: ${error.stack || "No stack trace available"}`,
      `SUBSYSTEM: KERNEL_PIPELINE // V2.16`,
      `OPERATOR_ACTION: Reboot / Reset Requested`,
      "================================================================",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(reportData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleRunIntegrityCheck = () => {
    if (isDiagnosticRunning) return;
    setIsDiagnosticRunning(true);
    setDiagnosticProgress(0);
    setDiagnosticStep("ANALYZING KERNEL RUNTIME...");

    const steps = [
      { progress: 25, text: "PROBING DATABASE CONNECTION POOL..." },
      { progress: 55, text: "INSPECTING MEMORY BUFFER OVERFLOW..." },
      { progress: 80, text: "CHECKING CACHE HANDSHAKE PROTOCOL..." },
      { progress: 100, text: "EXCEPTION ISOLATED // REBOOT RECOMMENDED" },
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setDiagnosticProgress(step.progress);
        setDiagnosticStep(step.text);
        if (idx === steps.length - 1) {
          setTimeout(() => setIsDiagnosticRunning(false), 1200);
        }
      }, (idx + 1) * 450);
    });
  };

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-cyber-bg text-cyber-heading font-sans flex flex-col selection:bg-[#FF1744] selection:text-white">
      {/* ── Background Layer 1: Animated Datalines Grid (Crimson/Danger Variant) ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <DatalinesWithGrid
          maxLines={18}
          lineColor="#FF1744"
          shadowColor="#FF1744"
          bgGridColor="rgba(255, 23, 68, 0.05)"
          cellSize={48}
          baseSpeed={2.2}
          lineLength={160}
          spawnProbability={0.1}
          overlay={false}
        />
      </div>

      {/* ── Background Layer 2: Cyber Grid & Emergency Radial Glow ── */}
      <div
        className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-40 z-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,23,68,0.15)_0%,rgba(84,234,253,0.06)_45%,#04040A_100%)] z-0"
        aria-hidden="true"
      />

      {/* ── Background Layer 3: Scanline Overlay ── */}
      <div
        className="scanline-overlay pointer-events-none fixed inset-0 z-10"
        aria-hidden="true"
      />

      {/* ── TOP HUD EMERGENCY STATUS BAR ── */}
      <header className="relative z-20 w-full border-b border-[#FF1744]/30 bg-cyber-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Brand + Alarm status */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="relative h-7 w-7 rounded-sm border border-[#FF1744]/60 p-0.5 bg-cyber-surface-raised shadow-[0_0_8px_rgba(255,23,68,0.3)]">
              <Image
                src="/icon.png"
                alt="Nadev Logo"
                fill
                sizes="28px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-sm font-bold tracking-[2px] text-cyber-heading uppercase">
                Nadev <span className="text-[#FF1744]">//</span> FAILSAFE
              </span>
              <span className="text-[10px] tracking-wider text-[#FF6B88]">
                {isGlobal ? "ROOT_GLOBAL_CRASH" : "CORE_KERNEL_PANIC"}
              </span>
            </div>
          </Link>

          {/* Center Telemetry Badges (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-cyber border border-[#FF1744]/40 bg-[#1F000C]/80 text-[#FF6B88]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF1744] animate-ping" />
              STATUS: <strong className="text-[#FF1744] font-medium">500 KERNEL_CRASH</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-cyber border border-cyber-border bg-cyber-surface-raised text-cyber-body">
              TIME: <span className="text-cyber-heading">{currentTime}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-cyber border border-cyber-border bg-cyber-surface-raised text-cyber-body">
              SAFE_MODE: <span className="text-neon">ACTIVE</span>
            </span>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReboot}
              disabled={isRebooting}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-heading uppercase tracking-wider text-white border border-[#FF1744]/60 bg-[#FF1744]/20 hover:bg-[#FF1744]/35 hover:border-[#FF1744] transition-all duration-150 rounded-cyber clip-button shadow-[0_0_10px_rgba(255,23,68,0.2)] disabled:opacity-50"
            >
              <RefreshCw
                size={13}
                className={isRebooting ? "animate-spin text-white" : ""}
              />
              <span>Reboot</span>
            </button>

            <ThemeChanger />
          </div>
        </div>
      </header>

      {/* ── MAIN EMERGENCY COCKPIT ── */}
      <main className="relative z-20 flex-1 flex flex-col justify-center items-center px-4 py-12 md:py-16">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">

          {/* ── HAZARD ALERT BADGE ── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-heading uppercase tracking-widest text-[#FF4D6E] bg-[#1F000C]/90 border border-[#FF1744]/50 rounded-cyber shadow-sm"
            style={{
              clipPath:
                "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)",
              boxShadow: "0 0 12px rgba(255, 23, 68, 0.2)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF1744] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF1744]" />
            </span>
            <AlertOctagon size={14} className="text-[#FF1744]" />
            <span>CRITICAL EXCEPTION // MAINFRAME OVERHEAT</span>
          </motion.div>

          {/* ── GIANT GLITCHING 500 DISPLAY ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative flex items-center justify-center my-2 select-none"
          >
            {/* Ambient hazard rotating radar ring */}
            <div
              className="absolute pointer-events-none h-64 w-64 md:h-80 md:w-80 rounded-full border border-[#FF1744]/25 animate-[spin_30s_linear_infinite]"
              style={{
                borderStyle: "dashed",
              }}
            />
            <div className="absolute pointer-events-none h-48 w-48 md:h-60 md:w-60 rounded-full border border-neon/15" />

            {/* Corner Hazard brackets */}
            <div className="absolute -left-6 md:-left-12 top-1/2 -translate-y-1/2 font-mono text-[#FF1744]/50 text-xl md:text-3xl font-light">
              [
            </div>
            <div className="absolute -right-6 md:-right-12 top-1/2 -translate-y-1/2 font-mono text-[#FF1744]/50 text-xl md:text-3xl font-light">
              ]
            </div>

            {/* Main 500 typography */}
            <div className="relative">
              <span
                className="font-heading font-extrabold text-7xl sm:text-8xl md:text-9xl lg:text-[160px] leading-none tracking-[6px] md:tracking-[12px] uppercase text-[#FF1744] block"
                style={{
                  textShadow:
                    "0 0 10px rgba(255, 23, 68, 0.7), 0 0 30px rgba(255, 23, 68, 0.4), 0 0 70px rgba(255, 23, 68, 0.2)",
                }}
              >
                500
              </span>
              <div
                className="absolute inset-0 bg-linear-to-t from-cyber-bg via-transparent to-transparent pointer-events-none opacity-40"
              />
            </div>
          </motion.div>

          {/* ── HEADING AND LEAD PARAGRAPH ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
            className="mt-4 mb-8 max-w-2xl"
          >
            <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-[3px] text-cyber-heading mb-4">
              SYSTEM CORE FAILURE
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-cyber-body font-sans">
              An unexpected neural exception breached the central mainframe
              pipeline. Data stream integrity was severed to safeguard backend
              memory arrays. Execute a reboot or report the error signature below.
            </p>
          </motion.div>

          {/* ── PRIMARY ACTION BUTTONS ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 w-full"
          >
            {/* Primary Action — Reboot Matrix (reset) */}
            <button
              onClick={handleReboot}
              disabled={isRebooting}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-heading font-semibold uppercase tracking-wider bg-[#FF1744] text-white rounded-cyber clip-button transition-all duration-150 ease-out hover:bg-[#D40030] active:scale-[0.98] disabled:opacity-60"
              style={{
                boxShadow:
                  "0 1px 3px 0 rgba(255, 23, 68, 0.12), inset rgba(255, 255, 255, 0.25) 0 1px 0px 0px, 0 0 20px rgba(255, 23, 68, 0.4)",
              }}
            >
              <RefreshCw
                size={16}
                className={isRebooting ? "animate-spin" : ""}
              />
              <span>{isRebooting ? "REBOOTING CORE..." : "SYSTEM REBOOT // RETRY"}</span>
            </button>

            {/* Secondary Action — Return to Dashboard */}
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-heading font-medium uppercase tracking-wider bg-neon text-[#04040A] rounded-cyber clip-button transition-all duration-150 ease-out hover:bg-neon-strong glow-neon active:scale-[0.98]"
            >
              <LayoutDashboard size={16} />
              <span>RETURN TO COCKPIT</span>
            </Link>

            {/* Tertiary Action — Previous Node */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-heading font-medium uppercase tracking-wider bg-cyber-surface border border-cyber-border text-cyber-heading rounded-cyber clip-button transition-all duration-150 ease-out hover:bg-cyber-surface-hover hover:border-neon/60 hover:text-neon glow-neon active:scale-[0.98]"
            >
              <ArrowLeft size={16} />
              <span>PREVIOUS NODE</span>
            </button>

            {/* Quaternary Action — Run Integrity Check */}
            <button
              onClick={handleRunIntegrityCheck}
              disabled={isDiagnosticRunning}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-heading font-medium uppercase tracking-wider bg-cyber-surface border border-cyber-border text-cyber-body rounded-cyber clip-button transition-all duration-150 ease-out hover:bg-cyber-surface-hover hover:text-cyber-heading active:scale-[0.98] disabled:opacity-60"
            >
              <Activity
                size={16}
                className={isDiagnosticRunning ? "animate-pulse text-[#FF1744]" : ""}
              />
              <span>{isDiagnosticRunning ? "PROBING..." : "DIAGNOSTIC TEST"}</span>
            </button>
          </motion.div>

          {/* ── INTEGRITY TEST PROGRESS (WHEN RUNNING) ── */}
          <AnimatePresence>
            {isDiagnosticRunning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-xl mb-8 overflow-hidden"
              >
                <div className="p-4 rounded-cyber border border-[#FF1744]/40 bg-[#1F000C]/90 clip-card text-left">
                  <div className="flex items-center justify-between text-xs font-mono text-[#FF4D6E] mb-2">
                    <span className="flex items-center gap-1.5">
                      <Radio size={14} className="animate-pulse text-[#FF1744]" />
                      {diagnosticStep}
                    </span>
                    <span>{diagnosticProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-cyber-border overflow-hidden rounded-full">
                    <div
                      className="h-full bg-[#FF1744] transition-all duration-300 shadow-[0_0_8px_#ff1744]"
                      style={{ width: `${diagnosticProgress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── HUD EXCEPTION DUMP & TELEMETRY TERMINAL (CLIP-CARD) ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
            className="w-full max-w-2xl mb-12"
          >
            <div className="relative p-5 rounded-cyber bg-cyber-surface/90 border border-[#FF1744]/30 backdrop-blur-md shadow-md text-left clip-card">
              {/* Corner decorative HUD ticks in red */}
              <div className="absolute top-2 left-2 text-[#FF1744]/50 text-[10px] font-mono select-none">
                ┌
              </div>
              <div className="absolute top-2 right-2 text-[#FF1744]/50 text-[10px] font-mono select-none">
                ┐
              </div>
              <div className="absolute bottom-2 left-2 text-[#FF1744]/50 text-[10px] font-mono select-none">
                └
              </div>
              <div className="absolute bottom-2 right-2 text-[#FF1744]/50 text-[10px] font-mono select-none">
                ┘
              </div>

              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between border-b border-cyber-border pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FF1744] animate-pulse" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FFEA00]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-neon" />
                  </div>
                  <span className="text-xs font-mono font-medium text-cyber-body tracking-wider uppercase ml-1 flex items-center gap-1">
                    <Terminal size={12} className="text-[#FF1744]" />
                    KERNEL_PANIC // EXCEPTION_DUMP
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyErrorReport}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-cyber-body hover:text-[#FF4D6E] border border-cyber-border hover:border-[#FF1744]/40 bg-cyber-surface-hover rounded-cyber transition-all duration-150"
                    title="Copy full error report"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-[#FF1744]" />
                        <span className="text-[#FF4D6E]">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>COPY LOG</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Monospace Log Lines */}
              <div className="space-y-1.5 font-mono text-xs text-cyber-body">
                <div className="flex items-start gap-2">
                  <span className="text-[#FF1744] select-none">&gt;</span>
                  <span>
                    EXCEPTION:{" "}
                    <strong className="text-[#FF4D6E]">500_INTERNAL_SERVER_ERROR</strong>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#FF1744] select-none">&gt;</span>
                  <span className="break-all">
                    MESSAGE:{" "}
                    <span className="text-cyber-heading font-medium">
                      {error.message || "An unhandled runtime error halted execution."}
                    </span>
                  </span>
                </div>
                {error.digest && (
                  <div className="flex items-start gap-2">
                    <span className="text-[#FF1744] select-none">&gt;</span>
                    <span>
                      DIGEST_HASH:{" "}
                      <code className="text-neon bg-cyber-surface-raised px-1 py-0.5 rounded-sm">
                        {error.digest}
                      </code>
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="text-[#FF1744] select-none">&gt;</span>
                  <span>
                    SUBSYSTEM:{" "}
                    <span className="text-cyber-heading">
                      CORE_PIPELINE // RUNTIME_MONITOR
                    </span>
                  </span>
                </div>

                {/* Collapsible Stack Trace */}
                {error.stack && (
                  <div className="pt-2">
                    <button
                      onClick={() => setShowStack(!showStack)}
                      className="flex items-center gap-1 text-[11px] text-neon hover:underline mb-2"
                    >
                      {showStack ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      <span>{showStack ? "HIDE RAW CALL STACK" : "SHOW RAW CALL STACK"}</span>
                    </button>

                    <AnimatePresence>
                      {showStack && (
                        <motion.pre
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-3 rounded-sm bg-black/70 border border-cyber-border text-[11px] text-[#FF6B88] font-mono overflow-x-auto max-h-48 whitespace-pre-wrap break-all"
                        >
                          {error.stack}
                        </motion.pre>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── EMERGENCY SAFE-MODE DIRECTORY (QUICK JUMP) ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25, ease: "easeOut" }}
            className="w-full text-left"
          >
            <div className="flex items-center gap-2 mb-4 border-b border-cyber-border pb-2">
              <Compass size={14} className="text-neon" />
              <h2 className="text-xs font-heading font-semibold uppercase tracking-[2px] text-cyber-heading">
                SAFE MODE DIRECTORY // CORE TELEPORT
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {safeLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative p-3.5 rounded-cyber bg-cyber-surface/70 border border-cyber-border hover:border-[#FF1744]/60 hover:bg-cyber-surface-hover transition-all duration-150 ease-out clip-card flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-cyber-surface-raised border border-cyber-border group-hover:border-[#FF1744]/50 group-hover:text-[#FF1744] transition-colors">
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-heading font-semibold uppercase tracking-wider text-cyber-heading group-hover:text-[#FF4D6E] transition-colors">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-sm bg-cyber-surface-raised border border-cyber-border text-cyber-body-subtle group-hover:text-[#FF4D6E] group-hover:border-[#FF1744]/40">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-cyber-body line-clamp-1">
                      {item.desc}
                    </p>
                  </Link>
                );
              })}
            </div>
          </motion.div>

        </div>
      </main>

      {/* ── BOTTOM HUD EMERGENCY FOOTER ── */}
      <footer className="relative z-20 border-t border-cyber-border bg-cyber-surface/80 py-4 px-4 text-center">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-cyber-body-subtle">
          <div className="flex items-center gap-2">
            <Cpu size={12} className="text-[#FF1744]" />
            <span>NADEV MATRIX OS // KERNEL FAILSAFE CONTROLLER</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[#FF6B88]">
              <ShieldAlert size={12} className="text-[#FF1744]" />
              ALERT LEVEL: 5 (CRITICAL)
            </span>
            <span>AUTO-ISOLATION: ENGAGED</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
