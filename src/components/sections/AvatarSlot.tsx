/**
 * ============================================================
 *  AVATAR SLOT — RESERVED SPACE, INTENTIONALLY EMPTY
 * ============================================================
 *
 * This is the mount point for the interactive avatar component, which the
 * owner will add later. It deliberately renders NOTHING visible:
 *
 *   - no image is sourced, generated or referenced,
 *   - no placeholder fill, border or background,
 *   - fully transparent.
 *
 * It still holds its exact layout footprint so the Hero below it does not
 * shift when the real avatar lands: 110x110, matching Figma node 1:66
 * ("Frame 27") at column-relative x=40, y=160. The fixed height is what
 * stops the row collapsing while it is empty.
 *
 * To add the avatar later, render it inside this component — the
 * surrounding spacing is already correct.
 *
 * Note: in the source file the avatar artwork (98.46x118) overflows this
 * 110x110 frame vertically by 8px. Whatever goes here may need to overflow
 * likewise; the slot does not clip its children.
 */
export function AvatarSlot() {
  return (
    <div
      className="h-[110px] w-[110px] shrink-0"
      data-slot="interactive-avatar"
      aria-hidden="true"
    />
  );
}
