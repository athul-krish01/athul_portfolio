import TechText from "@/components/ui/TechText";
import { site } from "@/data/site";

/**
 * Footer wordmark: the React Bits TechText, replacing the temporary static
 * <p>. The footer keeps its 289px height — 177px of canvas between 56px of
 * padding — and the canvas is tall enough (>= ink height / 0.66, the
 * component's own fit rule) that the wordmark renders at the full 150px
 * rather than being scaled down.
 *
 * Typeface: Inter, via the `font-wordmark` class. TechText reads the
 * container's computed font-family for its canvas drawing and loads the face
 * itself, so no `fontFamily` prop is needed.
 */
export function SiteFooter() {
  return (
    <footer className="flex justify-center overflow-hidden py-14">
      <TechText
        text={site.name}
        className="font-wordmark"
        style={{ height: 177 }}
        color="#565656"
        accentColor="#2991FF"
        fontWeight={600}
        fontSize={150}
        reveal="letter"
        dashLength={4}
        dashGap={2}
        specks={15}
      />
    </footer>
  );
}
