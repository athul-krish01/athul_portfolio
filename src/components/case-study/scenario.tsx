import type { ReactNode } from "react";
import Image from "next/image";
import { hirebit } from "@/data/case-studies/hirebit";

/**
 * Section 01, told as a sequence of moments: three things that went wrong
 * over the weekend, then Monday morning, when the dashboard shows none of
 * them. Each moment pairs a line illustration with one line of narrative.
 *
 * The illustrations are drawn in the site's ink with one amber accent (the
 * case study's "problem" colour). Any of them can be swapped for a drawn
 * illustration by setting that moment's `src` in the data file.
 */

const INK = "var(--color-ink)";
const FAINT = "#d4d4d4";
const WARM = "var(--color-warm)";
const WARM_SOFT = "var(--color-warm-soft)";
const line = { stroke: INK, strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };

/** A deadline circled on the calendar, and the days that have run past it. */
function DeadlineArt() {
  const cols = 7;
  const deadline = 9; // index of the circled day
  return (
    <svg viewBox="0 0 320 240" className="size-full">
      <rect x="62" y="44" width="196" height="160" rx="14" {...line} fill="#fff" />
      <path d="M62 82h196" {...line} />
      <rect x="104" y="32" width="10" height="24" rx="5" {...line} fill="#fff" />
      <rect x="206" y="32" width="10" height="24" rx="5" {...line} fill="#fff" />
      <text x="80" y="69" className="font-mono" fontSize="11" letterSpacing="1.5" fill={INK}>
        ACME
      </text>
      {Array.from({ length: 21 }, (_, i) => {
        const x = 86 + (i % cols) * 25;
        const y = 104 + Math.floor(i / cols) * 32;
        if (i === deadline) return <circle key={i} cx={x} cy={y} r="12" {...line} />;
        if (i > deadline && i <= deadline + 9)
          return <path key={i} d={`M${x - 4} ${y - 4}l8 8m0-8l-8 8`} stroke={WARM} strokeWidth="1.75" strokeLinecap="round" />;
        return <circle key={i} cx={x} cy={y} r="2.5" fill={FAINT} />;
      })}
      {/* The arrow slipping past the circled day */}
      <path d="M104 132c20-26 60-26 96-8" {...line} strokeDasharray="4 5" />
      <path d="M194 116l7 8-10 3" {...line} />
      <rect x="184" y="186" width="98" height="28" rx="14" fill={WARM_SOFT} stroke={WARM} strokeWidth="1.25" />
      <text x="233" y="204.5" textAnchor="middle" fontSize="12" fontWeight="500" fill={WARM}>
        9 days late
      </text>
    </svg>
  );
}

/** Messages sent, nothing back: the reply bubble is still empty. */
function CandidateArt() {
  return (
    <svg viewBox="0 0 320 240" className="size-full">
      <rect x="66" y="26" width="188" height="190" rx="18" {...line} fill="#fff" />
      <circle cx="94" cy="56" r="12" {...line} fill="#fff" />
      <path d="M88 64c1.5-4 10.5-4 12 0" {...line} strokeWidth="1.25" />
      <circle cx="94" cy="53" r="3.5" {...line} strokeWidth="1.25" />
      <circle cx="104" cy="66" r="4" fill={FAINT} stroke="#fff" strokeWidth="2" />
      <rect x="114" y="50" width="64" height="6" rx="3" fill={INK} opacity="0.85" />
      <rect x="114" y="61" width="38" height="5" rx="2.5" fill={FAINT} />
      <path d="M66 82h188" {...line} strokeWidth="1.25" opacity="0.4" />
      {[
        { y: 96, w: 104 },
        { y: 126, w: 82 },
        { y: 156, w: 116 },
      ].map(({ y, w }) => (
        <g key={y}>
          <rect x={236 - w} y={y} width={w} height="22" rx="11" fill="var(--color-accent-soft)" stroke="var(--color-accent)" strokeWidth="1.25" />
          <rect x={248 - w} y={y + 9} width={w - 34} height="4" rx="2" fill="var(--color-accent)" opacity="0.45" />
        </g>
      ))}
      {/* The reply that never came */}
      <rect x="84" y="186" width="58" height="20" rx="10" fill="none" stroke={INK} strokeWidth="1.25" strokeDasharray="3 4" opacity="0.45" />
      {[100, 113, 126].map((cx) => (
        <circle key={cx} cx={cx} cy="196" r="2.25" fill={FAINT} />
      ))}
      <text x="262" y="44" fontSize="14" fontWeight="500" fill={WARM}>
        z
      </text>
      <text x="272" y="32" fontSize="11" fontWeight="500" fill={WARM} opacity="0.7">
        z
      </text>
    </svg>
  );
}

