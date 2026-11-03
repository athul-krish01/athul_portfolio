import type { ReactNode } from "react";
import { hirebit } from "@/data/case-studies/hirebit";
import { cn } from "@/lib/cn";

/**
 * Decision 2, drawn as a diagram rather than a UI mock: the three groups as
 * lanes, with each overdue role in the lane it actually belongs to, and a
 * dashed rule showing what a lateness sort would have done instead.
 */

const t = hirebit.decisions.triage;
const [NEEDS, AT_RISK, ON_TRACK] = t.groups;

/** Small mono label, the diagram's only heading style. */
function Label({ tone, children }: { tone: "warm" | "accent" | "muted"; children: ReactNode }) {
  const color = { warm: "text-warm", accent: "text-accent", muted: "text-muted" }[tone];
  return <p className={cn("font-mono text-[11px] uppercase leading-4 tracking-[0.08em]", color)}>{children}</p>;
}

function Dot({ tone }: { tone: "warm" | "accent" | "success" }) {
  const bg = { warm: "bg-warm", accent: "bg-accent", success: "bg-success" }[tone];
  return <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", bg)} />;
}

const caption = `Sorted by how late, both ${t.acme.role} and ${t.ux.role} land on the manager’s list. Ranked by who must act, ${t.acme.role} is in ${NEEDS} and ${t.ux.role} stays in ${AT_RISK}.`;

export function TriageDiagram() {
  const lanes = [
    { name: NEEDS, tone: "warm" as const, role: t.acme.role, why: "only you can act" },
    { name: AT_RISK, tone: "accent" as const, role: t.ux.role, why: "the recruiter’s job" },
    { name: ON_TRACK, tone: "success" as const, role: null, why: null },
  ];
  return (
    <figure className="flex flex-col gap-3 rounded-card border border-stroke px-5 py-4 sm:px-6">
      <figcaption className="sr-only">{caption}</figcaption>
      {/* What a lateness sort would have done: everything into lane 1 */}
      <div aria-hidden="true" className="flex items-center gap-3">
        <Label tone="warm">{t.lateness.title}</Label>
        <span className="h-px flex-1 border-t border-dashed border-warm-line" />
        <span className="text-[13px] leading-5 text-warm">both roles → yours</span>
      </div>
      <div aria-hidden="true" className="grid gap-3 sm:grid-cols-3">
        {lanes.map((lane) => (
          <div key={lane.name} className="flex flex-col gap-2 border-t-2 pt-2.5" style={{ borderColor: `var(--color-${lane.tone}-line)` }}>
            <span className="flex items-center gap-1.5 text-[13px] font-medium leading-5 text-ink">
              <Dot tone={lane.tone} />
              {lane.name}
            </span>
            {lane.role ? (
              <span className="flex flex-col">
                <span className="text-[15px] font-medium leading-5 text-ink">{lane.role}</span>
                <span className="text-[13px] leading-5 text-muted">{lane.why}</span>
              </span>
            ) : (
              <span className="text-[13px] leading-5 text-muted/60">nothing to do</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 border-t border-stroke pt-2.5">
        <Label tone="accent">{t.ranked.title}</Label>
        <span className="text-[13px] leading-5 text-muted">{t.ranked.note}</span>
      </div>
    </figure>
  );
}
