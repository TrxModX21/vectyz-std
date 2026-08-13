import { ReactNode } from "react";
import {
  Binary,
  ChevronDown,
  Cloud,
  Cpu,
  Database,
  Globe,
  Mail,
  Phone,
  Server,
  Shield,
  Wifi,
  Zap,
} from "lucide-react";
import { DatalinesWithGrid } from "@/components/neonblade-ui/datalines-with-grid";
import HeaderDateTime from "@/components/layout/header/header-datetime";
import Image from "next/image";
import { ThemeChanger } from "@/components/layout/theme-changer";

const techGlyphs = [
  { icon: Shield, x: "20%", y: "10%", size: 28, delay: 0 },
  { icon: Zap, x: "55%", y: "5%", size: 22, delay: 100 },
  { icon: Globe, x: "80%", y: "15%", size: 26, delay: 200 },
  { icon: Cpu, x: "10%", y: "40%", size: 32, delay: 300 },
  { icon: Database, x: "40%", y: "30%", size: 24, delay: 400 },
  { icon: Wifi, x: "70%", y: "35%", size: 20, delay: 150 },
  { icon: Cloud, x: "85%", y: "50%", size: 28, delay: 250 },
  { icon: Server, x: "25%", y: "60%", size: 22, delay: 350 },
  { icon: Binary, x: "60%", y: "55%", size: 26, delay: 450 },
];

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full">
        {/* ── Top Utility Bar ── */}
        <div className="flex items-center justify-between px-4 py-1.5 text-[11px] bg-cyber-surface-raised border border-cyber-border-subtle">
          {/* Left — Contact / Status */}
          <div className="hidden items-center gap-4 sm:flex">
            <span className="flex items-center gap-1.5 text-cyber-body-subtle">
              <Phone size={11} />
              +1 (555) 123-4567
            </span>
            <span className="flex items-center gap-1.5 text-cyber-body-subtle">
              <Mail size={11} />
              support@vectolio.com
            </span>
          </div>

          {/* Right — Language, Time */}
          <div className="flex items-center gap-3 ml-auto">
            <button className="flex items-center gap-1 px-2 py-0.5 transition-colors duration-150 text-cyber-body-subtle hover:text-cyber-heading">
              <Globe size={11} />
              EN
              <ChevronDown size={10} />
            </button>

            <HeaderDateTime />
          </div>
        </div>

        {/* ── Primary Navbar ── */}
        <div className="flex items-center justify-between gap-4 px-4 py-2 bg-cyber-surface border-b border-cyber-border">
          {/* Center — Brand */}
          <div className="flex items-center gap-2">
            <div className="relative h-7 w-7">
              <Image
                src="/icon.png"
                alt="Vectolio"
                fill
                sizes="28px"
                loading="eager"
                className="object-contain"
              />
            </div>
            <span className="text-base tracking-wider sm:block font-heading text-cyber-heading">
              VECTOLIO
            </span>
          </div>

          {/* Right - Theme */}
          <div className="flex items-center gap-2">
            <ThemeChanger />
          </div>
        </div>
      </header>

      {/* Page container */}
      <div className="mx-auto flex min-h-dvh max-w-7xl flex-col items-center px-6 py-12 mb-8 xl:flex-row xl:gap-16 xl:py-0">
        {/* Background grid pattern */}
        <div
          className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-50 lg:left-64"
          aria-hidden="true"
        />

        {/* ═══ Left Column — Form ═══ */}
        <div className="w-full max-w-md xl:max-w-lg xl:flex-1 z-10">
          {children}
        </div>

        {/* ═══ Right Column — Decorative Panel ═══ */}
        <div className="mt-12 flex w-full max-w-md items-center justify-center xl:mt-0 xl:max-w-none xl:flex-1 z-10">
          <div className="relative flex h-[420px] w-full max-w-lg flex-col items-center justify-center overflow-hidden rounded-cyber border bg-cyber-surface clip-card border-cyber-border p-10">
            {/* Scanline overlay */}
            <div className="scanline-overlay pointer-events-none absolute inset-0" />

            {/* Background gradient */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[rgba(84,234,253,0.05)] via-transparent to-[rgba(180,77,255,0.04)]" />

            {/* Tech glyph cluster */}
            <div className="relative mb-8 h-48 w-full">
              {techGlyphs.map((glyph, i) => {
                const Icon = glyph.icon;
                return (
                  <div
                    key={i}
                    className="absolute flex items-center justify-center rounded-full border bg-cyber-surface-hover border-[rgba(84,234,253,0.15)]"
                    style={{
                      left: glyph.x,
                      top: glyph.y,
                      width: glyph.size + 20,
                      height: glyph.size + 20,
                      animation: `glow-breathe 3s ease-in-out ${glyph.delay}ms infinite`,
                    }}
                  >
                    <Icon size={glyph.size * 0.6} className="text-neon" />
                  </div>
                );
              })}
            </div>

            {/* Heading + paragraph */}
            <div className="relative z-10 text-center">
              <h2 className="mb-3 text-xl tracking-[1.5px] md:text-2xl">
                Secure Access
              </h2>
              <p className="mx-auto max-w-xs text-[13px] leading-relaxed text-cyber-body">
                Your data is protected with enterprise-grade encryption and
                multi-layer security protocols.
              </p>
            </div>
          </div>
        </div>
      </div>

      <DatalinesWithGrid maxLines={20} />
    </div>
  );
};

export default AuthLayout;
