import type { ReactNode } from "react";

/**
 * The 1400px design canvas. Decorative grid furniture (PageGrid,
 * ColumnGuides) anchors to this element, since every measured offset in the
 * design is expressed in canvas coordinates.
 */
export function PageCanvas({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto w-full max-w-canvas ${className ?? ""}`}>
      {children}
    </div>
  );
}

/**
 * The 980px content column, offset 226px from the canvas's left edge.
 *
 * That offset is asymmetric in the source (226px left vs 194px right) and is
 * preserved rather than centred, per the standing "don't auto-centre the
 * desktop layout" decision.
 *
 * No horizontal padding of its own: the full-bleed elements inside it (the
 * section divider band, the About panel) need the full 980px, so the 40px
 * content inset is applied per-section instead. Below `lg` the fixed offset
 * is dropped for fluid side padding.
 */
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 w-full px-4 sm:px-6 lg:ml-[226px] lg:w-[980px] lg:px-0">
      {children}
    </div>
  );
}
