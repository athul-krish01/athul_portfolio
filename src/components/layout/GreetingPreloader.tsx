"use client";

import { useEffect, useState } from "react";

/**
 * Full-page loading overlay shown once per hard load/refresh — mounted in
 * RootLayout (outside <main>), so in-page anchor links never remount it.
 *
 * Shows a loading.dev-style circular arc spinner while the page initialises,
 * then slides the overlay off screen. All timing, phase logic, overflow lock
 * and failsafe are preserved from the original implementation.
 *
 * Pure CSS transitions/keyframes — no animation library.
 */

const HOLD_MS = 2200;  // total spinner hold time (≈ original CYCLE_MS: 4 × 550ms)
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
      {/* loading.dev "Loading" spinner — partial arc that rotates.
          Two stacked circles: a muted track ring + the brand-ink arc on top.
          r=15 → circumference ≈ 94.2; strokeDasharray="71 24" ≈ ¾ arc visible. */}
      <svg
        className="ld-spinner"
        width="36"
        height="36"
        viewBox="0 0 40 40"
        fill="none"
        aria-label="Loading"
      >
        {/* Track */}
        <circle cx="20" cy="20" r="15" stroke="var(--color-stroke)" strokeWidth="3" />
        {/* Arc — brand ink, ¾ visible, rounded caps */}
        <circle
          cx="20"
          cy="20"
          r="15"
          stroke="var(--color-ink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="71 24"
          strokeDashoffset="24"
          style={{ transformOrigin: "20px 20px" }}
        />
      </svg>
    </div>
  );
}
