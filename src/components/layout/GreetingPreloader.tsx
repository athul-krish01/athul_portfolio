"use client";

import { useEffect, useState } from "react";

/**
 * Full-page greeting overlay shown once per hard load/refresh — mounted in
 * RootLayout (outside <main>), so in-page anchor links never remount it.
 *
 * Pure CSS transitions/keyframes rather than framer-motion or GSAP (the
 * reference's stack): the project has no animation library installed and
 * this sequence is simple enough not to warrant one.
 *
 * Driven by a chain of setTimeout calls (not setInterval) so the exact step
 * count and the final "reveal" step are explicit rather than inferred from
 * interval math. A failsafe timeout guarantees `phase` reaches "done" even
 * if a step above never fires, so the overlay can never get stuck over the
 * page. Initial state ("cycling", index 0) is identical on server and
 * client, so the overlay is present in the very first paint — no flash of
 * the underlying page before it appears.
 */

const GREETINGS: { text: string; fontFamily?: string }[] = [
  { text: "Hello" },
  { text: "നമസ്കാരം", fontFamily: "var(--font-malayalam)" },
  { text: "नमस्कार", fontFamily: "var(--font-devanagari)" },
  { text: "Hola" },
];

const STEP_MS = 550; // time each greeting holds on screen
const REVEAL_MS = 650; // overlay slide-up duration
const REDUCED_MOTION_HOLD_MS = 200; // brief, near-immediate hold for reduced-motion users
const CYCLE_MS = GREETINGS.length * STEP_MS;
const FAILSAFE_MS = CYCLE_MS + REVEAL_MS + 2000;

type Phase = "cycling" | "revealing" | "done";

export function GreetingPreloader() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("cycling");

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
      GREETINGS.forEach((_, i) => {
        if (i === 0) return;
        after(i * STEP_MS, () => setIndex(i));
      });
      after(CYCLE_MS, () => setPhase("revealing"));
      after(CYCLE_MS + REVEAL_MS, () => setPhase("done"));
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

  const greeting = GREETINGS[index];

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-surface transition-transform duration-[650ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${
        phase === "revealing" ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <span
        key={index}
        style={greeting.fontFamily ? { fontFamily: greeting.fontFamily } : undefined}
        className="greeting-text text-section-heading text-ink"
      >
        {greeting.text}
      </span>
    </div>
  );
}
