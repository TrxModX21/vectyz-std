"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeft,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
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
} from "lucide-react";
import { DatalinesWithGrid } from "@/components/neonblade-ui/datalines-with-grid";
import { ThemeChanger } from "@/components/layout/theme-changer";

const quickLinks = [
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

export default function NotFoundClient() {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string>("/unknown-sector");
  const [copied, setCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>("00:00:00 UTC");
  const [latency, setLatency] = useState<number>(14);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname || "/unknown-sector");
    }

    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toISOString().substring(11, 19) + " UTC",
      );
      // Small simulated latency jitter between 11ms and 19ms
      setLatency(12 + Math.floor(Math.sin(now.getTime() / 1000) * 4));
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyLog = async () => {
    const logData = [
      "=== NADEV CYBERNETIC DASHBOARD — TELEMETRY ERROR REPORT ===",
      `TIMESTAMP: ${new Date().toISOString()}`,
      `ERROR_CODE: 0x404_SECTOR_NOT_FOUND`,
      `TARGET_URI: ${currentPath}`,
      `STATUS: HTTP 404 (UNREACHABLE_NODE)`,
      `SUBSYSTEM: NAV_ROUTER_CORE_V2`,
      `CLEARANCE: LEVEL_4_AUTHORIZED`,
      `ACTION: Operator fallback initiated`,
      "===========================================================",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(logData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleRunReScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setScanMessage("INITIALIZING CYBER RADAR SWEEP...");

    const intervals = [
      { progress: 28, text: "PROBING REGIONAL SUBNETS..." },
      { progress: 58, text: "VERIFYING MATRIX ROUTING TABLES..." },
      { progress: 85, text: "SYNCHRONIZING WITH PRIMARY CORE..." },
      { progress: 100, text: "SWEEP COMPLETE // NODE UNREACHABLE (404 CONFIRMED)" },
    ];

    intervals.forEach((step, idx) => {
      setTimeout(() => {
        setScanProgress(step.progress);
        setScanMessage(step.text);
        if (idx === intervals.length - 1) {
          setTimeout(() => setIsScanning(false), 1200);
        }
      }, (idx + 1) * 450);
    });
  };

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-cyber-bg text-cyber-heading font-sans flex flex-col selection:bg-neon selection:text-[#04040A]">
      {/* ── Background Layer 1: Animated Datalines Grid ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <DatalinesWithGrid
          maxLines={18}
          lineColor="#54EAFD"
          shadowColor="#54EAFD"
          bgGridColor="rgba(84, 234, 253, 0.04)"
          cellSize={48}
          baseSpeed={1.8}
          lineLength={140}
          spawnProbability={0.08}
          overlay={false}
        />
      </div>

      {/* ── Background Layer 2: Cyber Grid & Ambient Radial Glow ── */}
      <div
        className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-40 z-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(84,234,253,0.12)_0%,rgba(4,4,10,0.8)_60%,#04040A_100%)] z-0"
        aria-hidden="true"
      />

      {/* ── Background Layer 3: Scanline Overlay ── */}
      <div
        className="scanline-overlay pointer-events-none fixed inset-0 z-10"
        aria-hidden="true"
      />

      {/* ── TOP HUD COCKPIT STATUS BAR ── */}
      <header className="relative z-20 w-full border-b border-cyber-border bg-cyber-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Brand + System indicator */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="relative h-7 w-7 rounded-sm border border-neon/40 p-0.5 bg-cyber-surface-raised">
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
                Nadev <span className="text-neon">//</span> OS
              </span>
              <span className="text-[10px] tracking-wider text-cyber-body-subtle">
                SEC_COCKPIT // V2.16
              </span>
            </div>
          </Link>

          {/* Center Telemetry Badges (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-cyber border border-cyber-border bg-cyber-surface-raised text-cyber-body">
              <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
              STATUS: <strong className="text-neon font-medium">DISCONNECTED</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-cyber border border-cyber-border bg-cyber-surface-raised text-cyber-body">
              PING: <span className="text-cyber-heading">{latency}ms</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-cyber border border-cyber-border bg-cyber-surface-raised text-cyber-body">
              TIME: <span className="text-cyber-heading">{currentTime}</span>
            </span>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-xs font-heading uppercase tracking-wider text-neon border border-neon/30 bg-neon/5 hover:bg-neon/15 hover:border-neon transition-all duration-150 rounded-cyber clip-button"
            >
              <LayoutDashboard size={13} />
              <span>Cockpit</span>
            </Link>

            <ThemeChanger />
          </div>
        </div>
      </header>

      {/* ── MAIN COCKPIT CONTAINER ── */}
      <main className="relative z-20 flex-1 flex flex-col justify-center items-center px-4 py-12 md:py-16">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">

          {/* ── STATUS ALERT BADGE ── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-heading uppercase tracking-widest text-[#FF4D6E] bg-[#1F000C]/90 border border-[#FF1744]/40 rounded-cyber shadow-sm"
            style={{
              clipPath:
                "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF1744] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF1744]" />
            </span>
            <AlertTriangle size={14} className="text-[#FF1744]" />
            <span>TRANSMISSION TERMINATED // ANOMALY DETECTED</span>
          </motion.div>

          {/* ── GIANT GLITCHING 404 DISPLAY ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative flex items-center justify-center my-2 select-none"
          >
            {/* Ambient HUD target concentric radar ring */}
            <div
              className="absolute pointer-events-none h-64 w-64 md:h-80 md:w-80 rounded-full border border-neon/15 animate-[spin_40s_linear_infinite]"
              style={{
                borderStyle: "dashed",
              }}
            />
            <div className="absolute pointer-events-none h-48 w-48 md:h-60 md:w-60 rounded-full border border-neon/10" />

            {/* Corner HUD accent brackets */}
            <div className="absolute -left-6 md:-left-12 top-1/2 -translate-y-1/2 font-mono text-neon/40 text-xl md:text-3xl font-light">
              [
            </div>
            <div className="absolute -right-6 md:-right-12 top-1/2 -translate-y-1/2 font-mono text-neon/40 text-xl md:text-3xl font-light">
              ]
            </div>

            {/* Main 404 typography */}
            <div className="relative">
              <span
                className="font-heading font-extrabold text-7xl sm:text-8xl md:text-9xl lg:text-[160px] leading-none tracking-[6px] md:tracking-[12px] uppercase text-neon glow-text-neon block"
                style={{
                  textShadow:
                    "0 0 10px rgba(84, 234, 253, 0.6), 0 0 30px rgba(84, 234, 253, 0.3), 0 0 60px rgba(84, 234, 253, 0.15)",
                }}
              >
                404
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
              SECTOR NOT FOUND
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-cyber-body font-sans">
              The requested neural coordinates do not correspond to any active
              node in the Nadev Dashboard matrix. The sector may have been
              decommissioned, relocated, or purged from the core routing index.
            </p>
          </motion.div>

          {/* ── PRIMARY ACTION BUTTONS ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 w-full"
          >
            {/* Primary Action — Return to Dashboard */}
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-heading font-semibold uppercase tracking-wider bg-neon text-[#04040A] rounded-cyber clip-button transition-all duration-150 ease-out hover:bg-neon-strong glow-neon active:scale-[0.98]"
              style={{
                boxShadow:
                  "0 1px 3px 0 rgba(84, 234, 253, 0.08), inset rgba(84, 234, 253, 0.25) 0 1px 0px 0px, rgba(84, 234, 253, 0.2) 0 0 18px -2px",
              }}
            >
              <LayoutDashboard size={16} />
              <span>RETURN TO COCKPIT</span>
            </Link>

            {/* Secondary Action — Previous Node */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-heading font-medium uppercase tracking-wider bg-cyber-surface border border-cyber-border text-cyber-heading rounded-cyber clip-button transition-all duration-150 ease-out hover:bg-cyber-surface-hover hover:border-neon/60 hover:text-neon glow-neon active:scale-[0.98]"
            >
              <ArrowLeft size={16} />
              <span>PREVIOUS NODE</span>
            </button>

            {/* Tertiary Action — Run Diagnostic Sweep */}
            <button
              onClick={handleRunReScan}
              disabled={isScanning}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-heading font-medium uppercase tracking-wider bg-cyber-surface border border-cyber-border text-cyber-body rounded-cyber clip-button transition-all duration-150 ease-out hover:bg-cyber-surface-hover hover:text-cyber-heading active:scale-[0.98] disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={isScanning ? "animate-spin text-neon" : ""}
              />
              <span>{isScanning ? "SCANNING..." : "RUN DIAGNOSTIC"}</span>
            </button>
          </motion.div>

          {/* ── SCANNER PROGRESS (WHEN TRIGGERED) ── */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-xl mb-8 overflow-hidden"
              >
                <div className="p-4 rounded-cyber border border-neon/30 bg-cyber-surface-raised clip-card text-left">
                  <div className="flex items-center justify-between text-xs font-mono text-neon mb-2">
                    <span className="flex items-center gap-1.5">
                      <Radio size={14} className="animate-pulse" />
                      {scanMessage}
                    </span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-cyber-border overflow-hidden rounded-full">
                    <div
                      className="h-full bg-neon transition-all duration-300 shadow-[0_0_8px_#54eafd]"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── HUD DIAGNOSTICS & TELEMETRY TERMINAL (CLIP-CARD) ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
            className="w-full max-w-2xl mb-12"
          >
            <div
              className="relative p-5 rounded-cyber bg-cyber-surface/90 border border-cyber-border backdrop-blur-md shadow-md text-left clip-card"
            >
              {/* Corner decorative HUD ticks */}
              <div className="absolute top-2 left-2 text-neon/40 text-[10px] font-mono select-none">
                ┌
              </div>
              <div className="absolute top-2 right-2 text-neon/40 text-[10px] font-mono select-none">
                ┐
              </div>
              <div className="absolute bottom-2 left-2 text-neon/40 text-[10px] font-mono select-none">
                └
              </div>
              <div className="absolute bottom-2 right-2 text-neon/40 text-[10px] font-mono select-none">
                ┘
              </div>

              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between border-b border-cyber-border pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FF1744]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FFEA00]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-neon" />
                  </div>
                  <span className="text-xs font-mono font-medium text-cyber-body tracking-wider uppercase ml-1 flex items-center gap-1">
                    <Terminal size={12} className="text-neon" />
                    SYSTEM_TRACE // BUFFER_LOG
                  </span>
                </div>

                <button
                  onClick={handleCopyLog}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-cyber-body hover:text-neon border border-cyber-border hover:border-neon/40 bg-cyber-surface-hover rounded-cyber transition-all duration-150"
                  title="Copy log to clipboard"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-neon" />
                      <span className="text-neon">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>COPY TRACE</span>
                    </>
                  )}
                </button>
              </div>

              {/* Monospace Log Lines */}
              <div className="space-y-1.5 font-mono text-xs text-cyber-body">
                <div className="flex items-start gap-2">
                  <span className="text-neon select-none">&gt;</span>
                  <span>
                    ERR_CODE:{" "}
                    <strong className="text-[#FF4D6E]">0x404_NULL_REFERENCE</strong>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-neon select-none">&gt;</span>
                  <span className="break-all">
                    TARGET_PATH:{" "}
                    <code className="text-neon bg-cyber-surface-raised px-1 py-0.5 rounded-sm">
                      {currentPath}
                    </code>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-neon select-none">&gt;</span>
                  <span>
                    STATE:{" "}
                    <span className="text-cyber-heading">UNRESOLVED_SECTOR_COORDINATES</span>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-neon select-none">&gt;</span>
                  <span>
                    DAEMON:{" "}
                    <span className="text-cyber-heading">
                      NAV_CORE // PROTOCOL_LEVEL_4 (NADEV_OS)
                    </span>
                  </span>
                </div>
                <div className="flex items-start gap-2 text-cyber-body-subtle">
                  <span className="text-neon select-none">&gt;</span>
                  <span>
                    RECOMMENDATION: Divert telemetry to authenticated active
                    sectors.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── QUICK SECTOR TELEPORT / ACTIVE NODES GRID ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25, ease: "easeOut" }}
            className="w-full text-left"
          >
            <div className="flex items-center gap-2 mb-4 border-b border-cyber-border pb-2">
              <Compass size={14} className="text-neon" />
              <h2 className="text-xs font-heading font-semibold uppercase tracking-[2px] text-cyber-heading">
                ACTIVE SECTOR DIRECTORY // QUICK JUMP
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative p-3.5 rounded-cyber bg-cyber-surface/70 border border-cyber-border hover:border-neon/60 hover:bg-cyber-surface-hover transition-all duration-150 ease-out clip-card flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-cyber-surface-raised border border-cyber-border group-hover:border-neon/40 group-hover:text-neon transition-colors">
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-heading font-semibold uppercase tracking-wider text-cyber-heading group-hover:text-neon transition-colors">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-sm bg-cyber-surface-raised border border-cyber-border text-cyber-body-subtle group-hover:text-neon group-hover:border-neon/40">
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

      {/* ── BOTTOM HUD COCKPIT FOOTER ── */}
      <footer className="relative z-20 border-t border-cyber-border bg-cyber-surface/80 py-4 px-4 text-center">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-cyber-body-subtle">
          <div className="flex items-center gap-2">
            <Cpu size={12} className="text-neon" />
            <span>NADEV MATRIX OS // SECTOR ACCESS CONTROLLER</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <ShieldAlert size={12} className="text-neon" />
              STATUS: NOMINAL
            </span>
            <span>CLEARANCE: LEVEL 4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
