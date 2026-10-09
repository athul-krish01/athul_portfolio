import type { ReactNode } from "react";

/**
 * The 1400px design canvas. Decorative grid furniture (PageGrid,
 * ColumnGuides) anchors to this element, positioned relative to its centre
 * so they track the centred 980px column's actual edges.
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
 * The 980px content column, horizontally centred in the viewport.
 *
 * No horizontal padding of its own: the full-bleed elements inside it (the
 * section divider band, the About panel) need the full 980px, so the 40px
 * content inset is applied per-section instead. Below the `frame` breakpoint
 * (980px — the column's own width) the fixed width is dropped for fluid side
 * padding instead.
 */
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 w-full px-4 sm:px-6 frame:mx-auto frame:w-[980px] frame:px-0">
      {children}
    </div>
  );
}
