import type { ReactNode } from "react";

/**
 * The pill badge used in work-card tag rows ("B2B SaaS", "2025", etc.).
 * This is the one component in the file with no custom gradient/shadow —
 * a plain bordered pill is already an accurate match, not a shadcn fallback.
 */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-badge border border-stroke bg-surface px-3 py-1.5 text-badge font-sans text-badge-text">
      {children}
    </span>
  );
}
