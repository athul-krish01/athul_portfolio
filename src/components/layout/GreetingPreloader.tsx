"use client";

import { useEffect, useState } from "react";
import { Loading } from "loading-dev";

/**
 * Full-page loading overlay shown once per hard load/refresh — mounted in
 * RootLayout (outside <main>), so in-page anchor links never remount it.
 *
 * Uses the loading.dev <Loading> spinner (large size) as the visual indicator.
 * All timing, phase logic, overflow lock and failsafe are unchanged.
 */

const HOLD_MS = 1350;  // spinner hold — total visible time ≈ 2 s (1350 + 650 reveal)
const REVEAL_MS = 650; // overlay slide-up duration
const REDUCED_MOTION_HOLD_MS = 200;
const FAILSAFE_MS = HOLD_MS + REVEAL_MS + 2000;

type Phase = "loading" | "revealing" | "done";

export function GreetingPreloader() {
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const after = (ms: number, fn: () => void) => {
      timeouts.push(setTimeout(fn, ms));
    };

    if (prefersReducedMotion) {
      after(REDUCED_MOTION_HOLD_MS, () => setPhase("revealing"));
      after(REDUCED_MOTION_HOLD_MS + 200, () => setPhase("done"));
    } else {
      after(HOLD_MS, () => setPhase("revealing"));
      after(HOLD_MS + REVEAL_MS, () => setPhase("done"));
    }

    // Guarantees the overlay is dismissed even if a step above never fires.
    const failsafe = setTimeout(() => setPhase("done"), FAILSAFE_MS);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(failsafe);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = phase === "done" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-surface transition-transform duration-[650ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${
        phase === "revealing" ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* loading.dev <Loading> spinner — large size, brand ink color */}
      <Loading size={48} color="var(--color-ink)" />
    </div>
  );
}
