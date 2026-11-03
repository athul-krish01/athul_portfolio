"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { cn } from "@/lib/cn";

interface Section {
  id: string;
  label: string;
}

/**
 * Below 1400px the page margin can't hold the side rail, so the tabs show
 * instead (classes are written out in full so Tailwind generates them).
 */
const SHOW_RAIL = "min-[1400px]:block";
const HIDE_TABS = "min-[1400px]:hidden";

/**
 * Case study section navigation, two forms sharing one scroll-spy:
 *
 *  - Rail (≥1400px): a floating panel on the left edge, as on the reference
 *    case studies — dash markers, the current section dark with a longer dash.
 *    It fades in once the reader reaches the sections and out after them.
 *  - Tabs (<1400px): a sticky horizontal bar under the navbar, scrolling
 *    sideways on phones with the current tab kept in view.
 *
 * Clicking either scrolls the section in just below the navbar (and the
 * tabs, when shown) and moves focus there for keyboard and screen readers.
 *
 * Both also show how much is left to read: a progress bar and an estimate
 * of the minutes remaining, from the case study's word count.
 */

const WORDS_PER_MINUTE = 230;

function leftLabel(minutes: number) {
  return minutes > 0 ? `${minutes} min left` : "Almost done";
}
export function SectionNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const [railVisible, setRailVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [minutesLeft, setMinutesLeft] = useState(0);
  const totalMinutes = useRef(0);
  const tabsRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  /** Where a section's top should land: below the tabs if shown, else the navbar. */
  const landingLine = useCallback(() => {
    const tabs = tabsRef.current;
    if (tabs && getComputedStyle(tabs).display !== "none") {
      return parseFloat(getComputedStyle(tabs).top) + tabs.offsetHeight + 24;
    }
    return 96 + 32; // --layout-nav-reserve (40 + 56) + breathing room
  }, []);

  useEffect(() => {
    let frame = 0;
    // Reading time for everything the navigation covers.
    const words = tabsRef.current?.parentElement?.textContent?.trim().split(/\s+/).length ?? 0;
    totalMinutes.current = words / WORDS_PER_MINUTE;
    const update = () => {
      frame = 0;
      const line = landingLine() + 8;
      let current = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) current = s.id;
      }
      const first = document.getElementById(sections[0]?.id ?? "");
      const last = document.getElementById(sections[sections.length - 1]?.id ?? "");
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom && last && last.getBoundingClientRect().top < window.innerHeight) {
        current = last.id;
      }
      setActive(current);
      if (first && last) {
        const vh = window.innerHeight;
        const top = first.getBoundingClientRect().top + window.scrollY;
        const bottom = last.getBoundingClientRect().bottom + window.scrollY;
        const read = Math.min(1, Math.max(0, (window.scrollY + vh * 0.6 - top) / (bottom - top)));
        setProgress(read);
        setMinutesLeft(Math.ceil(totalMinutes.current * (1 - read) - 0.25));
        setRailVisible(first.getBoundingClientRect().top < vh * 0.7 && last.getBoundingClientRect().bottom > vh * 0.3);
      }
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
  }, [sections, landingLine]);

  // Keep the current tab in view when the tab bar scrolls sideways (phones).
  useEffect(() => {
    const list = listRef.current;
    const tab = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !tab) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: reduced ? "auto" : "smooth" });
  }, [active]);

  const go = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - landingLine(), behavior: reduced ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
    el.focus({ preventScroll: true });
  };

  return (
    <>
      {/* ---------- Rail (wide screens) ---------- */}
      <nav
        aria-label="Case study sections"
        inert={!railVisible}
        className={cn(
          "fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 transition-[opacity,translate] duration-300 ease-out motion-reduce:transition-none",
          SHOW_RAIL,
          railVisible ? "opacity-100" : "pointer-events-none -translate-x-3 opacity-0",
        )}
      >
        <div className="flex flex-col gap-3 rounded-r-card border border-l-0 border-stroke bg-surface py-3 pl-4 pr-6 shadow-[0_16px_32px_-12px_rgba(12,12,13,0.14)]">
        <div className="flex flex-col gap-2 border-b border-stroke pb-3" aria-live="off">
          <span className="flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase leading-4 tracking-[0.08em] text-muted">
            <span>{leftLabel(minutesLeft)}</span>
            <span className="tabular-nums text-ink">{Math.round(progress * 100)}%</span>
          </span>
          <span
            role="progressbar"
            aria-label="Reading progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            className="block h-1 overflow-hidden rounded-full bg-stroke"
          >
            <span className="block h-full origin-left rounded-full bg-accent" style={{ transform: `scaleX(${progress})` }} />
          </span>
        </div>
        <ol className="flex flex-col">
          {sections.map((s) => {
            const current = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => go(e, s.id)}
                  aria-current={current ? "location" : undefined}
                  className="group flex items-center gap-3 rounded-xs py-1.5 pr-1 text-[14px] leading-5 text-muted outline-none transition-colors duration-200 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/40 aria-[current=location]:text-ink motion-reduce:transition-none"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-px shrink-0 transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none",
                      current ? "w-6 bg-ink" : "w-3 bg-stroke-strong/30 group-hover:w-4 group-hover:bg-ink/60",
                    )}
                  />
                  {s.label}
                </a>
              </li>
            );
          })}
        </ol>
        </div>
      </nav>

      {/* ---------- Tabs (everything narrower) ---------- */}
      <nav
        ref={tabsRef}
        aria-label="Case study sections"
        className={cn(
          "sticky z-40 top-[calc(var(--layout-nav-offset-sm)+var(--layout-nav-height)+8px)] sm:top-[calc(var(--layout-nav-reserve)+8px)]",
          "flex items-center overflow-hidden rounded-full border border-stroke bg-surface/90 p-1 shadow-[0_8px_24px_-12px_rgba(12,12,13,0.18)]",
          "supports-[backdrop-filter]:bg-surface/75 backdrop-blur-[var(--nav-glass-blur)]",
          HIDE_TABS,
        )}
      >
        <ul
          ref={listRef}
          className={cn(
            "flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            // Fade the edges on narrow screens so cut-off tabs read as "scroll for more".
            "[mask-image:linear-gradient(to_right,transparent,#000_20px,#000_calc(100%-20px),transparent)] md:[mask-image:none]",
          )}
        >
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                data-id={s.id}
                onClick={(e) => go(e, s.id)}
                aria-current={active === s.id ? "location" : undefined}
                className={cn(
                  "block whitespace-nowrap rounded-full px-3.5 py-2 text-ui text-nav-link outline-none transition-colors duration-200 motion-reduce:transition-none",
                  "hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/40",
                  "aria-[current=location]:bg-accent-soft aria-[current=location]:text-accent",
                )}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <span className="hidden shrink-0 border-l border-stroke px-3.5 font-mono text-[11px] uppercase leading-4 tracking-[0.08em] text-muted sm:block">
          {leftLabel(minutesLeft)}
        </span>
        {/* How far through the case study */}
        <span aria-hidden="true" className="absolute inset-x-5 bottom-0 h-[2px] overflow-hidden rounded-full">
          <span className="block h-full origin-left bg-accent" style={{ transform: `scaleX(${progress})` }} />
        </span>
      </nav>
    </>
  );
}
