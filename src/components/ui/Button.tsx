import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary-hero" | "primary-dark" | "light" | "ghost";

const base =
  "inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-button px-2.5 py-2 text-ui font-sans transition-colors";

/**
 * Each variant preserves the custom styling observed in Figma rather than
 * falling back to a generic shadcn button:
 *   - primary-hero / primary-dark: vertical gradient fill, dark border, and
 *     an inset top highlight stacked with the drop shadow (shadow-button-
 *     primary) — the two variants only differ in their gradient end color
 *     (approved decision: keep separate, not unified).
 *   - light: white fill with a visible border (the "Get my resume" style).
 *   - ghost: borderless, for the navbar's secondary links.
 */
const variantClasses: Record<ButtonVariant, string> = {
  "primary-hero":
    "border border-stroke-strong bg-gradient-to-b from-gradient-from to-gradient-to-hero text-primary-fg shadow-button-primary",
  "primary-dark":
    "border border-stroke-strong bg-gradient-to-b from-gradient-from to-gradient-to-dark text-primary-fg shadow-button-primary",
  light: "border border-stroke bg-surface text-ink",
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

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorProps } = props as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
        {icon}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
      {icon}
    </button>
  );
}
