/**
 * The About section's profile photo. Confirmed temporary — a flat colored
 * rectangle in the Figma file itself (#734040), not a real photo. Isolated
 * in its own component so the swap-in later touches one file.
 */
export function ProfileImage() {
  return (
    <div
      className="aspect-[306/398] w-full max-w-[306px] rounded-profile bg-profile-placeholder"
      aria-hidden="true"
    />
  );
}
