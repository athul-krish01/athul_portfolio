"use client";

import { Mascot } from "page-mascot";

/**
 * ============================================================
 *  AVATAR SLOT — INTERACTIVE MASCOT
 * ============================================================
 *
 * The reserved avatar frame, filled by the `page-mascot` component. It keeps
 * its exact layout footprint — 110x110, matching Figma node 1:66 ("Frame 27")
 * at column-relative x=40, y=160 — so the Hero below it does not shift. The
 * mascot is taken out of flow and anchored to the frame, so nothing it does
 * can move the page.
 *
 * All cursor tracking, direction swapping and click reactions belong to the
 * package: it owns the pointermove/scroll listeners, the eight-way sector
 * mapping with hysteresis, the centre dead zone and the squash animation.
 * Nothing here re-implements any of that.
 *
 * The sheets are the skill's BUILT atlases, not the raw generated art. The
 * raw 3x3 sheets are drawn per-cell with no shared registration: measured at
 * this render size their body slid 27px horizontally and 12px vertically
 * between directions, which is what made the mascot wobble and look like it
 * was rotating off its base. `scripts/build.py --anchor body` pins every cell
 * on the lower body — the part that is meant to hold still while the head
 * turns — and bakes in the bottom fade that dissolves the bust instead of
 * cutting it off square. Sources live in `characters/athul/`; see README.
 *
 * Sizing — the built tile is 360px with the character's feet at 0.93 down it,
 * and the drawn character spans 0.581 of the tile's width. size=168 therefore
 * renders it 97.6px wide, matching the 98.46px the source file reserves.
 *
 * Placement — centred on the frame horizontally (a 168 box on a 110 frame
 * overhangs 29px per side) and dropped 14px below it, which lands the top of
 * the hair on the same line it sat on before the rebuild. The frame does not
 * clip, which is what lets that overflow read correctly.
 */
const MASCOT_SIZE = 168;

export function AvatarSlot() {
  return (
    <div
      className="relative h-[110px] w-[110px] shrink-0"
      data-slot="interactive-avatar"
    >
      {/*
        The button carries `position: relative` as an inline style, so it can
        only be positioned from a wrapper — a className would lose to it.
      */}
      <span className="absolute bottom-[-14px] left-1/2 block -translate-x-1/2">
        <Mascot
          directions="/mascots/athul-directions.webp"
          reactions="/mascots/athul-reactions.webp"
          size={MASCOT_SIZE}
          label="Athul mascot"
        />
      </span>
    </div>
  );
}
