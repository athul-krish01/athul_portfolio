import { socialLinks } from "@/data/social-links";
import { ArrowUpRightIcon } from "@/components/ui/icons";

/**
 * Bordered social-links grid (1/2/3 columns depending on viewport),
 * replacing the old plain inline row.
 *
 * Border strategy: the outer <nav> owns only its top + left edge; every
 * cell owns its own right + bottom edge. That combination produces a
 * complete, correctly aligned border grid at any column count or row-wrap
 * without per-cell index/position logic — the rightmost cell in any row
 * supplies the grid's right edge via its own border-r, and the bottommost
 * cell in any column supplies the bottom edge via its own border-b. (The
 * usual `divide-x`/`divide-y` utilities don't work here: they key off DOM
 * order, not grid position, so they'd add a stray left border to the first
 * cell of every wrapped row.)
 *
 * Columns switch at `sm` (640px) and `lg` (1024px) — not the shared `frame`
 * breakpoint (980px), despite that being the closer match to the page's own
 * canvas going fixed-width. `--breakpoint-frame` is a custom breakpoint
 * registered via `@theme inline`, and Tailwind v4 emits its media query
 * *before* the built-in `sm`/`md`/`lg` blocks in the generated stylesheet
 * rather than in numeric-width order — so at any viewport ≥980px,
 * `sm:grid-cols-2` would come later in the cascade and silently win over
 * `frame:grid-cols-3` (verified in the compiled CSS). This is the same
 * ordering quirk noted in About.tsx's `frame:-mx-6`; `lg` sidesteps it
 * because built-in breakpoints are always emitted in width order.
 *
 * Canvas width: this section is deliberately rendered OUTSIDE <PageFrame>
 * (see page.tsx) and reproduces just the piece of PageFrame's own sizing it
 * needs (`frame:mx-auto frame:w-[980px] frame:px-0`) directly. Nesting
 * inside PageFrame was ruled out: PageFrame's `frame:px-0` loses to its own
 * `sm:px-6` under the same cascade-ordering quirk above (the bug About.tsx's
 * `-mx-6` already works around for that panel), so anything inside PageFrame
 * keeps a stray ~24px inset at the `frame` breakpoint and can only reach the
 * true canvas edge via a counter-margin. Since a negative margin isn't an
 * option here, this component gets its own copy of the *intended* (bug-free)
 * sizing instead, which also means its fluid gutter stays a flat 16px (`px-4`)
 * below `frame` rather than stepping up to 24px at `sm` like PageFrame's does
 * — that one `sm:` step is exactly what the bug needs to trigger, so it's
 * left out rather than reintroducing the conflict.
 */
export function SocialLinks() {
  return (
    <div className="w-full px-4 py-10 frame:mx-auto frame:w-[980px] frame:px-0">
      <nav
        aria-label="Social links"
        className="grid grid-cols-1 border-t border-l border-stroke sm:grid-cols-2 lg:grid-cols-3"
      >
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 border-b border-r border-stroke px-5 py-4 outline-none transition-colors duration-200 ease-out hover:bg-stroke/30 focus-visible:bg-stroke/30 motion-reduce:transition-none"
          >
            <span className="flex items-center gap-4 text-base text-muted">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-stroke/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={link.icon}
                  alt=""
                  className="h-8 w-8 object-contain"
                />
              </div>
              {link.label}
            </span>
            <ArrowUpRightIcon className="shrink-0 text-muted transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </a>
        ))}
      </nav>
    </div>
  );
}
