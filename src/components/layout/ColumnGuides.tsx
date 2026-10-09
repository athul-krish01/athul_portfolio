/**
 * The two internal vertical column guides that split the 980px column into
 * three 300px columns (Figma "Rectangle 8"/"Rectangle 9", at column-relative
 * x=339 and x=639.8). Positioned relative to canvas centre so they track the
 * centred column's actual edges (calc(50% - 490px)) rather than the source
 * file's fixed canvas coordinates: calc(50% - 490px + 339px) and
 * calc(50% - 490px + 639.8px), i.e. calc(50% - 151px) and calc(50% + 149.8px).
 *
 * These are #fafafa, NOT the #e5e5e5 used for the outer boundaries. Sampling
 * the 2x design export confirms they render as a near-invisible hairline
 * against white; drawing them at #e5e5e5 (as an earlier pass did) makes them
 * far too prominent.
 *
 * Positioned at the page level as a direct child of PageCanvas, extending
 * from the top of the page all the way through the footer. Uses absolute
 * inset-0 to stretch to match PageCanvas's full content height.
 *
 * Positioned against the 1400px canvas, so it expects a canvas-width
 * relative parent. Hidden below the `frame` breakpoint (980px) along with
 * the rest of the grid.
 */
export function ColumnGuides() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden frame:block"
      aria-hidden="true"
    >
      <div className="absolute inset-y-0 left-[calc(50%-151px)] w-px bg-guide" />
      <div className="absolute inset-y-0 left-[calc(50%+149.8px)] w-px bg-guide" />
    </div>
  );
}
