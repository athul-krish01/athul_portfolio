import Image from "next/image";

/**
 * The page's decorative grid furniture, measured from the 2x design export
 * (canvas coordinates, 1400px wide):
 *
 *   - Outer vertical page boundaries: 1px #e5e5e5 at x=225 and x=1206
 *     (the 980px column's edges), running the full page height.
 *   - Top horizontal rule at y≈79.5 and bottom rule at y≈3469, each with a
 *     diamond crosshair marker centred on both column edges. Both are the
 *     exported Figma asset (Frame 84) rather than a reconstruction — the
 *     asset is 1400x22.2181 with its rule at y=11.0566, hence the -11.06px
 *     offset used to land the rule on y≈79.5.
 *   - A faint alignment block in the left margin (Figma "Rectangle 22").
 *
 * The internal column guides are NOT here — they stop short of the footer,
 * so they live in ColumnGuides.tsx which is scoped to the main block.
 *
 * Entirely decorative, and hidden below `lg` where the column goes fluid
 * and these fixed canvas offsets no longer line up with anything.
 */
export function PageGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden lg:block"
      aria-hidden="true"
    >
      {/* Outer vertical page boundaries */}
      <div className="absolute inset-y-0 left-[225px] w-px bg-stroke" />
      <div className="absolute inset-y-0 left-[1206px] w-px bg-stroke" />

      {/* Top rule + crosshair markers */}
      <Image
        src="/icons/grid/page-rule.svg"
        alt=""
        width={1400}
        height={22}
        // Exact intrinsic height: the asset is 22.2181px tall and carries
        // preserveAspectRatio="none", so rounding it to 22 squashes the 1px
        // rule across two rows and washes it out.
        className="absolute left-0 top-[68.5px] h-[22.2181px] w-[1400px]"
      />

      {/* Bottom rule + crosshair markers */}
      <Image
        src="/icons/grid/page-rule.svg"
        alt=""
        width={1400}
        height={22}
        className="absolute bottom-0 left-0 h-[22.2181px] w-[1400px]"
      />

    </div>
  );
}
