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
 * Two nested decorative layers, because they have different vertical
 * extents in the source:
 *   - PageGrid spans the whole canvas (outer boundaries + top/bottom rules).
 *   - ColumnGuides stop before the footer (y=3118 in the source, i.e. just
 *     past the social links), so they are scoped to the main block below
 *     rather than the whole page.
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

      {/* Main block: everything above the footer — the extent of the
          internal column guides. */}
      <div className="relative">
        <ColumnGuides />
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
            <SocialLinks />
          </PageFrame>
        </main>
      </div>

      <PageFrame>
        <SectionDivider className="mt-[60px]" />
        <SiteFooter />
      </PageFrame>
    </PageCanvas>
  );
}
