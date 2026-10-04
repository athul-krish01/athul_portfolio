import ProfileCard from "@/components/ui/ProfileCard";
import { site } from "@/data/site";

// Film-grain tile: fractal noise keyed to alpha so only sparse, light-blue
// specks survive. Inline + base64 so it needs no asset and the component's
// unquoted `url(...)` accepts it.
const GRAIN_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
  "<filter id='n' x='0' y='0' width='100%' height='100%'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>" +
  "<feColorMatrix values='0 0 0 0 0.55  0 0 0 0 0.72  0 0 0 0 1  2.4 0 0 0 -1.15'/>" +
  "</filter><rect width='100%' height='100%' filter='url(#n)'/></svg>";
const GRAIN_URL = `data:image/svg+xml;base64,${btoa(GRAIN_SVG)}`;

/**
 * The About section's profile block: the React Bits ProfileCard, sized to the
 * 306x398 slot the Figma placeholder occupied. Size, palette and the hover
 * grain live in `.about-profile-card` at the bottom of ProfileCard.css.
 *
 * `iconUrl` is passed empty on purpose — the component's default is a literal
 * "<Placeholder …>" string that would become a broken url() value — and
 * `showUserInfo={false}` drops the demo handle / status / contact bar, which
 * has no counterpart in this design.
 */
export function ProfileImage() {
  return (
    <ProfileCard
      className="about-profile-card"
      avatarUrl="/images/profile/athul.png"
      iconUrl=""
      grainUrl={GRAIN_URL}
      name={site.name}
      title={site.role}
      showUserInfo={false}
      enableTilt
      enableMobileTilt
      behindGlowColor="rgba(12, 64, 228, 0.45)"
      behindGlowSize="50%"
      innerGradient="radial-gradient(circle at 82% 0%, rgba(12, 64, 228, 0.16) 0%, rgba(12, 64, 228, 0) 55%), linear-gradient(160deg, #141b44 0%, #0c1230 50%, #060a1c 100%)"
    />
  );
}
