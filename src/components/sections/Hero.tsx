import { hero } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { AvatarSlot } from "@/components/sections/AvatarSlot";

/**
 * Vertical rhythm is taken from the design's canvas coordinates:
 *
 *   navbar      y=40   h=58  (ends 98)
 *   avatar slot y=160  h=110 (ends 270)   -> 62px below the navbar
 *   hero text   y=312  h=263 (ends 575)   -> 42px below the avatar
 *     heading   +0     h=106 (2 lines @ 48/1.1)
 *     paragraph +122   h=81  (3 lines @ 18/1.5)  -> 16px below the heading
 *     CTA row   +227   h=36                      -> 24px below the paragraph
 *
 * Widths are also from source: the heading is capped at 729.27px (which is
 * what produces its two-line break) and the paragraph at 900px.
 */
export function Hero() {
  return (
    <section className="pt-[62px] lg:px-10">
      <AvatarSlot />

      <div className="pt-[42px]">
        <h1 className="max-w-[729.27px] text-hero text-ink">
          I make complicated software <br className="hidden sm:block" />
          less complicated.
        </h1>

        <p className="mt-4 max-w-[900px] text-body text-muted">{hero.body}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button variant="primary-hero" icon={<ArrowRightIcon />}>
            Say hello
          </Button>
          <Button variant="light">Get my resume</Button>
        </div>
      </div>
    </section>
  );
}
