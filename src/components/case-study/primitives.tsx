import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import type { Rich as RichText } from "@/data/case-studies/hirebit";
import { cn } from "@/lib/cn";

/** Typographic quotes and apostrophes. Changes punctuation only, never words. */
function typeset(text: string) {
  return text
    .replace(/(\w)'(\w)/g, "$1’$2")
    .replace(/"([^"]*)"/g, "“$1”");
}

/**
 * Renders the source's own emphasis: **bold** and *italic*. Nothing else is
 * parsed, so the case study text stays exactly as written.
 */
export function Rich({ text }: { text: RichText }) {
  const parts = typeset(text).split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

/** Long-form paragraph style: the site's body size with a roomier line height. */
export const prose = "max-w-[66ch] text-body leading-[1.65] text-muted";

/** A bulleted list of rich lines, in the long-form style. */
export function Bullets({ items, className }: { items: RichText[]; className?: string }) {
  return (
    <ul className={cn("flex list-disc flex-col gap-2.5 pl-5 marker:text-accent", prose, className)}>
      {items.map((item) => (
        <li key={item} className="pl-1">
          <Rich text={item} />
        </li>
      ))}
    </ul>
  );
}

export type Tone = "neutral" | "accent" | "warm" | "success";

const toneClasses: Record<Tone, string> = {
  neutral: "border-stroke bg-surface text-ink",
  accent: "border-accent-line bg-accent-soft text-accent",
  warm: "border-warm-line bg-warm-soft text-warm",
  success: "border-success-line bg-success-soft text-success",
};

/** Small label pill, the site's badge shape in a tone. */
export function Chip({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center whitespace-nowrap rounded-badge border px-2.5 py-1 text-[13px] font-medium leading-4",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Values the source leaves blank ("[fill in]"). */
export function Pending({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-badge border border-dashed border-stroke-strong/30 px-2.5 py-0.5 text-[13px] text-muted">
      {children}
    </span>
  );
}

export function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path d="M13 8H3.5M7.5 4l-4 4 4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Back to the homepage's Selected work section. */
export function BackLink({ className }: { className?: string }) {
  return (
    <Link
      href="/#selected-work"
      className={cn(
        "group inline-flex w-fit items-center gap-1.5 rounded-xs text-ui text-nav-link outline-none transition-colors duration-200 hover:text-accent",
        "focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-4 focus-visible:ring-offset-surface",
        className,
      )}
    >
      <ArrowLeft className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5 motion-reduce:transition-none" />
      Back to selected work
    </Link>
  );
}
