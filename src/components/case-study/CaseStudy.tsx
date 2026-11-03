import type { ReactNode } from "react";
import { ContactCta } from "@/components/sections/ContactCta";
import { SectionDivider } from "@/components/layout/SectionDivider";
import { galleryOrder, hirebit, sections, type Visual } from "@/data/case-studies/hirebit";
import { ArrowRight, BackLink, Rich, prose, type Tone } from "@/components/case-study/primitives";
import { MoreWork } from "@/components/case-study/MoreWork";
import { SectionNav } from "@/components/case-study/SectionNav";
import { Figure, LightboxProvider } from "@/components/case-study/Lightbox";
import { Scenario } from "@/components/case-study/scenario";
import { ProcessBento, TradeoffNotes } from "@/components/case-study/cards";
import { CritiqueBoard } from "@/components/case-study/critique";
import { Steps } from "@/components/case-study/diagrams";
import { TriageDiagram } from "@/components/case-study/triage";
import { cn } from "@/lib/cn";

/**
 * The Hirebit case study. Reading pattern per section, after the reference
 * case studies: a small label, the heading, the point in a line, then the
 * visual, then the detail. Colour keeps one meaning throughout: amber =
 * 2023 / the problem, blue = 2026 / decisions, green = results.
 */

/**
 * Decorative rules (section separators, the facts table's edges) are drawn
 * as pseudo-elements rather than borders, so they can bleed past the
 * article's 40px inset and meet the 980px column lines while the content
 * inside stays inset. The striped bands use the matching `-mx-10`.
 */
const RULE_TOP =
  "relative before:absolute before:top-0 before:h-px before:bg-stroke before:inset-x-0 frame:before:-inset-x-6 lg:before:-inset-x-16";
const RULE_BOTTOM =
  "after:absolute after:bottom-0 after:h-px after:bg-stroke after:inset-x-0 frame:after:-inset-x-6 lg:after:-inset-x-16";
// The band carries an explicit width, so it needs the matching width bump
// as well as the negative margin.
const BAND_BLEED = "frame:-mx-6 frame:w-[calc(100%+48px)] lg:-mx-16 lg:w-[calc(100%+128px)]";

/** Deep links land below the navbar and the sticky tabs; inline so it beats
    the global `:target` scroll margin in globals.css. */
const landBelowNav = { scrollMarginTop: "calc(var(--layout-nav-reserve) + 80px)" };

/** The reference's small mono label above a heading. */
function Eyebrow({ children, tone = "accent", className }: { children: ReactNode; tone?: "accent" | "muted"; className?: string }) {
  return (
    <p className={cn("font-mono text-[12px] uppercase leading-4 tracking-[0.08em]", tone === "accent" ? "text-accent" : "text-muted", className)}>
      {children}
    </p>
  );
}

function Section({
  id,
  eyebrow,
  title,
  lede,
  first,
  roomy,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede?: string;
  /** The first section sits right under the cover, with no rule above it. */
  first?: boolean;
  /** More air between blocks, for sections made of several sub-parts. */
  roomy?: boolean;
  children: ReactNode;
}) {
  const n = sections.findIndex((s) => s.id === id) + 1;
  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
      style={landBelowNav}
      className={cn(
        "flex flex-col outline-none",
        first ? "mt-10" : cn("mt-[60px] pt-[60px]", RULE_TOP),
        roomy ? "gap-14" : "gap-8",
      )}
    >
      <div className="flex flex-col gap-3">
        <Eyebrow>
          {String(n).padStart(2, "0")} · {eyebrow}
        </Eyebrow>
        <h2 id={`${id}-title`} className="max-w-[26ch] text-balance text-section-heading text-ink">
          {title}
        </h2>
        {lede ? (
          <p className={cn(prose, "mt-1")}>
            <Rich text={lede} />
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/** A line a scanner should not miss: large, set against a rule. */
function Statement({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("max-w-[32ch] text-[clamp(1.5rem,1.15rem+1.2vw,2.125rem)] font-medium leading-[1.2] tracking-[-0.03em] text-ink", className)}>
      {children}
    </p>
  );
}

/** The source's `> *quote*` lines: the takeaway of a decision. */
function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-l-2 border-accent py-1 pl-5">
      <p className="max-w-[40ch] text-card-title text-ink">{children}</p>
    </blockquote>
  );
}

