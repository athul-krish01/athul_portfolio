'use client';

import { useState, useRef, useCallback } from 'react';
import Image from "next/image";
import type { Project } from "@/data/projects";
import { Badge } from "@/components/ui/Badge";
import { ArrowRightIcon } from "@/components/ui/icons";

/**
 * One cell in the Selected Work grid.
 *
 * Exact Figma measurements (node 1:104 / 1:147 / 1:123 / 1:395, card 450×604):
 *   - Thumbnail frame (Frame 70): 450×306 — aspect-[450/306], object-cover
 *   - Content top padding: 32px (338px from card top − 306px image height)
 *   - Content left/right padding: 24px (x=24 within 450px card)
 *   - Divider (Line 11): y=544 from card top
 *   - Tags (Frame 37): y=560, height=28px → 16px below divider
 *   - Card bottom: y=604 → 16px below tags bottom (y=588)
 *
 * Interaction: the whole card is one link via a "stretched link" — an
 * absolutely-positioned <a> covering the article — so the heading and copy
 * stay plain text for screen readers while the entire card is clickable and
 * keyboard-focusable. The cursor-follow CTA pill is decorative (aria-hidden);
 * the link's aria-label carries the meaning.
 */
export function WorkCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [cardPos, setCardPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const pillWidth = pillRef.current?.offsetWidth ?? 160;
    const pillHeight = pillRef.current?.offsetHeight ?? 32;

    // Card-local cursor position
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    // Pill top-left corner in card-local coords (before CSS transform)
    const rawLeft = localX + 12;
    const rawTop = localY - pillHeight / 2;

    // Clamp so the entire pill stays within card bounds
    const clampedLeft = Math.min(Math.max(rawLeft, 0), rect.width - pillWidth);
    const clampedTop = Math.min(Math.max(rawTop, 0), rect.height - pillHeight);

    // Back out translate(12px, -50%) so it lands at clamped position after CSS applies it
    setCardPos({
      x: clampedLeft - 12,
      y: clampedTop + pillHeight / 2,
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);
  return (
    // h-full makes the card fill its grid cell, so mt-auto below has space to
    // push against — without it the tag row floats under the description and
    // the two cards in a row get mismatched divider heights.
    <article
      ref={cardRef}
      className="group relative flex h-full flex-col"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!project.comingSoon && (
        <a
          href={project.href}
          target={project.href.startsWith("http") ? "_blank" : undefined}
          rel={project.href.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={`Read case study: ${project.title}`}
          className="absolute inset-0 z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink"
        />
      )}

      {/* Cursor-follow pill — "READ CASE STUDY" for live cards, "COMING SOON"
          for placeholder cards. Same position, size and dark-pill style. */}
      {isHovering && (
        <div
          ref={pillRef}
          aria-hidden="true"
          className="pointer-events-none absolute z-20 inline-flex items-center gap-1.5 rounded-badge bg-[#3d3d3d] border border-[#555] px-3 py-1.5 text-xs font-medium text-white shadow-lg opacity-100"
          style={{
            left: `${cardPos.x}px`,
            top: `${cardPos.y}px`,
            transform: 'translate(12px, -50%)',
          }}
        >
          {project.comingSoon ? (
            <span>COMING SOON</span>
          ) : (
            <>
              <span>READ CASE STUDY</span>
              <ArrowRightIcon className="size-3" />
            </>
          )}
        </div>
      )}

      <div className="relative aspect-[450/306] w-full overflow-hidden">
        <Image
          src={project.image}
          alt=""
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] group-has-[:focus-visible]:scale-[1.03]"
          sizes="(min-width: 768px) 450px, 100vw"
          // Served as the original PNG: the optimizer re-encodes these
          // text-heavy UI screenshots as q75 WebP, which visibly softens them.
          unoptimized
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/5 group-has-[:focus-visible]:bg-ink/5"
        />
      </div>

      {/* No horizontal padding here — the divider below is full-bleed, so the
          24px inset is applied per-block instead. pt-8 = 32px, pb-4 = 16px. */}
      <div className="flex flex-1 flex-col gap-6 pt-8 pb-4">
        {/* min-h-[2lh]/[4lh] reserve space for the longest title (2 lines) and
            description (4 lines) across all four cards, so every card's title
            + description block is the same height regardless of its own copy
            length — which is what makes the divider below land at the same Y
            in every card, including across the two grid rows (CSS Grid only
            equalizes row heights within a single row, not between rows). */}
        <div className="flex flex-col gap-2 px-6">
          <h3 className="min-h-[2lh] text-card-title text-ink">{project.title}</h3>
          <p className="min-h-[5lh] text-body text-muted">{project.description}</p>
        </div>

        {/* Deliberately NOT mt-auto (bottom-pinned): once tags can wrap to a
            second row, a card with 2 rows of tags would need a different
            amount of "push" than a 1-row card to reach the same bottom, which
            moves the divider relative to the OTHER card in the same desktop
            row — the opposite of what we want. Following the (fixed-height,
            see above) text block directly instead means the divider's Y
            position only ever depends on that fixed block, never on how many
            tag rows follow, so it stays put whether a card wraps or not. */}
        <div>
          {/* Line 11: spans the full 450px card width (x=0→449), touching both
              card borders. Measured 6px dash / 6px gap off the 1:1 Figma render —
              a repeating gradient rather than `border-dashed`, because Chrome
              renders a 1px dashed border at roughly 3px/3px and can't be tuned. */}
          <div className="h-px w-full bg-[image:repeating-linear-gradient(to_right,var(--color-stroke)_0_6px,transparent_6px_12px)]" />
          {/* flex-wrap lets tags fall to a second row instead of overflowing
              the card on narrow widths. The grid column track that contains
              this card already clamps to minmax(0, 1fr) (Tailwind's default
              for grid-cols-*), so this row only ever has to fit a bounded,
              shrinkable width — it never forces the card or page wider. */}
          <div className="flex flex-wrap gap-3 px-6 pt-4">
            {project.tags.map((tag, index) => (
              <Badge key={`${tag}-${index}`}>{tag}</Badge>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
