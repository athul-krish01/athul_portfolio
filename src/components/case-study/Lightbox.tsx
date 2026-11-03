"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import type { Visual } from "@/data/case-studies/hirebit";
import { cn } from "@/lib/cn";

/**
 * Quick Look–style image viewer for the case study.
 *
 * Click (or focus and press Space / Enter) any figure: it zooms out of its
 * place on the page into a full-viewport view. Esc, Space, the close button,
 * a click on the backdrop or the browser's Back button all close it, zooming
 * back into the figure. ← / → step through every figure in page order.
 * Reduced motion swaps the zoom for a fade.
 */

type Open = (id: string) => void;
const LightboxContext = createContext<Open | null>(null);

const ratio = (aspect: string) => {
  const [w, h] = aspect.split("/").map(Number);
  return w && h ? w / h : 16 / 10;
};
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const figureFor = (id: string) => document.querySelector<HTMLElement>(`[data-visual-id="${id}"]`);

export function LightboxProvider({ items, children }: { items: Visual[]; children: ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const historyPushed = useRef(false);
  const closing = useRef(false);

  const current = index === null ? null : items[index];

  /** Transform that maps the stage onto a figure's on-page rectangle. */
  const fromFigure = (id: string) => {
    const fig = figureFor(id)?.getBoundingClientRect();
    const stage = stageRef.current?.getBoundingClientRect();
    if (!fig || !stage || fig.width === 0) return null;
    const dx = fig.left + fig.width / 2 - (stage.left + stage.width / 2);
    const dy = fig.top + fig.height / 2 - (stage.top + stage.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${fig.width / stage.width})`;
  };

  const open = useCallback<Open>(
    (id) => {
      const i = items.findIndex((v) => v.id === id);
      if (i >= 0) setIndex(i);
    },
    [items],
  );

  // Show the dialog when an item is chosen, then zoom in from its figure.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (index === null || !dialog || dialog.open) return;
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    history.pushState({ caseStudyLightbox: true }, "");
    historyPushed.current = true;

    const id = items[index].id;
    const stage = stageRef.current;
    const reduced = reducedMotion();
    const start = reduced ? null : fromFigure(id);
    scrimRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduced ? 150 : 280, easing: "ease-out" });
    stage?.animate(
      start ? [{ transform: start, opacity: 0.7 }, { transform: "none", opacity: 1 }] : [{ opacity: 0 }, { opacity: 1 }],
      { duration: reduced ? 150 : 340, easing: "cubic-bezier(0.2, 0.9, 0.25, 1)" },
    );
    // Only re-run on open, not on every arrow-key step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index === null]);

  const close = useCallback(
    async (viaHistory = false) => {
      const dialog = dialogRef.current;
      if (!dialog?.open || closing.current || index === null) return;
      closing.current = true;
      const id = items[index].id;
      const reduced = reducedMotion();
      const end = reduced ? null : fromFigure(id);
      const stage = stageRef.current;
      await Promise.all([
        scrimRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduced ? 120 : 240, easing: "ease-in", fill: "forwards" }).finished,
        stage?.animate(
          end ? [{ transform: "none", opacity: 1 }, { transform: end, opacity: 0.6 }] : [{ opacity: 1 }, { opacity: 0 }],
          { duration: reduced ? 120 : 280, easing: "cubic-bezier(0.4, 0, 0.6, 1)", fill: "forwards" },
        ).finished,
      ]).catch(() => {});
      dialog.close();
      stage?.getAnimations().forEach((a) => a.cancel());
      scrimRef.current?.getAnimations().forEach((a) => a.cancel());
      document.documentElement.style.overflow = "";
      if (historyPushed.current && !viaHistory) history.back();
      historyPushed.current = false;
      closing.current = false;
      setIndex(null);
      figureFor(id)?.focus({ preventScroll: true });
    },
    [index, items],
  );

  // Browser Back closes the viewer instead of leaving the page.
  useEffect(() => {
    const onPop = () => {
      if (dialogRef.current?.open) {
        historyPushed.current = false;
        void close(true);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [close]);

  const step = (delta: number) => setIndex((i) => (i === null ? i : (i + delta + items.length) % items.length));

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.key === " " && !(e.target instanceof HTMLButtonElement)) {
      e.preventDefault();
      void close();
    }
  };

  return (
    <LightboxContext.Provider value={open}>
      {children}
      <dialog
        ref={dialogRef}
        aria-label={current ? `Image viewer: ${current.label}` : "Image viewer"}
        onCancel={(e) => {
          e.preventDefault();
          void close();
        }}
        onKeyDown={onKeyDown}
        onClick={(e) => {
          if (e.target === e.currentTarget || e.target === scrimRef.current) void close();
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-transparent"
      >
        <div ref={scrimRef} className="absolute inset-0 bg-[#0b0d12]/85 backdrop-blur-sm" />
        {current ? (
          <div className="pointer-events-none relative flex h-full w-full flex-col items-center justify-center gap-4 px-4 py-16 sm:px-20">
            <div
              ref={stageRef}
              className="pointer-events-auto relative overflow-hidden rounded-card bg-surface shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
              style={{
                aspectRatio: current.aspect,
                width: `min(100%, calc((100dvh - 9rem) * ${ratio(current.aspect)}))`,
              }}
            >
              {current.src && current.video ? (
                <video src={current.src} aria-label={current.alt ?? current.label} controls autoPlay muted loop playsInline className="absolute inset-0 size-full object-contain" />
              ) : current.src ? (
                <Image src={current.src} alt={current.alt ?? current.label} fill sizes="100vw" className="object-contain" unoptimized />
              ) : (
                <PlaceholderFill visual={current} large />
              )}
            </div>
            <p className="pointer-events-auto flex items-center gap-3 text-[14px] leading-5 text-white/85">
              <span>{current.label}</span>
              <span className="tabular-nums text-white/50">
                {(index ?? 0) + 1} / {items.length}
              </span>
            </p>
          </div>
        ) : null}

        <div className="absolute right-4 top-4 flex gap-2">
          <ViewerButton label="Previous image (←)" onClick={() => step(-1)}>
            <path d="M10 3.5L5.5 8l4.5 4.5" />
          </ViewerButton>
          <ViewerButton label="Next image (→)" onClick={() => step(1)}>
            <path d="M6 3.5L10.5 8 6 12.5" />
          </ViewerButton>
          <ViewerButton label="Close (Esc)" onClick={() => void close()} autoFocus>
            <path d="M4 4l8 8M12 4l-8 8" />
          </ViewerButton>
        </div>
      </dialog>
    </LightboxContext.Provider>
  );
}

function ViewerButton({ label, onClick, autoFocus, children }: { label: string; onClick: () => void; autoFocus?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      autoFocus={autoFocus}
      className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white outline-none transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}

/** The striped "image to come" fill, shared by figures and the viewer. */
function PlaceholderFill({ visual, large }: { visual: Visual; large?: boolean }) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-accent-soft/60 p-4",
        "bg-[repeating-linear-gradient(315deg,var(--color-accent-line)_0_1px,transparent_1px_12px)]",
      )}
    >
      <span
        className={cn(
          "flex items-center gap-2 rounded-badge border border-accent-line bg-surface font-medium text-accent",
          large ? "px-4 py-2 text-[14px] leading-5" : "px-3 py-1.5 text-[12px] leading-4",
        )}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
          <rect x="1.75" y="2.75" width="12.5" height="10.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="5.5" cy="6.25" r="1.25" fill="currentColor" />
          <path d="M2.5 12l3.5-3.5 2.5 2.5 2-2 3 3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
        {visual.video ? "Add clip" : "Add image"} · {visual.id}
      </span>
    </div>
  );
}

/** Figma's frame icon (a "#"), at caption size. */
function FrameGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0 text-muted/80">
      <path d="M4 1v10M8 1v10M1 4h10M1 8h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * One image slot: a 16:10 frame named like a Figma frame. The whole frame is
 * a button that opens the viewer.
 */
export function Figure({
  visual,
  sizes = "(min-width: 980px) 980px, 100vw",
  className,
  priority,
  caption = true,
}: {
  visual: Visual;
  sizes?: string;
  className?: string;
  priority?: boolean;
  caption?: boolean;
}) {
  const open = useContext(LightboxContext);

  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      {caption ? (
        <figcaption className="flex items-center gap-1.5 text-[13px] leading-5 text-muted">
          <FrameGlyph />
          {visual.label}
        </figcaption>
      ) : null}
      <button
        type="button"
        data-visual-id={visual.id}
        onClick={() => open?.(visual.id)}
        aria-label={`View larger: ${visual.label}`}
        className={cn(
          "group relative block w-full cursor-zoom-in overflow-hidden rounded-card border outline-none",
          "focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-4 focus-visible:ring-offset-surface",
          visual.src ? "border-stroke bg-card-backplate" : "border-accent-line",
        )}
        style={{ aspectRatio: visual.aspect }}
      >
        {visual.src && visual.video ? (
          <LoopClip src={visual.src} label={visual.alt ?? visual.label} />
        ) : visual.src ? (
          <Image
            src={visual.src}
            alt={visual.alt ?? ""}
            fill
            sizes={sizes}
            className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.015] motion-reduce:transition-none"
            unoptimized
            priority={priority}
          />
        ) : (
          <PlaceholderFill visual={visual} />
        )}
        {/* Expand hint */}
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-surface/90 text-ink opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5L9 7M2.5 13.5L7 9" />
          </svg>
        </span>
      </button>
    </figure>
  );
}

/**
 * A short muted loop inside a figure (the cover reel, the tray sliding in).
 * Plays on its own, except for reduced-motion visitors, who get the first
 * frame; the viewer has controls either way.
 */
function LoopClip({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (query.matches) ref.current?.pause();
      else void ref.current?.play().catch(() => {});
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
      className="absolute inset-0 size-full object-cover"
    />
  );
}