/** A recruiter behind a tipping pile of work, load past the 100% line. */
function RecruiterArt() {
  const pile = [
    { y: 168, r: 0 },
    { y: 152, r: -3 },
    { y: 136, r: 2 },
    { y: 120, r: -2 },
    { y: 104, r: 4 },
    { y: 88, r: -5 },
    { y: 72, r: 7 },
  ];
  return (
    <svg viewBox="0 0 320 240" className="size-full">
      <circle cx="96" cy="96" r="22" {...line} fill="#fff" />
      <path d="M86 92h.01M106 92h.01" {...line} strokeWidth="3" />
      <path d="M89 106c4-3 10-3 14 0" {...line} strokeWidth="1.5" />
      <path d="M120 74c3 4 3 8 0 10-3-2-3-6 0-10z" fill="var(--color-accent-soft)" stroke="var(--color-accent)" strokeWidth="1.25" />
      <path d="M52 186c0-36 18-58 44-58s44 22 44 58" {...line} fill="#fff" />
      {pile.map(({ y, r }, i) => (
        <rect
          key={y}
          x="166"
          y={y}
          width="92"
          height="16"
          rx="4"
          {...line}
          fill={i % 2 ? "#fff" : WARM_SOFT}
          strokeWidth="1.5"
          transform={`rotate(${r} 212 ${y + 8})`}
        />
      ))}
      <path d="M40 186h240" {...line} />
      {/* Load against the 100% line */}
      <rect x="62" y="204" width="196" height="10" rx="5" fill="#fff" stroke={FAINT} strokeWidth="1.25" />
      <rect x="62" y="204" width="186" height="10" rx="5" fill={WARM} />
      <path d="M220 198v22" stroke={INK} strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="224" y="232" fontSize="10" className="font-mono" fill={INK}>
        100%
      </text>
    </svg>
  );
}

