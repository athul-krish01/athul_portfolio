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
 * keyboard-focusable. The "Read case study" pill is decorative (aria-hidden);
 * the link's aria-label carries the meaning.
 */
export function WorkCard({ project }: { project: Project }) {
  return (
    // h-full makes the card fill its grid cell, so mt-auto below has space to
    // push against — without it the tag row floats under the description and
    // the two cards in a row get mismatched divider heights.
    <article className="group relative flex h-full flex-col">
      <a
        href={project.href}
        aria-label={`Read case study: ${project.title}`}
        className="absolute inset-0 z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink"
      />
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
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-300 group-hover:bg-ink/5 group-has-[:focus-visible]:bg-ink/5"
        >
          <span className="inline-flex translate-y-1 items-center gap-2 rounded-badge bg-nav-mark py-2 pr-3 pl-4 text-ui font-sans uppercase tracking-[0.04em] text-primary-fg opacity-0 shadow-nav transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-has-[:focus-visible]:translate-y-0 group-has-[:focus-visible]:opacity-100">
            <span className="size-1.5 rounded-full bg-primary-fg/70" />
            Read case study
            <ArrowRightIcon />
          </span>
        </span>
      </div>

      {/* No horizontal padding here — the divider below is full-bleed, so the
          24px inset is applied per-block instead. pt-8 = 32px, pb-4 = 16px. */}
      <div className="flex flex-1 flex-col gap-6 pt-8 pb-4">
        <div className="flex flex-col gap-2 px-6">
          <h3 className="text-card-title text-ink">{project.title}</h3>
          <p className="text-body text-muted">{project.description}</p>
        </div>

        {/* mt-auto pins the tag row to the bottom regardless of description length. */}
        <div className="mt-auto">
          {/* Line 11: spans the full 450px card width (x=0→449), touching both
              card borders. Measured 6px dash / 6px gap off the 1:1 Figma render —
              a repeating gradient rather than `border-dashed`, because Chrome
              renders a 1px dashed border at roughly 3px/3px and can't be tuned. */}
          <div className="h-px w-full bg-[image:repeating-linear-gradient(to_right,var(--color-stroke)_0_6px,transparent_6px_12px)]" />
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
