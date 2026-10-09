/**
 * The 48px ornament band between major sections.
 *
 * A fully responsive HTML/CSS implementation that adapts to the parent
 * container width (the 980px desktop canvas or its fluid equivalent at
 * smaller screens). The band's fill is a CSS-generated diagonal stripe
 * pattern (repeating-linear-gradient), technically inspired by chanhdai.com's
 * `.stripe-divider` component — same 315deg hairline-on-transparent
 * technique, re-tuned to this design system's --color-stroke token and an
 * 8px repeat (vs. their 10px) instead of their pattern-foreground/opacity
 * mixing. Unlike their version, the gradient is NOT viewport-bled
 * (no 200vw/-100vw); it tiles within this element's own box, so it stays
 * exactly as wide as the canvas at every breakpoint.
 *
 * Responsive:
 *   - Container width: 100% (fluid with parent)
 *   - Stripe tile: fixed 8px, so density reads the same at every width
 *   - Height: fixed 48px (h-12)
 *
 * Spacing is deliberately NOT baked in — the three dividers in the design
 * sit in differently-sized gaps, so the parent section owns the margins.
 *
 * Below the `frame` breakpoint, PageFrame still carries px-4/sm:px-6 side
 * padding, so negative margins break the divider out of that padding to
 * span the full fluid canvas width. At/above `frame`, PageFrame's padding
 * drops to 0 (see PageFrame.tsx), so the divider resets to plain w-full/mx-0
 * — overshooting here would paint over the canvas's left/right border
 * strokes (PageGrid) instead of meeting them with zero gap.
 *
 * The stripe fill lives on an inner layer inset by 1px (inset-x-px) rather
 * than on this outer box directly. PageGrid's outer boundary lines sit
 * exactly on this element's left/right edge pixels; a flush fill here
 * would paint over the left line's column while — by the asymmetric
 * left-inclusive/right-exclusive box-fill rounding at that exact edge —
 * happening to land one pixel short of the right line's column, hiding only
 * the left line. Insetting the fill keeps both boundary lines visible
 * through the band symmetrically, without touching their geometry or this
 * box's own outer width/border, which still meets the canvas edges exactly.
 */
export function SectionDivider({ className }: { className?: string }) {
  return (
    <div
      className={`relative h-12 w-[calc(100%+32px)] sm:w-[calc(100%+48px)] frame:w-full mx-[-16px] sm:mx-[-24px] frame:mx-0 border-t border-b border-stroke ${className ?? ""}`}
      aria-hidden="true"
    >
      {/* Diagonal stripe fill, inset 1px from each edge so it doesn't paint
          over the canvas's outer boundary lines (PageGrid). */}
      <div className="absolute inset-y-0 inset-x-px bg-white bg-[repeating-linear-gradient(315deg,var(--color-stroke)_0_1px,transparent_1px_8px)]" />
    </div>
  );
}
