import { hirebit } from "@/data/case-studies/hirebit";
import { Stage } from "@/components/case-study/diagrams";
import { cn } from "@/lib/cn";

/**
 * Card treatments for sections 07 and 08. Trade-offs are notes pinned up
 * (each a choice: what was kept, over what); How I worked is a bento of
 * working principles, each with a small visual of its own sentence.
 */

/* ---------- 07 · Trade-offs ---------- */

const noteTilt = ["md:-rotate-[1.6deg]", "md:rotate-[0.6deg]", "md:rotate-[1.4deg]"];

/** "Trust over speed." → kept "Trust", given up "speed". */
function TradeoffTitle({ title }: { title: string }) {
  const clean = title.replace(/\.$/, "");
  const [kept, over] = clean.split(" over ");
  if (!over) return <>{title}</>;
  return (
    <>
      {kept} <span className="text-[#7a6420]">over</span>{" "}
      <span className="text-[#7a6420] line-through decoration-warm/60 decoration-[1.5px]">{over}</span>.
    </>
  );
}

export function TradeoffNotes() {
  const { items } = hirebit.tradeoffs;
  return (
    <ol className="grid gap-6 pt-3 md:grid-cols-3 md:gap-7">
      {items.map((item, i) => (
        <li
          key={item.title}
          className={cn(
            "relative flex flex-col gap-4 rounded-[14px] border border-[#ecd98a] bg-[#fcefb4] px-6 pb-7 pt-8",
            "shadow-[0_14px_24px_-16px_rgba(120,90,10,0.45),0_1px_2px_rgba(120,90,10,0.08)]",
            "motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:rotate-0",
            noteTilt[i % noteTilt.length],
          )}
        >
          {/* Tape */}
          <span
            aria-hidden="true"
            className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-2 rounded-[3px] border border-[#e4d9b4] bg-[#f4ecd2]/90 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
          />
          <span className="font-mono text-[12px] uppercase leading-4 tracking-[0.08em] text-[#7a6420]">Trade-off {String(i + 1).padStart(2, "0")}</span>
          <h3 className="text-[clamp(1.25rem,1.1rem+0.5vw,1.5rem)] font-medium leading-[1.2] tracking-[-0.03em] text-ink">
            <TradeoffTitle title={item.title} />
          </h3>
          <p className="text-[16px] leading-[1.6] text-[#6e5a1c]">{item.text}</p>
        </li>
      ))}
    </ol>
  );
}

/* ---------- 08 · How I worked ---------- */

/** "Five directions, one structure": the same wireframe in five styles, fanned out. */
function FiveDirections() {
  const styles = [
    "rounded-[4px] bg-surface",
    "rounded-[8px] bg-accent-soft",
    "rounded-[2px] bg-[#1f1f1f] [&_i]:bg-white/30",
    "rounded-[10px] bg-warm-soft",
    "rounded-[6px] bg-success-soft",
  ];
  const fan = ["-rotate-[14deg] -translate-x-[150%] translate-y-3", "-rotate-[7deg] -translate-x-[78%] translate-y-1", "", "rotate-[7deg] translate-x-[78%] translate-y-1", "rotate-[14deg] translate-x-[150%] translate-y-3"];
  return (
    <div aria-hidden="true" className="flex flex-col items-center gap-5 py-8">
      <div className="relative h-[124px] w-24">
        {styles.map((s, i) => (
          <span
            key={i}
            className={cn(
              "absolute inset-0 flex flex-col gap-1.5 border border-stroke p-2 shadow-[0_8px_18px_-10px_rgba(12,12,13,0.35)]",
              "motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out",
              s,
              fan[i],
              i === 2 && "z-10",
            )}
          >
            <i className="h-1.5 w-3/5 rounded-full bg-ink/20" />
            <i className="h-[30%] rounded-[3px] bg-ink/10" />
            <span className="grid flex-1 grid-cols-2 gap-1.5">
              <i className="rounded-[3px] bg-ink/10" />
              <i className="rounded-[3px] bg-ink/10" />
            </span>
          </span>
        ))}
      </div>
      <span className="font-mono text-[11px] uppercase leading-4 tracking-[0.08em] text-ink/60">5 directions · 1 structure</span>
    </div>
  );
}

/** "₹8.4L is ₹19.2L of flagged fees, weighted at about 44%." */
function Equation() {
  return (
    <div aria-hidden="true" className="flex w-full max-w-[260px] flex-col gap-1.5 rounded-[12px] border border-stroke bg-surface p-3 font-mono text-[13px] leading-5 text-ink shadow-[0_10px_22px_-14px_rgba(12,12,13,0.3)]">
      <span className="flex justify-between">
        <span className="text-muted">Flagged fees</span>
        <span className="text-warm">₹19.2L</span>
      </span>
      <span className="flex justify-between">
        <span className="text-muted">× weight</span>
        <span>~44%</span>
      </span>
      <span className="mt-1 flex justify-between border-t border-dashed border-stroke pt-2 font-medium">
        <span>≈ at stake</span>
        <span className="text-accent">₹8.4L</span>
      </span>
    </div>
  );
}

/** "One action updates the Brief, the list and the team view together." */
function OneAction() {
  return (
    <div aria-hidden="true" className="flex items-center">
      <span className="shrink-0 rounded-badge bg-nav-mark px-3 py-1.5 font-mono text-[12px] leading-4 text-primary-fg shadow-sm">1 action</span>
      <svg width="44" height="84" viewBox="0 0 44 84" className="shrink-0 text-success" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M0 42h10c8 0 8-30 18-30h16M10 42h34M10 42c8 0 8 30 18 30h16" />
      </svg>
      <span className="flex flex-col gap-2">
        {["The Brief", "The list", "The team view"].map((t) => (
          <span key={t} className="flex w-fit items-center gap-1.5 rounded-badge border border-success-line bg-surface px-2.5 py-1 font-mono text-[12px] leading-4 text-success shadow-sm">
            <span className="size-1.5 rounded-full bg-success" />
            {t}
          </span>
        ))}
      </span>
    </div>
  );
}

const principles = [
  {
    tone: "accent" as const,
    icon: (
      <>
        <circle cx="6" cy="5" r="2" />
        <circle cx="18" cy="5" r="2" />
        <circle cx="12" cy="19" r="2" />
        <path d="M6 7v2a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V7M12 13v4" />
      </>
    ),
    visual: <FiveDirections />,
  },
  {
    tone: "warm" as const,
    icon: (
      <>
        <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
    visual: <Equation />,
  },
  {
    tone: "success" as const,
    icon: <path d="M6 3l12 9-5 1.5L16 20l-2.5 1-3-6.5L6 18z" />,
    visual: <OneAction />,
  },
];

const iconTone = {
  accent: "text-accent bg-accent-soft border-accent-line",
  warm: "text-warm bg-warm-soft border-warm-line",
  success: "text-success bg-success-soft border-success-line",
};

/**
 * White cards, each with a tinted canvas stage for its visual. The first
 * principle spans the row with its stage beside the text; the other two
 * sit below, stage on top.
 */
export function ProcessBento() {
  const { items } = hirebit.process;
  return (
    <ol className="grid gap-4 md:grid-cols-2">
      {items.map((item, i) => {
        const p = principles[i];
        const wide = i === 0;
        return (
          <li
            key={item.title}
            className={cn(
              "group flex flex-col gap-3 rounded-[24px] border border-stroke bg-surface p-3 shadow-[0_16px_32px_-26px_rgba(12,12,13,0.4)]",
              wide && "md:col-span-2 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-center md:gap-4",
            )}
          >
            <Stage tone={p.tone} className={cn("min-h-44", wide && "md:order-2 md:min-h-60")}>
              {p.visual}
            </Stage>
            <div className={cn("flex flex-col gap-3 px-3 pb-3 pt-1", wide && "md:px-5 md:py-4")}>
              <span className={cn("flex size-10 items-center justify-center rounded-[12px] border", iconTone[p.tone])}>
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {p.icon}
                </svg>
              </span>
              <h3 className="font-mono text-[15px] font-medium uppercase leading-[1.4] tracking-[0.02em] text-ink">{item.title.replace(/\.$/, "")}</h3>
              <p className="text-[16px] leading-[1.6] text-muted">{item.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
