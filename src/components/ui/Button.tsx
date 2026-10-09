import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary-hero" | "primary-dark" | "light" | "ghost";

const base =
  "group inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-button px-2.5 py-2 text-ui font-sans outline-none " +
  // Fast, subtle hover/press polish, shared by every variant: a 1px lift on
  // hover, cancelled back down (plus a hint of scale) on active so a click
  // reads as a physical press rather than just an instant color change.
  // motion-reduce:transition-none keeps the end states but drops the
  // animated step for reduced-motion users.
  "transition-all duration-200 ease-out motion-reduce:transition-none " +
  "hover:-translate-y-px active:translate-y-0 active:scale-[0.98] " +
  "focus-visible:ring-2 focus-visible:ring-nav-mark/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

/**
 * Each variant preserves the custom styling observed in Figma rather than
 * falling back to a generic shadcn button:
 *   - primary-hero / primary-dark: vertical gradient fill, dark border, and
 *     an inset top highlight stacked with the drop shadow (shadow-button-
 *     primary) — the two variants only differ in their gradient end color
 *     (approved decision: keep separate, not unified). Hover swaps in
 *     shadow-button-primary-hover (a taller, stronger shadow token) to back
 *     up the lift without introducing a new color.
 *   - light: white fill with a visible border (the "Get my resume" style).
 *     Hover adds a faint stroke-tinted background and swaps the border to
 *     the existing --color-muted token — both already-defined colors, nothing
 *     new.
 *   - ghost: borderless, for the navbar's secondary links.
 */
const variantClasses: Record<ButtonVariant, string> = {
  "primary-hero":
    "border border-stroke-strong bg-gradient-to-b from-gradient-from to-gradient-to-hero text-primary-fg shadow-button-primary hover:shadow-button-primary-hover",
  "primary-dark":
    "border border-stroke-strong bg-gradient-to-b from-gradient-from to-gradient-to-dark text-primary-fg shadow-button-primary hover:shadow-button-primary-hover",
  light: "border border-stroke bg-surface text-ink hover:bg-stroke/30 active:bg-stroke/50",
  ghost: "border border-transparent text-ink hover:bg-stroke/40",
};

type CommonProps = {
  variant?: ButtonVariant;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsAnchor = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function Button({ variant = "light", icon, className, children, ...props }: ButtonProps) {
  const classes = cn(base, variantClasses[variant], className);

  // The icon nudges ~2px to the right on hover (group-hover, driven by the
  // parent's own hover state) — wrapped here rather than styled on the icon
  // itself, since `icon` arrives as an already-built element (e.g.
  // <ArrowRightIcon />) that Button doesn't own.
  const iconSlot = icon ? (
    <span className="inline-flex transition-transform duration-200 ease-out motion-reduce:transition-none group-hover:translate-x-0.5">
      {icon}
    </span>
  ) : null;

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorProps } = props as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
        {iconSlot}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
      {iconSlot}
    </button>
  );
}
