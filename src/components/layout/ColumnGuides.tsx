/**
 * The two internal vertical column guides that split the 980px column into
 * three 300px columns (Figma "Rectangle 8"/"Rectangle 9", at column-relative
 * x=339 and x=639.8 — canvas x=565 and x=865.8).
 *
 * These are #fafafa, NOT the #e5e5e5 used for the outer boundaries. Sampling
 * the 2x design export confirms they render as a near-invisible hairline
 * against white; drawing them at #e5e5e5 (as an earlier pass did) makes them
 * far too prominent.
 *
 * In the source file they stop at y=3118 — just past the social links and
 * before the footer wordmark. Rather than hard-code that pixel value against
 * a page whose height changes with content, this component is rendered
 * inside the main block (everything above the footer) and simply spans it.
 *
 * Positioned against the 1400px canvas, so it expects a canvas-width
 * relative parent. Hidden below `lg` along with the rest of the grid.
 */
export function ColumnGuides() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
      aria-hidden="true"
    >
      <div className="absolute inset-y-0 left-[565px] w-px bg-guide" />
      <div className="absolute inset-y-0 left-[865.8px] w-px bg-guide" />
    </div>
  );
}
