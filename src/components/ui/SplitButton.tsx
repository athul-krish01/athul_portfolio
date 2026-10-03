import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SplitButtonProps {
  href?: string;
  children: ReactNode;
  icon: ReactNode;
  className?: string;
}

/**
 * The "Contact me" CTA pattern: a primary-dark button with a second,
 * icon-only segment divided by a 1px line. Figma treats this as a single
 * compound control (one node with two child groups), so it's built as one
 * component rather than a button placed next to a separate icon button.
 */
export function SplitButton({ href = "#", children, icon, className }: SplitButtonProps) {
  return (
    <a
      href={href}
      className={cn(
        "relative inline-flex h-9 items-center overflow-hidden rounded-button border border-stroke-strong bg-gradient-to-b from-gradient-from to-gradient-to-dark text-ui font-sans text-primary-fg shadow-button-primary",
        className,
      )}
    >
      <span className="whitespace-nowrap pl-2.5">{children}</span>
      <span className="ml-1.5 flex h-9 w-9 items-center justify-center border-l border-split-divider bg-gradient-to-b from-gradient-from to-gradient-to-dark">
        {icon}
      </span>
    </a>
  );
}
