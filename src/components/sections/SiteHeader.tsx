"use client";

import { useState } from "react";
import { ArrowRightIcon, CloseIcon, MenuIcon } from "@/components/ui/icons";
import { StatusPill } from "@/components/sections/StatusPill";
import { Wordmark } from "@/components/ui/Wordmark";
import { navLinks, resumeHref } from "@/data/site";

/**
 * The floating navbar, pinned to the viewport.
 *
 * Desktop (`sm` and up) geometry is measured from the supplied reference
 * screenshot rather than the Figma frame (navbar styling was always flagged
 * as provisional — see the Navbar block in tokens.css for the full
 * measurement list):
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
 * than in flow. All of this is untouched below `sm` — every mobile-only
 * class here is overridden back to the above at `sm:`.
 *
 * Below `sm` the bar becomes a dark pill (no reference for this one — it's
 * new, not from the Figma audit): full-width, logo left, hamburger right.
 * Opening it reveals a dropdown panel with the same nav links + CTA that
 * are already visible inline at `sm` and up — nothing new is wired, they're
 * just relocated so they're reachable on a phone. The ambient status chip
 * is intentionally dropped from the mobile view entirely (not in the
 * collapsed pill, not in the panel) to keep both close to the reference's
 * "logo + hamburger only" collapsed state.
 */
export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* The full-width strip is click-through — only the bar (and, on
          mobile, the dropdown panel beneath it) takes pointer events, so the
          page behind the gutters stays interactive. */}
      <header className="pointer-events-none fixed inset-x-0 top-[var(--layout-nav-offset-sm)] z-50 flex justify-center px-4 sm:top-[var(--layout-nav-offset)]">
        <div className="pointer-events-auto flex w-full flex-col gap-2 sm:w-auto">
          <div
            className={[
              "flex h-[var(--layout-nav-height)] w-full max-w-full items-center",
              "justify-between gap-3 px-4 sm:w-auto sm:justify-start sm:gap-3 sm:px-5",
              "sm:gap-14",
              // Mobile: dark pill, subtle border/blur. Restored to the
              // reference's white glass treatment at `sm` and up.
              "rounded-full border border-stroke-strong/60 bg-ink-strong/95 shadow-nav backdrop-blur-sm",
              "sm:rounded-nav sm:border-black/[0.04] sm:bg-surface/95",
              // Glass. The opaque default is the fallback for engines without
              // backdrop-filter, where a 70% surface would let text bleed
              // through with nothing blurring it.
              "supports-[backdrop-filter]:bg-ink-strong/80 sm:supports-[backdrop-filter]:bg-surface/70",
              "sm:backdrop-blur-[var(--nav-glass-blur)] sm:backdrop-saturate-[var(--nav-glass-saturate)]",
            ].join(" ")}
          >
            {/* Identity: mark + live ambient chip. gap-3 is the 8px(ish)
                measured gap between the reference's wordmark and its chip.
                The chip itself only ever shows at `sm` and up — see the
                component doc above. */}
            <div className="flex shrink-0 items-center gap-3">
              <Wordmark href="#home" />
              <div className="hidden sm:block">
                <StatusPill />
              </div>
            </div>

            {/* Secondary links, `sm` and up only — collapsed below that into
                the dropdown panel via the hamburger. */}
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
                would be order-dependent. Hidden below `sm` — it reappears in
                the mobile dropdown panel instead. */}
            <a
              href={resumeHref}
              className="hidden h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-nav-cta bg-nav-mark px-4 text-[13px] font-semibold leading-none text-primary-fg outline-none transition-colors duration-200 hover:bg-nav-link focus-visible:ring-2 focus-visible:ring-nav-mark/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:flex"
            >
              Resume
              <ArrowRightIcon />
            </a>

            {/* Hamburger toggle — mobile only. Visual/state only for now: it
                opens onto the existing nav links + CTA below, nothing new. */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-panel"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-primary-fg outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-fg/40 sm:hidden"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          {/* Dropdown panel — mobile only, same nav links + CTA as the
              inline `sm:` row above, just stacked and reachable by hand. */}
          {isMenuOpen && (
            <div
              id="mobile-nav-panel"
              className="flex flex-col gap-1 rounded-card border border-stroke bg-surface/95 p-3 shadow-nav backdrop-blur-sm sm:hidden"
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-xs px-3 py-2.5 text-ui text-nav-link outline-none transition-colors duration-200 hover:bg-stroke/40 hover:text-nav-mark focus-visible:ring-2 focus-visible:ring-nav-mark/30"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={resumeHref}
                onClick={closeMenu}
                className="mt-1 flex h-9 w-full items-center justify-center gap-1.5 rounded-nav-cta bg-nav-mark px-4 text-[13px] font-semibold leading-none text-primary-fg outline-none transition-colors duration-200 hover:bg-nav-link focus-visible:ring-2 focus-visible:ring-nav-mark/30"
              >
                Resume
                <ArrowRightIcon />
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Puts back the space the bar used to occupy in flow (offset +
          height), so nothing below it shifts now that it is fixed. The
          dropdown panel is not accounted for here on purpose — it overlays
          page content rather than pushing it down, like any mobile menu. */}
      <div
        aria-hidden="true"
        className="h-[calc(var(--layout-nav-offset-sm)+var(--layout-nav-height))] sm:h-[calc(var(--layout-nav-offset)+var(--layout-nav-height))]"
      />
    </>
  );
}
