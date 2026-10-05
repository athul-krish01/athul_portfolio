import { about } from "@/data/site";
import { ProfileImage } from "@/components/sections/ProfileImage";

/**
 * Figma: one 980x700 rounded container (canvas y=2091..2791), split into two
 * 490px halves by a 1px #efefef rule. Measured off the 1:1 export:
 *   - 20px corner radius, 1px #e5e5e5 border
 *   - left half: dashed-grid backdrop, profile inset 109px left / 104px top
 *   - right half: 24px side padding, 56px top padding, top-aligned
 *   - the container's bottom border IS the following divider band's top rule,
 *     so there is no gap between them (hence no bottom padding here)
 *
 * The backdrop is a 48px repeating tile rather than Figma's ~2,000 nested
 * 24px frames: a 24px checkerboard alternating a 2x10 vertical tick with a
 * 10x2 horizontal dash, both #fafafa. The -9px x-offset reproduces the
 * source's phase, where the first column of marks is clipped by the border.
 *
 * Below `lg` the halves stack with the text first (approved decision).
 */
export function About() {
  return (
    <section className="pt-[60px] relative z-10 overflow-hidden rounded-card-inner">
      <div className="rounded-card-inner border-t border-r border-b border-l border-stroke lg:flex lg:min-h-[700px]">
        <div
          // items-start, or the flex default `stretch` overrides the profile
          // block's aspect ratio and pulls it down to the container's height.
          className="order-2 flex items-start justify-center px-10 py-10 lg:order-1 lg:w-1/2 lg:justify-start lg:pr-0 lg:pb-0 lg:pl-[109px] lg:pt-[104px]"
          style={{
            backgroundImage: "url('/icons/grid/about-pattern.svg')",
            backgroundSize: "48px 48px",
            backgroundPosition: "-9px 0",
          }}
        >
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
