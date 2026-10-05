import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * The logo mark in the navbar.
 *
 * Geometric SVG-based logo replacing the previous "AK" text monogram.
 */
export function Wordmark({ href, className }: { href: string; className?: string }) {
  return (
    <a
      href={href}
      aria-label="Athul Krishna — back to top"
      className={cn(
        "group flex shrink-0 items-center rounded-xs outline-none",
        "focus-visible:ring-2 focus-visible:ring-nav-mark/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        className,
      )}
    >
      <Image
        src="/icons/logo-ak.png"
        alt=""
        width={24}
        height={24}
        className="transition-colors duration-200"
        priority
      />
    </a>
  );
}