/** A stage of Decision 1: numbered marker on the rail, label, heading. */
function StageHead({ n, label, heading, tone }: { n: number; label: string; heading: string; tone: Tone }) {
  const marker: Record<Tone, string> = {
    neutral: "bg-surface text-ink border border-stroke-strong/25",
    accent: "bg-accent text-white",
    warm: "bg-warm text-white",
    success: "bg-success text-white",
  };
  const text: Record<Tone, string> = { neutral: "text-muted", accent: "text-accent", warm: "text-warm", success: "text-success" };
  return (
    <div className="relative flex flex-col gap-1">
      <span
        aria-hidden="true"
        className={cn("absolute -left-12 top-0.5 flex size-8 items-center justify-center rounded-full text-[14px] font-semibold tabular-nums ring-4 ring-surface", marker[tone])}
      >
        {n}
      </span>
      <span className={cn("font-mono text-[12px] uppercase leading-4 tracking-[0.08em]", text[tone])}>{label}</span>
      <h4 className="text-[clamp(1.125rem,1.05rem+0.3vw,1.25rem)] font-medium leading-[1.3] tracking-[-0.02em] text-ink">{heading}</h4>
    </div>
  );
}

/**
 * Decision 1's two iterations as one reading flow, in three headed stages
 * on a rail: Iteration 1, what changed, Final design. No controls; the
 * reader just scrolls.
 */
function IterationFlow({
  iterations,
  changes,
  changesHeading,
}: {
  iterations: { label: string; heading: string; visual: Visual; text: string }[];
  changes: { before: string; after: string }[];
  changesHeading: string;
}) {
  const [first, final] = iterations;
  const stage = "relative flex flex-col gap-5 pb-12 pl-12 last:pb-0";
  const rail = "absolute bottom-0 left-[15px] top-10 w-px [li:last-child_&]:hidden";
  return (
    <ol className="flex flex-col pt-2">
      <li className={stage}>
        <span aria-hidden="true" className={cn(rail, "bg-[linear-gradient(var(--color-warm-line),var(--color-stroke))]")} />
        <StageHead n={1} label={first.label} heading={first.heading} tone="warm" />
        <Figure visual={first.visual} caption={false} sizes="(min-width: 980px) 860px, 100vw" />
        <p className={prose}>
          <Rich text={first.text} />
        </p>
      </li>

      <li className={stage}>
        <span aria-hidden="true" className={cn(rail, "bg-[linear-gradient(var(--color-stroke),var(--color-accent-line))]")} />
        <StageHead n={2} label="What changed" heading={changesHeading} tone="neutral" />
        <div className="overflow-hidden rounded-card border border-stroke">
          <div aria-hidden="true" className="hidden grid-cols-[minmax(0,1fr)_40px_minmax(0,1fr)] border-b border-stroke bg-[#fafafa] sm:grid">
            <span className="px-5 py-2.5 font-mono text-[12px] uppercase leading-4 tracking-[0.08em] text-warm">{first.label}</span>
            <span />
            <span className="px-5 py-2.5 font-mono text-[12px] uppercase leading-4 tracking-[0.08em] text-accent">{final.label}</span>
          </div>
          <ul className="flex flex-col">
            {changes.map((c) => (
              <li
                key={c.before}
                className="grid items-center gap-2 border-t border-stroke px-5 py-4 first:border-t-0 sm:grid-cols-[minmax(0,1fr)_40px_minmax(0,1fr)] sm:gap-0 sm:px-0 sm:py-0"
              >
                <span className="text-[15px] leading-[1.5] text-muted sm:px-5 sm:py-4">{c.before}</span>
                <ArrowRight className="rotate-90 text-accent sm:mx-auto sm:rotate-0" />
                <span className="text-[15px] font-medium leading-[1.5] text-ink sm:border-l sm:border-accent-line sm:bg-accent-soft/40 sm:px-5 sm:py-4 sm:self-stretch">
                  {c.after}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </li>

      <li className={stage}>
        <StageHead n={3} label={final.label} heading={final.heading} tone="accent" />
        <Figure visual={final.visual} caption={false} sizes="(min-width: 980px) 860px, 100vw" />
        <p className={prose}>
          <Rich text={final.text} />
        </p>
      </li>
    </ol>
  );
}

function Check() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="mt-1 shrink-0 text-success">
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.12" />
      <path d="M6 10.2l2.6 2.6L14 7.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-[14px] font-semibold tabular-nums text-white">
      {n}
    </span>
  );
}

/**
 * The prototype walkthrough: a real recording with sound, so it plays with
 * native controls rather than Figure's muted autoplaying loop or its
 * click-to-zoom button (which would fight the video's own scrubber for
 * clicks). Same frame and caption style as every other figure in the page.
 */
function ProtoVideo({ visual }: { visual: Visual }) {
  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="flex items-center gap-1.5 text-[13px] leading-5 text-muted">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0 text-muted/80">
          <path d="M4 1v10M8 1v10M1 4h10M1 8h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        {visual.label}
      </figcaption>
      <div className="aspect-video w-full overflow-hidden rounded-card border border-stroke bg-card-backplate">
        <video
          src={visual.src}
          aria-label={visual.alt ?? visual.label}
          controls
          playsInline
          preload="metadata"
          className="size-full object-contain"
        >
          Your browser doesn’t support embedded video.{" "}
          <a href={visual.src} className="underline">
            Download the recording
          </a>{" "}
          instead.
        </video>
      </div>
    </figure>
  );
}

