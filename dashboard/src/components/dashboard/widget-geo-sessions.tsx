"use client";

import { useState, useMemo, useCallback } from "react";
import { Info, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Map, MapControls, MapGeoJSON, MapPopup } from "../ui/map";
import { Theme, mapConfig } from "@/app/data";
import { useWorldData } from "@/lib/use-world-data";
import { useTheme } from "next-themes";
import { useGeoAnalytics } from "@/features/dashboard-analytics/queries";
import { Loader2 } from "lucide-react";

const PERIODS = ["Last 7 days", "Last 30 days", "Last 90 days", "All time"];
// Removed dummy data

interface HoverInfo {
  name: string;
  visitors: number;
  lng: number;
  lat: number;
}

interface CountryProperties {
  NAME_LONG: string;
  visitors: number;
}

type CountryFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  CountryProperties
>;

function buildFillColor(theme: Theme): unknown[] {
  const { base, ramp, hover } = mapConfig.colors[theme];
  const [s0, s1, s2, s3, s4] = mapConfig.scaleStops;
  const ramped = [
    "interpolate",
    ["linear"],
    ["coalesce", ["get", "visitors"], 0],
    s0,
    base,
    s1,
    ramp[0],
    s2,
    ramp[1],
    s3,
    ramp[2],
    s4,
    ramp[3],
  ];
  return [
    "case",
    [
      "all",
      ["boolean", ["feature-state", "hover"], false],
      [">", ["coalesce", ["get", "visitors"], 0], 0],
    ],
    hover,
    ramped,
  ];
}

function Legend({ theme }: { theme: Theme }) {
  const gradient = `linear-gradient(to right, ${mapConfig.colors[theme].ramp.join(", ")})`;

  return (
    <div className="absolute bottom-4 left-4 z-10 rounded-cyber border border-cyber-border bg-cyber-surface/90 px-3 py-2.5 backdrop-blur-sm glow-neon">
      <p className="text-xs font-medium text-cyber-heading">
        Visitors by country
      </p>
      <div
        className="mt-2 h-2 w-40 rounded-full"
        style={{ backgroundImage: gradient }}
        suppressHydrationWarning
      />
      <div className="flex items-center justify-between pt-1.5 text-[10px] text-cyber-body-subtle">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}

export function WidgetGeoSessions({ className }: { className?: string }) {
  const [period, setPeriod] = useState("Last 7 days");
  const [periodOpen, setPeriodOpen] = useState(false);

  const { resolvedTheme } = useTheme();
  const theme: Theme = resolvedTheme === "dark" ? "dark" : "light";
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const world = useWorldData();
  const { data: geoData, isLoading: isLoadingAnalytics } = useGeoAnalytics(period);

  const countries = useMemo<CountryFeatureCollection | null>(() => {
    if (!world || !geoData?.data) return null;
    
    // Map GA4 array to a dictionary for fast lookup
    const visitorsMap: Record<string, number> = {};
    geoData.data.forEach(d => visitorsMap[d.country] = d.sessions);

    return {
      type: "FeatureCollection",
      features: world.features.map((f) => ({
        ...f,
        properties: {
          NAME_LONG: f.properties.NAME_LONG,
          visitors: visitorsMap[f.properties.NAME_LONG] ?? 0,
        },
      })),
    };
  }, [world, geoData?.data]);

  const fillPaint = useMemo(
    () => ({
      "fill-color": buildFillColor(theme) as never,
      "fill-opacity": 0.92,
    }),
    [theme],
  );

  return (
    <div
      className={cn(
        "cyber-card clip-card flex h-135 flex-col p-4 lg:p-6",
        className,
      )}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <h3 className="text-base font-heading tracking-[1px] text-cyber-heading">
          Vectyzen Heatmap
        </h3>
        <button
          className="flex h-6 w-6 items-center justify-center rounded-cyber text-cyber-body-subtle transition-colors duration-150 hover:text-cyber-heading hover:bg-cyber-surface-hover"
          title="Sessions grouped by country of origin"
        >
          <Info size={14} />
        </button>
      </div>

      <div className="relative w-full h-full">
        <Map
          blank
          center={mapConfig.view.center}
          zoom={mapConfig.view.zoom}
          minZoom={mapConfig.view.minZoom}
          maxZoom={mapConfig.view.maxZoom}
          dragRotate={false}
          pitchWithRotate={false}
          attributionControl={false}
          loading={!countries || isLoadingAnalytics}
        >
          {countries && (
            <MapGeoJSON<CountryProperties>
              data={countries}
              promoteId="NAME_LONG"
              fillPaint={fillPaint}
              interactive
              onHover={(e) => {
                const visitors = e?.feature.properties.visitors ?? 0;
                // Only countries with data are interactive.
                if (!e || visitors <= 0) {
                  setHover(null);
                  return;
                }
                setHover({
                  name: e.feature.properties.NAME_LONG,
                  visitors,
                  lng: e.longitude,
                  lat: e.latitude,
                });
              }}
            />
          )}
          <MapControls className="bottom-2" />
          {hover && (
            <MapPopup
              longitude={hover.lng}
              latitude={hover.lat}
              offset={12}
              closeOnClick={false}
              className="pointer-events-none p-2"
            >
              <p className="text-xs font-medium text-cyber-heading">
                {hover.name}
              </p>
              <div className="flex items-center justify-between gap-4 pt-1">
                <span className="flex items-center gap-1.5 text-[11px] text-cyber-body">
                  <span className="size-2 rounded-full bg-neon" />
                  Visitors
                </span>
                <span className="text-xs font-semibold tabular-nums text-neon">
                  {hover.visitors.toLocaleString()}
                </span>
              </div>
            </MapPopup>
          )}
        </Map>

        <Legend theme={theme} />
      </div>

      {/* ── Footer ── */}
      <div className="h-px bg-cyber-border" />
      <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <button
            onClick={() => setPeriodOpen(!periodOpen)}
            className="flex items-center gap-1 rounded-cyber border border-cyber-border px-3 py-2 text-[12px] font-medium text-cyber-body transition-colors duration-150 hover:bg-cyber-surface-hover hover:text-cyber-heading"
          >
            {period}
            <ChevronDown
              size={12}
              className={cn(
                "transition-transform duration-150",
                periodOpen ? "rotate-180" : "rotate-0",
              )}
            />
          </button>
          {periodOpen && (
            <div className="absolute bottom-full left-0 z-20 mb-1 min-w-35 border bg-cyber-surface border-cyber-border rounded-cyber overflow-hidden">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriod(p);
                    setPeriodOpen(false);
                  }}
                  className={cn(
                    "block w-full px-3 py-2 text-left text-[12px] transition-colors duration-150",
                    p === period
                      ? "bg-cyber-surface-active text-neon"
                      : "text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="flex items-center gap-1 text-[12px] font-medium text-neon transition-colors duration-150 hover:text-neon-strong">
          Users report
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}
