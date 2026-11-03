import type { ReactNode } from "react";
import { ArrowRight, Chip, Rich, type Tone } from "@/components/case-study/primitives";
import { cn } from "@/lib/cn";

/**
 * Diagrams for the Hirebit case study. Each one draws only figures and facts
 * stated in the source; nothing here adds data.
 */

/** FigJam-style dotted canvas. */
export const canvasDots = "bg-[#fafafa] bg-[radial-gradient(circle,var(--color-stroke)_1px,transparent_1.2px)] bg-[length:18px_18px]";

/** Cards in sequence with arrows between them (e.g. reads → suggests → you decide). */
export function Steps({ items }: { items: { chip: string; tone: Tone; title: string; text: string }[] }) {
  return (
    <ol className="grid gap-3 md:-mx-2 md:grid-cols-3 md:gap-0">
      {items.map((item, i) => (
        <li key={item.title} className="relative flex md:items-stretch">
          <div className="flex w-full flex-col gap-3 rounded-card border border-stroke bg-surface p-5 md:mx-2">
            <Chip tone={item.tone}>{item.chip}</Chip>
            <p className="text-[18px] font-medium leading-6 tracking-[-0.02em] text-ink">{item.title}</p>
            <p className="text-[16px] leading-[1.6] text-muted">
              <Rich text={item.text} />
            </p>
          </div>
          {i < items.length - 1 ? (
            <ArrowRight className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-surface text-accent md:block" />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

const stageTone: Record<Tone, { bg: string; grid: string }> = {
  neutral: { bg: "bg-[#fafafa]", grid: "[--grid:var(--color-stroke)]" },
  accent: { bg: "bg-[linear-gradient(160deg,#f5f8ff,var(--color-accent-soft))]", grid: "[--grid:var(--color-accent-line)]" },
  warm: { bg: "bg-[linear-gradient(160deg,#fffaf5,var(--color-warm-soft))]", grid: "[--grid:var(--color-warm-line)]" },
  success: { bg: "bg-[linear-gradient(160deg,#f6fdf9,var(--color-success-soft))]", grid: "[--grid:var(--color-success-line)]" },
};

/**
 * A tinted design-canvas area that holds a small visual: soft gradient, a
 * grid that fades out towards the edges, content centred on top.
 */
export function Stage({ tone = "neutral", className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  const t = stageTone[tone];
  return (
    <div className={cn("relative isolate flex items-center justify-center overflow-hidden rounded-[14px] border border-stroke/70", t.bg, t.grid, className)}>
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(var(--grid)_1px,transparent_1px),linear-gradient(90deg,var(--grid)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_80%)]"
      />
      {children}
    </div>
  );
}
