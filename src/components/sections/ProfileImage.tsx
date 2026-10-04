import ProfileCard from "@/components/ui/ProfileCard";
import { site } from "@/data/site";

/**
 * The About section's profile block: the React Bits ProfileCard, sized to the
 * 306x398 slot the Figma placeholder occupied. Dark styling is the upstream
 * component's own; size overrides live in `.about-profile-card` at the bottom
 * of ProfileCard.css.
 *
 * `iconUrl` / `grainUrl` are passed empty on purpose — the component's
 * defaults are literal "<Placeholder …>" strings that would become broken
 * url() values — and `showUserInfo={false}` drops the demo handle / status /
 * contact bar, which has no counterpart in this design.
 */
export function ProfileImage() {
  return (
    <ProfileCard
      className="about-profile-card"
      avatarUrl="/images/profile/athul.png"
      iconUrl=""
      grainUrl=""
      name={site.name}
      title={site.role}
      showUserInfo={false}
      enableTilt
      enableMobileTilt
      behindGlowColor="rgba(12, 64, 228, 0.45)"
      behindGlowSize="50%"
      innerGradient="radial-gradient(circle at 82% 0%, rgba(12, 64, 228, 0.2) 0%, rgba(12, 64, 228, 0) 60%), linear-gradient(160deg, #0b1236 0%, #070b22 55%, #04060f 100%)"
    />
  );
}
