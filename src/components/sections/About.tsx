import { about } from "@/data/site";
import { ProfileImage } from "@/components/sections/ProfileImage";
import { DotGridSpotlight } from "@/components/ui/DotGridSpotlight";

/**
 * Figma: one 980x700 rounded container (canvas y=2091..2791), split into two
 * 490px halves by a 1px #efefef rule. Measured off the 1:1 export:
 *   - 20px corner radius, 1px #e5e5e5 border
 *   - left half: profile inset 109px left / 104px top
 *   - right half: 24px side padding, 56px top padding, top-aligned
 *   - the container's bottom border IS the following divider band's top rule,
 *     so there is no gap between them (hence no bottom padding here)
 *
 * The backdrop (originally a static dashed-grid tile) is now an interactive
 * dot-grid spotlight (DotGridSpotlight), confined to the profile-card column
 * only (not the text column) so it tracks that column's own width at every
 * breakpoint instead of a hardcoded size. It's absolutely positioned behind
 * ProfileImage within that column; ProfileImage already renders with its own
 * `position: relative` (`.pc-card-wrapper` in ProfileCard.css), so it paints
 * above the canvas without needing an extra z-index here.
 *
 * Below `lg` the halves stack with the text first (approved decision).
 *
 * frame:-mx-6 cancels out PageFrame's horizontal padding at the `frame`
 * breakpoint (980px) so this panel's rounded corners sit flush with the
 * canvas boundary (PageGrid's column-edge guides), matching the Figma
 * full-bleed panel instead of sitting inset inside it. PageFrame's own
 * `frame:px-0` is meant to zero that padding out at this breakpoint, but a
 * Tailwind v4 @media ordering quirk makes the built-in `sm:px-6` rule win the
 * cascade there instead, leaking 24px of padding through; this offsets that
 * leak locally rather than touching the shared PageFrame (which other
 * full-bleed sections also depend on).
 */
export function About() {
  return (
    <section className="pt-[60px] relative z-10 overflow-hidden rounded-tl-[20px] rounded-tr-[20px] frame:-mx-6">
      <div className="rounded-tl-[20px] rounded-tr-[20px] border-t border-b border-stroke lg:flex lg:min-h-[700px]">
        <div
          // items-start, or the flex default `stretch` overrides the profile
          // block's aspect ratio and pulls it down to the container's height.
          className="relative order-2 flex items-start justify-center px-10 py-10 lg:order-1 lg:w-1/2 lg:justify-start lg:pr-0 lg:pb-0 lg:pl-[109px] lg:pt-[104px]"
        >
          <DotGridSpotlight className="pointer-events-none absolute inset-0" />
          <ProfileImage />
        </div>

        <div className="order-1 flex flex-col gap-8 px-6 py-10 lg:order-2 lg:w-1/2 lg:border-l lg:border-stroke-soft lg:pb-0 lg:pt-14">
          <div className="flex flex-col gap-4">
            <p className="text-eyebrow text-muted">{about.eyebrow}</p>
            <h2 className="text-about-heading text-ink-strong">{about.heading}</h2>
          </div>
          <div className="flex flex-col gap-4">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-body text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
