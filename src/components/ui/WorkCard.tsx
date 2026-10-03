import Image from "next/image";
import type { Project } from "@/data/projects";
import { Badge } from "@/components/ui/Badge";

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
 */
export function WorkCard({ project }: { project: Project }) {
  return (
    // h-full makes the card fill its grid cell, so mt-auto below has space to
    // push against — without it the tag row floats under the description and
    // the two cards in a row get mismatched divider heights.
    <article className="flex h-full flex-col">
      <div className="relative aspect-[450/306] w-full overflow-hidden">
        <Image
          src={project.image}
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 768px) 450px, 100vw"
        />
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
