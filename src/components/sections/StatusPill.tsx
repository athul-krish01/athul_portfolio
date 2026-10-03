"use client";

import { useEffect, useState } from "react";
import type { AmbientData } from "@/lib/ambient";
import { WeatherGlyph } from "@/components/ui/WeatherGlyph";

/**
 * The navbar's ambient chip: live local clock, timezone abbreviation,
 * current conditions and temperature — matching the reference's
 * "02:37 IST <cloud> 22°".
 *
 * Everything here is resolved at runtime, nothing is hardcoded:
 *   - the clock ticks from the visitor's own device
 *   - the zone label is derived from their resolved IANA timezone
 *   - temperature and conditions come from /api/ambient, which geolocates
 *     the request (edge headers in production, an IP lookup otherwise)
 *
 * The visitor's city is fetched and announced to assistive tech / exposed
 * on hover, but not printed — the reference chip has no city text and
 * widening it would break the measured navbar proportions.
 */

/**
 * Letter abbreviation for a zone ("IST", "EST", "CEST").
 *
 * `timeZoneName: "short"` only gives letters for zones the browser's locale
 * data has them for; everywhere else it returns a numeric "GMT+5:30". In
 * that case the long name ("India Standard Time") is initialised instead,
 * which is what produces "IST" for Asia/Kolkata under an en-US locale.
 *
 * The digit test is what distinguishes the two: it rejects "GMT+5:30" and
 * "GMT+2" while keeping genuine letter forms, including the bare "UTC" and
 * "GMT" that initialising would otherwise mangle into "CUT" and "GMT".
 */
function zoneAbbreviation(date: Date, timeZone: string) {
  const short = zonePart(date, timeZone, "short");
  if (short && !/\d/.test(short)) return short;

  const long = zonePart(date, timeZone, "long");
  if (long) {
    const initials = long
      .split(/\s+/)
      .filter((word) => /^[A-Z]/.test(word))
      .map((word) => word[0])
      .join("");
    if (initials.length >= 2) return initials;
  }

  return short ?? "";
}

function zonePart(date: Date, timeZone: string, style: "short" | "long") {
  try {
    return new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: style })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value;
  } catch {
    return undefined;
  }
}

function formatClock(date: Date, timeZone: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(date);
  } catch {
    return "--:--";
  }
}

interface Clock {
  time: string;
  zone: string;
}

export function StatusPill() {
  // Null until mounted. The server has no idea what time it is where the
  // visitor is, so rendering a real clock during SSR would guarantee a
  // hydration mismatch — the placeholder below renders on both sides.
  const [clock, setClock] = useState<Clock | null>(null);
  const [ambient, setAmbient] = useState<AmbientData | null>(null);

  useEffect(() => {
    const timeZone =
      ambient?.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";

    const tick = () => {
      const now = new Date();
      setClock({ time: formatClock(now, timeZone), zone: zoneAbbreviation(now, timeZone) });
    };

    tick();
    // 10s rather than 1s: the chip only shows hours and minutes, so this is
    // the coarsest interval that still never shows a stale minute for long.
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, [ambient?.timeZone]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/ambient", { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<AmbientData>) : null))
      .then((data) => {
        if (data) setAmbient(data);
      })
      .catch(() => {
        // Offline, blocked, or the route gave up. The clock half still works.
      });

    return () => controller.abort();
  }, []);

  const hasWeather = typeof ambient?.temperatureC === "number";
  const place = [ambient?.city, ambient?.country].filter(Boolean).join(", ");

  return (
    <span
      // h-6 / rounded-pill-chip (8px) / px-3 are the measured chip box from
      // the reference. min-w keeps the bar from reflowing when the weather
      // half arrives a beat after the clock.
      className="flex h-6 min-w-[108px] items-center gap-2 rounded-pill-chip bg-nav-chip-bg px-3 text-[12px] leading-none"
      title={place ? `Local time in ${place}` : undefined}
    >
      <span className="font-semibold tabular-nums text-nav-link">{clock?.time ?? "--:--"}</span>

      {clock?.zone ? (
        <span className="text-[11px] font-medium uppercase tracking-[0.02em] text-nav-chip-label">
          {clock.zone}
        </span>
      ) : null}

      {hasWeather ? (
        <>
          <WeatherGlyph
            code={ambient?.weatherCode ?? 3}
            isDay={ambient?.isDay ?? true}
            className="shrink-0 text-nav-chip-label"
          />
          <span className="font-medium tabular-nums text-nav-link">
            {ambient?.temperatureC}&deg;
          </span>
        </>
      ) : null}

      {/* The location itself never gets printed (see the note above), so it
          is announced here instead of being lost entirely. */}
      {place ? <span className="sr-only">Current location: {place}</span> : null}
    </span>
  );
}
