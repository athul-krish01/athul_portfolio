import Image from "next/image";

/**
 * The 48px ornament band between major sections — now the actual exported
 * Figma asset (node 1:419) rather than the hairline-plus-diamonds
 * approximation used in the foundation pass.
 *
 * The asset contains, at 980x48:
 *   - a white fill with a 1px #e5e5e5 rule along its top and bottom edge
 *     (so it reads as a band, not a single line),
 *   - two segmented rules at y=23.5 spanning x=87..454 and x=525..892,
 *   - three plus-shaped crosshairs centred at x=51.5, 489.5 and 928.5,
 *     each with a 7px gap around its centre.
 *
 * Spacing is deliberately NOT baked in — the three dividers in the design
 * sit in differently-sized gaps, so the parent section owns the margins.
 *
 * The SVG carries preserveAspectRatio="none", so below `lg` it stretches
 * horizontally while holding its 48px height, keeping the band aligned with
 * the vertical rhythm instead of shrinking proportionally.
 */
export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Image
        src="/icons/grid/section-divider.svg"
        alt=""
        width={980}
        height={48}
        className="h-12 w-full"
      />
    </div>
  );
}
