import type { ReactNode } from "react";
import { hirebit } from "@/data/case-studies/hirebit";
import { canvasDots } from "@/components/case-study/diagrams";
import { cn } from "@/lib/cn";

/**
 * Section 02's critique, under "It showed everything, so nothing stood out."
 * A FigJam board: the three hindsight critiques as stickies, and under them
 * the three findings the 2023 interviews pointed to.
 */

type Point = { title: string; text: string };

/** A title ending in a comma runs on into its text as one sentence. */
const runsOn = (p: Point) => p.title.endsWith(",");

const tilts = ["-rotate-[1.4deg]", "rotate-[1deg]", "-rotate-[0.6deg]"];

/** A FigJam section label: the dark tab with a colour swatch. */
function BoardTab({ swatch, children }: { swatch: string; children: ReactNode }) {
  return (
    <p className="inline-flex w-fit items-center gap-2 rounded-[6px] bg-nav-mark px-2.5 py-1 text-[13px] font-medium leading-4 text-primary-fg">
      <span aria-hidden="true" className={cn("size-2 rounded-[2px]", swatch)} />
      {children}
    </p>
  );
}

export function CritiqueBoard() {
  const { points, noteLead, interviews } = hirebit.problem;
  const cut = noteLead.indexOf(". ") + 1;
  const hindsight = noteLead.slice(0, cut).replace(/\.$/, "");
  const evidence = noteLead.slice(cut + 1).replace(/:$/, "");
  const sticky =
    "rounded-[4px] p-4 text-ink shadow-[0_10px_18px_-10px_rgba(12,12,13,0.35),0_1px_2px_rgba(12,12,13,0.08)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:rotate-0";
  return (
    <div className={cn("relative flex flex-col rounded-card border border-stroke p-5 sm:p-8", canvasDots)}>
      <section aria-label={hindsight} className="flex flex-col gap-5">
        <BoardTab swatch="bg-[#ffd84d]">{hindsight}</BoardTab>
        <ul className="grid gap-5 sm:grid-cols-3">
          {points.map((p, i) => (
            <li key={p.title} className={cn(sticky, "flex min-h-[150px] flex-col gap-2 bg-[#fff1b3]", tilts[i % tilts.length])}>
              <p className="text-[16px] font-semibold leading-[1.4]">
                {p.title}
                {runsOn(p) ? <span className="font-normal"> {p.text}</span> : null}
              </p>
              {runsOn(p) ? null : <p className="text-[15px] leading-[1.5] text-ink/75">{p.text}</p>}
            </li>
          ))}
        </ul>
      </section>

      {/* Connector: the critique, backed by the interviews */}
      <span aria-hidden="true" className="ml-8 flex h-12 flex-col items-center self-start">
        <span className="w-px flex-1 border-l-2 border-dashed border-ink/30" />
        <svg width="12" height="10" viewBox="0 0 12 10" className="-mt-0.5 text-ink/40">
          <path d="M1 1.5l5 6 5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      <section aria-label={evidence} className="flex flex-col gap-5">
        <BoardTab swatch="bg-[#7aa2ff]">{evidence}</BoardTab>
        <ul className="grid gap-5 sm:grid-cols-3">
          {interviews.map((finding, i) => (
            <li key={finding} className={cn(sticky, "bg-[#dce7ff] text-[16px] font-medium leading-[1.4]", tilts[(i + 1) % tilts.length])}>
              {finding}
            </li>
          ))}
        </ul>
      </section>

      {/* A collaborator's cursor, parked on the board */}
      <span aria-hidden="true" className="absolute bottom-3 right-4 flex items-start">
        <svg width="18" height="18" viewBox="0 0 18 18" className="text-accent drop-shadow-sm">
          <path d="M2 1.5l13 6.2-5.6 1.6L7 15z" fill="currentColor" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
        <span className="mt-3.5 rounded-badge bg-accent px-2 py-0.5 text-[12px] font-medium leading-4 text-white">Athul</span>
      </span>
    </div>
  );
}
