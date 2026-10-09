import { PageCanvas, PageFrame } from "@/components/layout/PageFrame";
import { PageGrid } from "@/components/layout/PageGrid";
import { ColumnGuides } from "@/components/layout/ColumnGuides";
import { SectionDivider } from "@/components/layout/SectionDivider";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { About } from "@/components/sections/About";
import { ContactCta } from "@/components/sections/ContactCta";
import { SocialLinks } from "@/components/sections/SocialLinks";
import { SiteFooter } from "@/components/sections/SiteFooter";

/**
 * Composition root — mirrors the Figma layer order 1:1.
 *
 * Decorative grid layers (PageGrid, ColumnGuides) both span the full canvas
 * height from top to footer:
 *   - PageGrid: outer boundaries + top/bottom rules
 *   - ColumnGuides: two internal vertical column guides
 *
 * Inter-section spacing is taken from canvas coordinates: hero ends y=575,
 * divider y=635-683, "Selected work" y=743 — i.e. 60px on either side of
 * the first divider band.
 */
export default function Home() {
  return (
    <PageCanvas>
      {/* Scroll target for the navbar's "Home" link and wordmark. A
          zero-height marker at the very top of the canvas rather than an id
          on <Hero>, so "Home" lands on the top of the page instead of part
          way down the hero — and so no section component has to change. */}
      <div id="home" />

      <PageGrid />

      <ColumnGuides />

      {/* Main block: everything above the footer */}
      <div className="relative">
        <SiteHeader />
        <main>
          <PageFrame>
            <Hero />
            <SectionDivider className="mt-[60px]" />
            <SelectedWork className="mt-[60px]" />
            <About />
            {/* -mt-px: in the source the About container's bottom border and
                this band's top rule are the same 1px line (canvas y=2791), so
                the band overlaps the border rather than stacking under it. */}
            <SectionDivider className="-mt-px" />
            <ContactCta />
          </PageFrame>

          {/* Rendered outside PageFrame on purpose — see the comment in
              SocialLinks.tsx for why it needs its own copy of the canvas
              width instead of nesting inside PageFrame's own. */}
          <SocialLinks />
        </main>
      </div>

      <PageFrame>
        <SiteFooter className="mt-[60px]" />
      </PageFrame>
    </PageCanvas>
  );
}