export function CaseStudy() {
  const { monday, problem, whyAi, solution, decisions, flow, tradeoffs, process, metrics, learned } = hirebit;
  const [d1, d2, d3] = decisions.items;

  return (
    <LightboxProvider items={galleryOrder}>
      <article className="pt-[62px] lg:px-10">
        {/* ---------- Header ---------- */}
        <header className="flex flex-col">
          <BackLink />
          <Eyebrow className="mt-10">{hirebit.product} · Case study</Eyebrow>
          <h1 className="mt-4 max-w-[20ch] text-balance text-hero text-ink">{hirebit.title}</h1>
          <p className="mt-5 max-w-[62ch] text-[clamp(1.125rem,1rem+0.4vw,1.3125rem)] font-medium leading-[1.55] text-ink/80">{hirebit.intro}</p>

          <dl className={cn("mt-10 grid grid-cols-1 gap-y-4 py-5 sm:grid-cols-3 sm:gap-x-8", RULE_TOP, RULE_BOTTOM)}>
            {hirebit.facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1">
                <dt className="font-mono text-[12px] uppercase leading-4 tracking-[0.08em] text-muted">{fact.label}</dt>
                <dd className="text-[16px] leading-6 text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <Figure visual={hirebit.cover} caption={false} priority className="mt-10" />

        {/* Navigation stays with the case study, from here to the end. */}
        <div className="mt-12">
          <SectionNav sections={sections} />

          {/* ---------- 01 · Monday ---------- */}
          <Section id="monday" eyebrow={monday.eyebrow} title={monday.title} lede={monday.setup} first>
            <Scenario />
            <Statement>
              <Rich text={monday.punch} />
            </Statement>
          </Section>

          {/* ---------- 02 · The problem ---------- */}
          <Section id="problem" eyebrow={problem.eyebrow} title={problem.title} lede={problem.intro}>
            <Figure visual={problem.visual} />
            <Statement>
              <Rich text={problem.verdict} />
            </Statement>
            <CritiqueBoard />
          </Section>

          {/* ---------- 03 · Why AI ---------- */}
          <Section id="why-ai" eyebrow={whyAi.eyebrow} title={whyAi.title} lede={whyAi.intro}>
            <p className="max-w-[66ch] text-body leading-[1.65] text-ink/80">
              <Rich text={whyAi.lead} />
            </p>
            <Steps
              items={whyAi.roles.map((role) => ({
                chip: role.who,
                tone: role.who === "AI" ? "accent" : "success",
                title: role.title,
                text: role.text,
              }))}
            />
          </Section>

          {/* ---------- 04 · The solution ---------- */}
          <Section id="solution" eyebrow={solution.eyebrow} title={solution.title}>
            <Figure visual={solution.visual} />
            {/* The five parts as a numbered bento: two wide, three narrow, in screen order. */}
            <ol className="grid gap-3 sm:grid-cols-2 md:grid-cols-6">
              {solution.parts.map((part, i) => (
                <li
                  key={part.name}
                  className={cn(
                    "group relative flex flex-col gap-6 overflow-hidden rounded-[20px] border border-stroke bg-[#fafafa] p-6 transition-colors duration-300 hover:border-accent-line hover:bg-accent-soft/40 motion-reduce:transition-none",
                    i < 2 ? "md:col-span-3" : "md:col-span-2",
                    i === 4 && "sm:col-span-2 md:col-span-2",
                  )}
                >
                  <span className="text-[clamp(2.5rem,2rem+1.6vw,3.5rem)] font-medium leading-none tracking-[-0.05em] tabular-nums text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-[19px] font-medium leading-6 tracking-[-0.02em] text-ink">{part.name}</h3>
                    <p className="text-[16px] leading-[1.55] text-muted first-letter:uppercase">{part.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            {/* Two cards side by side: the pulse on the left, the side tray on the right. */}
            <div className="grid items-start gap-5 md:grid-cols-2">
              <Figure visual={solution.pulse} sizes="(min-width: 980px) 440px, (min-width: 768px) 50vw, 100vw" />
              <Figure visual={solution.tray} sizes="(min-width: 980px) 440px, (min-width: 768px) 50vw, 100vw" />
            </div>
          </Section>

          {/* ---------- 05 · Three decisions ---------- */}
          <Section id="decisions" eyebrow={decisions.eyebrow} title={decisions.title} roomy>
            {[d1, d2, d3].map((d, i) => (
              <article
                key={d.title}
                aria-labelledby={`decision-${i}`}
                className={cn("flex flex-col gap-6", i > 0 && "border-t border-stroke pt-14")}
              >
                <div className="flex flex-col gap-3">
                  <Eyebrow>Decision {i + 1}</Eyebrow>
                  <h3 id={`decision-${i}`} className="max-w-[30ch] text-card-title text-ink">
                    {d.title}
                  </h3>
                  <p className="max-w-[66ch] text-body font-medium leading-[1.6] text-ink/80">{d.problem}</p>
                </div>

                {"iterations" in d && d.iterations ? <IterationFlow iterations={d.iterations} changes={d.changes} changesHeading={d.changesHeading} /> : null}

                {i === 1 ? <TriageDiagram /> : null}

                {"visual" in d && d.visual ? <Figure visual={d.visual} /> : null}

                {"visuals" in d && d.visuals ? (
                  // Two crops side by side: they make the decision's point together.
                  <div className="grid gap-5 md:grid-cols-2">
                    {d.visuals.map((visual) => (
                      <Figure key={visual.id} visual={visual} sizes="(min-width: 980px) 440px, (min-width: 768px) 50vw, 100vw" />
                    ))}
                  </div>
                ) : null}

                {"text" in d && d.text ? <p className={prose}>{d.text}</p> : null}

                <PullQuote>{d.quote}</PullQuote>
              </article>
            ))}
          </Section>

          {/* ---------- 06 · Back to Monday ---------- */}
          <Section id="flow" eyebrow={flow.eyebrow} title={flow.title} lede={flow.intro}>
            <ProtoVideo visual={flow.video} />
            {/* The five steps the video walks through, as one numbered strip. */}
            <ol className="grid gap-0 md:grid-cols-5 md:gap-3">
              {flow.steps.map((step, i) => (
                <li key={step.label} className="relative flex gap-4 pb-6 last:pb-0 md:flex-col md:gap-3 md:pb-0">
                  {/* Connector to the next step: down on phones, across on desktop */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[15px] top-9 w-px bg-accent-line md:left-10 md:right-0 md:top-[15px] md:bottom-auto md:h-px md:w-auto [li:last-child_&]:hidden"
                  />
                  <StepNumber n={i + 1} />
                  <div className="flex flex-col gap-1 pt-1 md:pt-0">
                    <h3 className="text-[18px] font-medium leading-6 tracking-[-0.02em] text-ink">{step.label}</h3>
                    <p className="text-[15px] leading-[1.5] text-muted first-letter:uppercase">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Statement>
              <Rich text={flow.closing} />
            </Statement>
          </Section>

          {/* ---------- 07 · Trade-offs ---------- */}
          <Section id="tradeoffs" eyebrow={tradeoffs.eyebrow} title={tradeoffs.title}>
            <TradeoffNotes />
          </Section>

          {/* ---------- 08 · How I worked ---------- */}
          <Section id="process" eyebrow={process.eyebrow} title={process.title}>
            <ProcessBento />
          </Section>

          {/* ---------- 09 · Measuring success ---------- */}
          <Section id="metrics" eyebrow={metrics.eyebrow} title={metrics.title} lede={metrics.intro}>
            <ol className="grid gap-4 md:grid-cols-3">
              {metrics.items.map((m, i) => (
                <li key={m.title} className="flex flex-col gap-3 rounded-card border border-stroke bg-surface p-6">
                  <span className="font-mono text-[12px] uppercase leading-4 tracking-[0.08em] text-success">Metric {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-[18px] font-medium leading-6 tracking-[-0.02em] text-ink">{m.title}</h3>
                  <p className="text-[16px] leading-[1.6] text-muted first-letter:uppercase">{m.text}</p>
                </li>
              ))}
            </ol>
          </Section>

          {/* ---------- 10 · What I learned ---------- */}
          <Section id="learned" eyebrow={learned.eyebrow} title={learned.title}>
            <Statement>
              <Rich text={learned.lead} />
            </Statement>
            <ul className="flex flex-col gap-5">
              {learned.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <Check />
                  <p className={prose}>
                    <Rich text={point} />
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* ---------- Thank you ---------- */}
        <aside
          aria-labelledby="thanks-title"
          className="mt-[60px] flex flex-col gap-3 rounded-card border border-accent-line bg-accent-soft/50 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8"
        >
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[12px] uppercase leading-4 tracking-[0.08em] text-accent">{hirebit.thanks.badge}</span>
            <h2 id="thanks-title" className="text-card-title text-ink">
              {hirebit.thanks.title}
            </h2>
            <p className="max-w-[52ch] text-[16px] leading-[1.6] text-muted">{hirebit.thanks.body}</p>
          </div>
          <p className="shrink-0 text-[16px] font-medium leading-6 text-ink">{hirebit.thanks.signoff}</p>
        </aside>

        <SectionDivider className={cn("mt-[60px]", BAND_BLEED)} />
        <BackLink className="mt-10" />
        <MoreWork currentId="recruitment-ai" className="mt-10" />
        {/* Same close as the homepage: band, contact, social links, footer. */}
        <SectionDivider className={cn("mt-[60px]", BAND_BLEED)} />
        <ContactCta />
      </article>
    </LightboxProvider>
  );
}
