"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CheckIcon } from "@/components/ui/icons";

interface SplitButtonProps {
  /** href for the main label area (e.g. mailto:…). */
  mainHref?: string;
  /** When provided, the icon area becomes a copy-to-clipboard button. */
  copyText?: string;
  children: ReactNode;
  icon: ReactNode;
  className?: string;
}

/**
 * The "Contact me" CTA pattern: a primary-dark button with a second,
 * icon-only segment divided by a 1px line. The two areas are separate
 * focusable elements so the main label and the copy icon can each have
 * independent click actions (mailto vs. clipboard copy).
 *
 * overflow-hidden is intentionally absent from the outer wrapper so that
 * the absolutely-positioned tooltips can escape the button bounds. The icon
 * button compensates with rounded-r-[10px] to clip its own gradient at the
 * right corners.
 */
export function SplitButton({ mainHref = "#", copyText, children, icon, className }: SplitButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyText || copied) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silent fail.
    }
  };

  return (
    <div
      role="group"
      className={cn(
        // No overflow-hidden here — tooltips need to escape the box.
        "relative inline-flex h-9 items-center rounded-button border border-stroke-strong",
        "bg-gradient-to-b from-gradient-from to-gradient-to-dark text-ui font-sans text-primary-fg shadow-button-primary",
        "transition-all duration-200 ease-out motion-reduce:transition-none",
        "hover:-translate-y-px hover:shadow-button-primary-hover active:translate-y-0 active:scale-[0.98]",
        className,
      )}
    >
      {/* ── Contact area ─────────────────────────────────────────── */}
      <div className="group/main relative flex h-9 items-center">
        <a
          href={mainHref}
          className={cn(
            "flex h-9 cursor-pointer items-center whitespace-nowrap rounded-l-[10px] pl-2.5 pr-1.5 outline-none",
            "transition-opacity duration-150 ease-out motion-reduce:transition-none",
            "hover:opacity-90 active:opacity-70",
            "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nav-mark/30",
          )}
        >
          {children}
        </a>

        {/* "Email me" tooltip */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2",
            "whitespace-nowrap rounded-md bg-ink px-2.5 py-1",
            "text-[11px] font-medium leading-none text-primary-fg shadow-md",
            // Fade + lift in, motion-reduce collapses to opacity only.
            "translate-y-1 opacity-0 transition-all duration-150 ease-out",
            "motion-reduce:translate-y-0 motion-reduce:transition-[opacity] motion-reduce:duration-150",
            "group-hover/main:translate-y-0 group-hover/main:opacity-100",
          )}
        >
          Email me
        </div>
      </div>

      {/* ── Copy icon area ────────────────────────────────────────── */}
      <div className="group/copy relative flex h-9 items-center">
        <button
          type="button"
          aria-label={copied ? "Email copied" : "Copy email address"}
          onClick={handleCopy}
          className={cn(
            // rounded-r-[10px] clips the gradient at the right corners since
            // the outer wrapper no longer has overflow-hidden.
            "flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-r-[10px] border-l border-split-divider",
            "bg-gradient-to-b from-gradient-from to-gradient-to-dark outline-none",
            "transition-opacity duration-150 ease-out motion-reduce:transition-none",
            "hover:opacity-90 active:opacity-70",
            "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nav-mark/30",
          )}
        >
          {copied ? <CheckIcon /> : icon}
        </button>

        {/* "Copy email" / "Copied!" tooltip */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2",
            "whitespace-nowrap rounded-md bg-ink px-2.5 py-1",
            "text-[11px] font-medium leading-none text-primary-fg shadow-md",
            "translate-y-1 opacity-0 transition-all duration-150 ease-out",
            "motion-reduce:translate-y-0 motion-reduce:transition-[opacity] motion-reduce:duration-150",
            "group-hover/copy:translate-y-0 group-hover/copy:opacity-100",
          )}
        >
          {copied ? "Copied!" : "Copy email"}
        </div>
      </div>
    </div>
  );
}