/** Monday: a wall of equal numbers, a donut, a revenue table, and coffee. */
function DashboardArt() {
  const tiles = Array.from({ length: 8 }, (_, i) => ({ x: 58 + (i % 4) * 94, y: 74 + Math.floor(i / 4) * 56 }));
  return (
    <svg viewBox="0 0 480 330" className="size-full">
      <rect x="40" y="30" width="400" height="262" rx="16" {...line} fill="#fff" />
      <path d="M40 58h400" {...line} strokeWidth="1.25" />
      {[58, 72, 86].map((cx) => (
        <circle key={cx} cx={cx} cy="44" r="4" fill={FAINT} />
      ))}
      {tiles.map(({ x, y }, i) => (
        <g key={i}>
          <rect x={x} y={y} width="82" height="46" rx="8" fill="#fff" stroke={FAINT} strokeWidth="1.25" />
          <rect x={x + 10} y={y + 10} width="34" height="4" rx="2" fill={FAINT} />
          {i < 2 ? (
            <text x={x + 10} y={y + 36} fontSize="16" fontWeight="600" fill={INK}>
              {i === 0 ? "60" : "12"}
            </text>
          ) : (
            <rect x={x + 10} y={y + 24} width={22 + ((i * 7) % 18)} height="10" rx="3" fill={INK} opacity="0.75" />
          )}
        </g>
      ))}
      {/* Donut chart */}
      <g transform="rotate(-90 106 230)">
        <circle cx="106" cy="230" r="30" fill="none" stroke={FAINT} strokeWidth="12" />
        <circle cx="106" cy="230" r="30" fill="none" stroke={INK} strokeWidth="12" strokeDasharray="70 189" opacity="0.8" />
        <circle cx="106" cy="230" r="30" fill="none" stroke="#9a9a9a" strokeWidth="12" strokeDasharray="44 189" strokeDashoffset="-74" />
      </g>
      {/* Revenue table */}
      <rect x="162" y="190" width="258" height="84" rx="8" fill="#fff" stroke={FAINT} strokeWidth="1.25" />
      <text x="174" y="207" fontSize="10" className="font-mono" letterSpacing="1" fill={INK} opacity="0.7">
        REVENUE
      </text>
      {[222, 240, 258].map((y, i) => (
        <g key={y}>
          <rect x="174" y={y - 4} width={70 - i * 10} height="5" rx="2.5" fill={FAINT} />
          <rect x="330" y={y - 4} width={56 + i * 8} height="5" rx="2.5" fill={INK} opacity="0.7" />
        </g>
      ))}
      {/* Coffee, set down in front of the screen */}
      <path d="M392 262h50v34a14 14 0 0 1-14 14h-22a14 14 0 0 1-14-14z" {...line} fill="#fff" />
      <path d="M442 270h6a9 9 0 0 1 0 18h-6" {...line} />
      <path d="M406 252c-4-6 4-8 0-14M420 252c-4-6 4-8 0-14" {...line} strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

const weekendArt = { deadline: DeadlineArt, candidate: CandidateArt, recruiter: RecruiterArt } as const;

function Art({ src, alt, children }: { src: string | null; alt: string; children: ReactNode }) {
  return src ? <Image src={src} alt={alt} fill sizes="(min-width: 980px) 480px, 100vw" className="object-contain p-5 sm:p-6" unoptimized /> : <>{children}</>;
}

export function Scenario() {
  const { weekendLead, weekend, open } = hirebit.monday;

  return (
    <div className="flex flex-col gap-6">
      {/* Over the weekend: three moments in sequence */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <p className="font-mono text-[12px] uppercase leading-4 tracking-[0.08em] text-muted">{weekendLead}</p>
          <span aria-hidden="true" className="h-px flex-1 bg-stroke" />
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {weekend.map((moment, i) => {
            const Drawing = weekendArt[moment.id as keyof typeof weekendArt];
            return (
              <li key={moment.id} className="grid grid-cols-2 overflow-hidden rounded-card border border-stroke bg-surface md:flex md:flex-col">
                <div aria-hidden={!moment.src} className="relative aspect-[4/3] border-r border-stroke bg-[#fafafa] md:border-b md:border-r-0">
                  <Art src={moment.src} alt={moment.text}>
                    <Drawing />
                  </Art>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-2 p-4 sm:p-5 md:justify-start">
                  <span className="font-mono text-[13px] leading-4 tabular-nums text-muted">{String(i + 1).padStart(2, "0")}.</span>
                  <p className="text-[18px] font-medium leading-[1.35] tracking-[-0.02em] text-ink">{moment.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Monday, 8:02 AM: the dashboard shows none of it */}
      <div className="grid overflow-hidden rounded-card border border-stroke bg-surface md:grid-cols-[1.15fr_1fr] md:items-center">
        <div aria-hidden={!open.src} className="relative aspect-[48/33] border-b border-stroke bg-[#fafafa] md:border-b-0 md:border-r">
          <Art src={open.src} alt={`${open.title} ${open.text}`}>
            <DashboardArt />
          </Art>
        </div>
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-badge border border-stroke px-2.5 py-1 font-mono text-[12px] leading-4 tracking-[0.04em] text-ink">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
            Monday · 8:02 AM
          </span>
          <p className="text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-medium leading-[1.15] tracking-[-0.03em] text-ink">{open.title}</p>
          <p className="text-body leading-[1.6] text-muted">{open.text}</p>
        </div>
      </div>
    </div>
  );
}
