import { ArrowRightIcon } from "@/components/ui/icons";
import { StatusPill } from "@/components/sections/StatusPill";
import { Wordmark } from "@/components/ui/Wordmark";
import { navLinks, resumeHref } from "@/data/site";

/**
 * The floating navbar, pinned to the viewport.
 *
 * Geometry is measured from the supplied reference screenshot rather than
 * from the Figma frame (navbar styling was always flagged as provisional —
 * see the Navbar block in tokens.css for the full measurement list):
 *
 *   bar          h 56, radius 20, 20px side padding
 *   groups       56px apart — identity | links | CTA
 *   nav links    14px/500, 32px apart
 *   CTA          h 32, radius 12, 13px/600, flat #111 (not the gradient
 *                used by the hero and contact CTAs)
 *
 * Two departures from the reference, both requested: the surface is
 * translucent + blurred instead of flat white, so page content stays
 * faintly readable as it passes underneath; and the bar is fixed rather
 * than in flow.
 */
export function SiteHeader() {
  return (
    <>
      {/* The full-width strip is click-through — only the bar itself takes
          pointer events, so the page behind the gutters stays interactive. */}
      <header className="pointer-events-none fixed inset-x-0 top-[var(--layout-nav-offset-sm)] z-50 flex justify-center px-4 sm:top-[var(--layout-nav-offset)]">
        <div
          className={[
            "pointer-events-auto flex h-[var(--layout-nav-height)] max-w-full items-center",
            "gap-3 rounded-nav px-4 sm:gap-14 sm:px-5",
            // Glass. The opaque default is the fallback for engines without
            // backdrop-filter, where a 70% surface would let text bleed
            // through with nothing blurring it.
            "border border-black/[0.04] bg-surface/95 shadow-nav",
            "supports-[backdrop-filter]:bg-surface/70",
            "backdrop-blur-[var(--nav-glass-blur)] backdrop-saturate-[var(--nav-glass-saturate)]",
          ].join(" ")}
        >
          {/* Identity: mark + live ambient chip. gap-2 is the 8px measured
              between the reference's wordmark and its chip. */}
          <div className="flex shrink-0 items-center gap-2">
            <Wordmark href="#home" />
            <StatusPill />
          </div>

          {/* Compact mobile treatment, unchanged from before: the secondary
              links collapse away below `sm`, leaving the identity chip and
              the primary CTA reachable. No hamburger/drawer yet. */}
          <nav aria-label="Primary" className="hidden items-center gap-8 sm:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-xs text-ui text-nav-link outline-none transition-colors duration-200 hover:text-nav-mark focus-visible:ring-2 focus-visible:ring-nav-mark/30 focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Written out rather than routed through <Button>: the reference
              CTA is a flat fill at a different height, radius and type size
              than every Button variant, and `cn` does not resolve conflicting
              Tailwind utilities, so overriding the shared `base` string here
              would be order-dependent. */}
          <a
            href={resumeHref}
            className="flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-nav-cta bg-nav-mark px-4 text-[13px] font-semibold leading-none text-primary-fg outline-none transition-colors duration-200 hover:bg-nav-link focus-visible:ring-2 focus-visible:ring-nav-mark/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Resume
            <ArrowRightIcon />
          </a>
        </div>
      </header>

      {/* Puts back the space the bar used to occupy in flow (offset +
          height), so nothing below it shifts now that it is fixed. */}
      <div
        aria-hidden="true"
        className="h-[calc(var(--layout-nav-offset-sm)+var(--layout-nav-height))] sm:h-[calc(var(--layout-nav-offset)+var(--layout-nav-height))]"
      />
    </>
  );
}
