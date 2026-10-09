import Image from "next/image";

/**
 * Both icons are the real exported Figma assets (Phosphor "arrow-right" and
 * the split-button "copy" glyph), downloaded to public/icons/ui — not
 * hand-drawn approximations. Their fills are already baked as white in the
 * source export, which matches every place they're currently used (on dark
 * gradient buttons), so no currentColor trick is needed.
 */

export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/ui/arrow-right.svg"
      alt=""
      width={16}
      height={16}
      className={className}
    />
  );
}

export function CopyIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/ui/copy.svg"
      alt=""
      width={16}
      height={16}
      className={className}
    />
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 8.5L6.5 12L13 5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Mobile navbar menu toggle. No Figma asset exists for either state — the
 * mobile hamburger pill isn't part of the audited desktop design — so these
 * are hand-drawn to match the other icons' weight (currentColor strokes,
 * round caps) instead of pulled from an export.
 */
export function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M2.5 5.5h13M2.5 9h13M2.5 12.5h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Social-links grid external-link cue. No Figma asset exists for this glyph
 * either, so it's hand-drawn to match MenuIcon/CloseIcon's weight
 * (currentColor stroke, round caps) rather than pulled from an export.
 */
export function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 10L10 4M10 4H5M10 4V9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
