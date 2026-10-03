"use client";

import { Mascot } from "page-mascot";

/**
 * ============================================================
 *  AVATAR SLOT — INTERACTIVE MASCOT
 * ============================================================
 *
 * The reserved avatar frame, now filled by the `page-mascot` component. It
 * keeps its exact layout footprint — 110x110, matching Figma node 1:66
 * ("Frame 27") at column-relative x=40, y=160 — so the Hero below it does not
 * shift. The mascot itself is taken out of flow and anchored to the frame, so
 * nothing it does can move the page.
 *
 * All cursor tracking, direction swapping and click reactions belong to the
 * package: it owns the pointermove/scroll listeners, the eight-way sector
 * mapping with hysteresis, the centre dead zone and the squash animation.
 * Nothing here re-implements any of that.
 *
 * Sizing — the two sheets are 3x3 sprite atlases, and the drawn character
 * does not fill its cell: measured on the centre cell it spans 0.703 of the
 * cell's width and 0.900 of its height. At size=140 that puts the artwork at
 * 98.4x126, matching the 98.46px width the source file reserves for it.
 *
 * Placement — the mascot is centred on the frame horizontally (a 140 box on a
 * 110 frame overhangs 15px per side) and sits on the frame's bottom edge, so
 * the shoulders rest on the baseline and only the hair breaks the top. The
 * -7px accounts for the empty strip below the artwork inside its own cell.
 * The frame does not clip, which is what lets that overflow read correctly.
 */
const MASCOT_SIZE = 140;

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
      <span className="absolute bottom-[-7px] left-1/2 block -translate-x-1/2">
        <Mascot
          directions="/mascots/athul/directions.png"
          reactions="/mascots/athul/reactions.png"
          size={MASCOT_SIZE}
          label="Athul mascot"
        />
      </span>
    </div>
  );
}
