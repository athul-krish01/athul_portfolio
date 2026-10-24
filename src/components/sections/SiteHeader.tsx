"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRightIcon, CloseIcon, MenuIcon } from "@/components/ui/icons";
import { StatusPill } from "@/components/sections/StatusPill";
import { Wordmark } from "@/components/ui/Wordmark";
import { navLinks, resumeHref } from "@/data/site";

/** A section counts as current once its top has crossed this share of the viewport. */
const ACTIVE_LINE = 0.35;
/** How far the sliding pill extends past each link's text, horizontally and vertically. */
const PILL_PAD_X = 10;
const PILL_PAD_Y = 6;

/**
 * Which in-page section is currently in view: "home" above Selected work,
 * "selected-work" while it spans the active line, null once scrolled past it.
 */
function useActiveSection(): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const work = document.getElementById("selected-work")?.getBoundingClientRect();
      const line = window.innerHeight * ACTIVE_LINE;

      if (!work || work.top > line) setActive("home");
      else setActive(work.bottom > line ? "selected-work" : null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return active;
}

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
 * than in flow.
 *
 * Below `sm` the bar keeps this exact same surface (white glass, same
 * border/blur/radius) and widens to fill the row — only the *content*
 * changes: nav links and the Resume CTA collapse behind a hamburger, which
 * opens a dropdown panel with the same links + CTA shown inline above `sm`.
 * Nothing new is wired, they're just relocated so they're reachable on a
 * phone. The ambient status chip stays visible at every width.
 */
export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const activeSection = useActiveSection();
  const isActive = (href: string) => activeSection !== null && href === `#${activeSection}`;

  // Positions the desktop pill behind the active link. Written straight to
  // the element rather than through state, so the CSS transition animates it.
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const place = () => {
      const pill = pillRef.current;
      const link = activeSection && navRef.current?.querySelector<HTMLElement>(`a[href="#${activeSection}"]`);
      if (!pill) return;
      pill.style.opacity = link ? "1" : "0";
      if (link) {
        pill.style.left = `${link.offsetLeft - PILL_PAD_X}px`;
        pill.style.width = `${link.offsetWidth + PILL_PAD_X * 2}px`;
      }
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [activeSection]);

  return (
    <>
      {/* The full-width strip is click-through — only the bar (and, on
          mobile, the dropdown panel beneath it) takes pointer events, so the
          page behind the gutters stays interactive. */}
      <header className="pointer-events-none fixed inset-x-0 top-[var(--layout-nav-offset-sm)] z-50 flex justify-center px-4 sm:top-[var(--layout-nav-offset)]">
        <div className="pointer-events-auto flex w-full flex-col gap-2 sm:w-auto">
          <div
            className={[
              "flex h-[var(--layout-nav-height)] w-full max-w-full items-center rounded-nav",
              "justify-between gap-3 px-4 sm:w-auto sm:justify-start sm:gap-3 sm:px-5",
              "sm:gap-14",
              // Same surface at every width — only the layout above changes.
              "border border-black/[0.04] bg-surface/95 shadow-nav",
              // Glass. The opaque default is the fallback for engines without
              // backdrop-filter, where a 70% surface would let text bleed
              // through with nothing blurring it.
              "supports-[backdrop-filter]:bg-surface/70",
              "backdrop-blur-[var(--nav-glass-blur)] backdrop-saturate-[var(--nav-glass-saturate)]",
            ].join(" ")}
          >
            {/* Identity: mark + live ambient chip. gap-3 is the 8px(ish)
                measured gap between the reference's wordmark and its chip.
                Visible at every width, including mobile.
                min-w-0 (replacing shrink-0) lets this group actually
                compress on the narrowest phones instead of forcing the bar
                to overflow — Wordmark keeps its own shrink-0 so the logo
                never distorts, so StatusPill is the only part that gives. */}
            <div className="flex min-w-0 items-center gap-3">
              <Wordmark href="#home" />
              <StatusPill />
            </div>

            {/* Secondary links, `sm` and up only — collapsed below that into
                the dropdown panel via the hamburger. */}
            <nav ref={navRef} aria-label="Primary" className="relative hidden items-center gap-8 sm:flex">
              {/* Active-section pill. Sits behind the links (-z-10 inside the bar's
                  stacking context) and slides between them. Reduced motion gets
                  an instant jump. */}
              <span
                ref={pillRef}
                aria-hidden="true"
                className="pointer-events-none absolute -z-10 rounded-xs bg-stroke/40 opacity-0 transition-[left,width,opacity] duration-300 ease-out motion-reduce:transition-none"
                style={{ top: -PILL_PAD_Y, bottom: -PILL_PAD_Y }}
              />
              {navLinks.map((link) => {
                const isExternal = link.href.startsWith("http");
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    aria-current={isActive(link.href) ? "location" : undefined}
                    className="relative rounded-xs text-ui text-nav-link outline-none transition-colors duration-200 hover:text-nav-mark focus-visible:ring-2 focus-visible:ring-nav-mark/30 focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* Written out rather than routed through <Button>: the reference
                CTA is a flat fill at a different height, radius and type size
                than every Button variant, and `cn` does not resolve conflicting
                Tailwind utilities, so overriding the shared `base` string here
                would be order-dependent. Hidden below `sm` — it reappears in
                the mobile dropdown panel instead. */}
            <a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
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
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xs text-ink outline-none transition-colors duration-200 hover:bg-stroke/40 focus-visible:ring-2 focus-visible:ring-nav-mark/30 sm:hidden"
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
              {navLinks.map((link) => {
                const isExternal = link.href.startsWith("http");
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    onClick={closeMenu}
                    aria-current={isActive(link.href) ? "location" : undefined}
                    className={[
                      "rounded-xs px-3 py-2.5 text-ui text-nav-link outline-none transition-colors duration-200 hover:bg-stroke/40 hover:text-nav-mark focus-visible:ring-2 focus-visible:ring-nav-mark/30",
                      isActive(link.href) && "bg-stroke/40 text-nav-mark",
                    ].filter(Boolean).join(" ")}
                  >
                    {link.label}
                  </a>
                );
              })}
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
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
