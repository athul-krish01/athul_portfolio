/**
 * The small 4-direction "+" crosshair marker that sits on the decorative
 * canvas rules (PageGrid's top/bottom horizontal lines), reconstructed as
 * plain CSS/HTML from the original page-rule.svg asset instead of the SVG
 * image itself: four 8px ticks with a gap around the centre, plus the small
 * rotated-square "diamond" that sits in that gap.
 *
 * A fixed 22x22px box at a fixed tick/diamond size — unlike the old SVG
 * (preserveAspectRatio="none"), nothing here scales with its container, so
 * the mark reads the same size at every viewport width. No position
 * utility is baked in here (any position value still gives the box's
 * absolutely-positioned children something to position against) — the
 * caller's className supplies `absolute`/`left`/`top`/`bottom` plus a
 * `-translate-x-1/2`/`translate-y-1/2` pair, so the box's centre — not its
 * corner — lands exactly on the target point.
 */
export function Crosshair({ className }: { className?: string }) {
  return (
    <div className={`size-[22px] ${className ?? ""}`} aria-hidden="true">
      {/* Vertical ticks, 8px long, 1px wide, flush to the box's top/bottom
          edges — leaving the ~3px gap around centre that the original asset
          has. */}
      <div className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-crosshair" />
      <div className="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 bg-crosshair" />

      {/* Horizontal ticks, same geometry, flush left/right. */}
      <div className="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-crosshair" />
      <div className="absolute right-0 top-1/2 h-px w-2 -translate-y-1/2 bg-crosshair" />

      {/* Centre diamond: a small square rotated 45°, sized to match the
          original asset's point-to-point span. */}
      <div className="absolute left-1/2 top-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-crosshair" />
    </div>
  );
}
