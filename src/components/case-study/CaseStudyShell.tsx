import type { ReactNode } from "react";
import { PageCanvas, PageFrame } from "@/components/layout/PageFrame";
import { PageGrid } from "@/components/layout/PageGrid";
import { ColumnGuides } from "@/components/layout/ColumnGuides";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { SocialLinks } from "@/components/sections/SocialLinks";
import { SiteFooter } from "@/components/sections/SiteFooter";

/**
 * The homepage's page furniture around a case study: the same canvas, grid
 * lines, floating navbar, 980px column and footer, so the page reads as part
 * of the site rather than a separate template.
 */
export function CaseStudyShell({ children }: { children: ReactNode }) {
  return (
    <PageCanvas>
      <PageGrid />
      <ColumnGuides />

      <div className="relative">
        <SiteHeader />
        <main>
          <PageFrame>{children}</PageFrame>

          {/* Outside PageFrame on purpose — see the comment in SocialLinks.tsx. */}
          <SocialLinks />
        </main>
      </div>

      <PageFrame>
        <SiteFooter className="mt-[60px]" />
      </PageFrame>
    </PageCanvas>
  );
}
