import ProfileCard from "@/components/ui/ProfileCard";
import { site } from "@/data/site";

/**
 * The About section's profile block: the React Bits ProfileCard, sized to the
 * 306x398 slot the Figma placeholder occupied. Visual overrides live in
 * `.about-profile-card` at the bottom of ProfileCard.css.
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
      behindGlowColor="rgba(24, 24, 24, 0.14)"
      behindGlowSize="60%"
      innerGradient="linear-gradient(160deg, #f6f6f6 0%, #e9e9e9 100%)"
    />
  );
}
