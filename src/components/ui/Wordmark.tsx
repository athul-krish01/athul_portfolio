import { cn } from "@/lib/cn";

/**
 * The "AK" monogram in the navbar.
 *
 * The reference sets its mark as plain near-black text with no chip or
 * container, so the previous dark rounded avatar tile is gone. What makes
 * these two letters read as a mark rather than as the word "AK" is the
 * kerning: -0.055em pulls the K's stem right up against the A's diagonal,
 * which is the one liberty taken here. The accent dot is the only other
 * ornament — muted at rest, solid on hover, so the mark has the same
 * hover affordance as every other link in the bar.
 */
export function Wordmark({ href, className }: { href: string; className?: string }) {
  return (
    <a
      href={href}
      aria-label="Athul Krishna — back to top"
      className={cn(
        "group flex shrink-0 items-baseline gap-[3px] rounded-xs outline-none",
        "focus-visible:ring-2 focus-visible:ring-nav-mark/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="text-[16px] font-bold leading-none tracking-[-0.055em] text-nav-mark"
      >
        AK
      </span>
      <span
        aria-hidden="true"
        className="size-[3px] rounded-full bg-nav-mark/30 transition-colors duration-200 group-hover:bg-nav-mark"
      />
    </a>
  );
}
