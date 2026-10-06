import { Crosshair } from "@/components/layout/Crosshair";

/**
 * The page's decorative grid furniture, measured from the 2x design export
 * (canvas coordinates, 1400px wide), repositioned to track the centred
 * 980px column (see PageFrame) instead of the source file's fixed, asymmetric
 * pixel coordinates:
 *
 *   - Outer vertical page boundaries: 1px #e5e5e5 at the column's edges
 *     (calc(50% ± 490px) — half the 980px column width from canvas centre),
 *     running the full page height.
 *   - Top horizontal rule at y≈79.5 and bottom rule at y≈3469. Both are the
 *     exported Figma asset (Frame 84) rather than a reconstruction — the
 *     asset is 1400x22.2181 with its rule at y=11.0566, hence the -11.06px
 *     offset used to land the rule on y≈79.5.
 *   - Each rule carries a Crosshair marker centred on both column edges
 *     (same x as the outer boundary lines above), matching the original
 *     page-rule.svg asset — reconstructed as CSS (see Crosshair.tsx) rather
 *     than the SVG image, so the mark holds a fixed size instead of being
 *     stretched/squashed by the asset's preserveAspectRatio="none". This is
 *     a distinct 2-marks-per-rule pattern from SectionDivider's own
 *     (removed) 3-crosshair band layout — not reintroduced here.
 *
 * The internal column guides are NOT here — they stop short of the footer,
 * so they live in ColumnGuides.tsx which is scoped to the main block.
 *
 * Entirely decorative, and hidden below the `frame` breakpoint (980px) where
 * the column goes fluid and these edge-tracking offsets no longer apply.
 */
export function PageGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-visible frame:block"
      aria-hidden="true"
    >
      {/* Outer vertical page boundaries — column edges, calc(50% ± 490px) */}
      <div className="absolute inset-y-0 left-[calc(50%-490px)] w-px bg-stroke" />
      <div className="absolute inset-y-0 left-[calc(50%+490px)] w-px bg-stroke" />

      {/* Top rule — full viewport width, CSS-based */}
      <div className="absolute left-0 top-[calc(68.5px+11.0566px)] h-px ml-[calc(-50vw+50%)] w-[calc(100vw)] bg-stroke" aria-hidden="true" />

      {/* Bottom rule — full viewport width, CSS-based */}
      <div className="absolute left-0 bottom-[calc(22.2181px-11.0566px)] h-px ml-[calc(-50vw+50%)] w-[calc(100vw)] bg-stroke" aria-hidden="true" />

      {/* Crosshairs — same y as each rule above, same x as the column-edge
          boundary lines above; -translate-x-1/2 centres the mark's x on the
          target point in both cases, -translate-y-1/2 (top rule) vs
          translate-y-1/2 (bottom rule, since `bottom` anchors the opposite
          edge) centres it on the target y. */}
      <Crosshair className="absolute left-[calc(50%-490px)] top-[calc(68.5px+11.0566px)] -translate-x-1/2 -translate-y-1/2" />
      <Crosshair className="absolute left-[calc(50%+490px)] top-[calc(68.5px+11.0566px)] -translate-x-1/2 -translate-y-1/2" />
      <Crosshair className="absolute left-[calc(50%-490px)] bottom-[calc(22.2181px-11.0566px)] -translate-x-1/2 translate-y-1/2" />
      <Crosshair className="absolute left-[calc(50%+490px)] bottom-[calc(22.2181px-11.0566px)] -translate-x-1/2 translate-y-1/2" />
    </div>
  );
}
