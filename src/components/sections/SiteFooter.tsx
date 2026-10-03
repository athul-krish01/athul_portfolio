import { site } from "@/data/site";

/**
 * Temporary footer wordmark — this entire component is slated to be
 * replaced by a React Bits component (confirmed decision). It exists only
 * so the page composition is complete; don't invest further polish here.
 *
 * Uses Inter rather than Geist (font-wordmark), matching the one place in
 * the source file where the typeface actually changes.
 */
export function SiteFooter() {
  return (
    <footer className="flex justify-center overflow-hidden py-16">
      {/* `text-clip` not `truncate`: the source clips the wordmark hard at
          the column edge rather than showing an ellipsis. (The source text
          node itself reads "Athul Krish" — kept as the full name here since
          this whole footer is slated for the React Bits replacement.) */}
      <p className="overflow-hidden text-clip whitespace-nowrap text-wordmark font-wordmark leading-none text-ink">
        {site.name}
      </p>
    </footer>
  );
}
