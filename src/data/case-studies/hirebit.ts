/**
 * Hirebit case study — transcribed from "HIREBIT_NEW.md", the source of
 * truth. Text is kept as written; `**bold**` and `*italic*` are the source's
 * own emphasis, rendered by <Rich>. Diagrams on the page are drawn only from
 * facts stated here.
 *
 * To add a screenshot: put it in public/images/case-studies/hirebit/ and set
 * that visual's `src` (and `alt`) below. The placeholder disappears and the
 * image becomes viewable full screen. A `.mp4` src plays as a muted loop.
 */

export type Rich = string;

export interface Visual {
  /** Stable id, also the suggested file name. */
  id: string;
  /** What goes here; shown as the frame's name and the viewer caption. */
  label: string;
  /** Width / height. */
  aspect: string;
  src?: string;
  alt?: string;
  /** A short muted loop rather than a still. */
  video?: boolean;
}

const v = (id: string, label: string, aspect = "16/10", extra: Partial<Visual> = {}): Visual => ({ id, label, aspect, ...extra });

/** Every image slot, in page order (the viewer's arrow keys follow this order). */
export const visuals = {
  cover: v("cover", "Hirebit, the 2026 dashboard", "2940/1600", {
    src: "/images/case-studies/hirebit/cover.png",
    alt: "The Hirebit dashboard on an orange backdrop, with the Brief, the At stake card, the issue list and Team capacity",
  }),
  dashboard2023: v("dashboard-2023", "The 2023 dashboard", "2940/1600", {
    src: "/images/case-studies/hirebit/dashboard-2023.png",
    alt: "The 2023 hiring dashboard: eight stat tiles, a board overview with a donut chart, and a job table",
  }),
  firstScreen: v("dashboard-2026-first-screen", "The dashboard’s first screen: the Brief, the top of the list and Team capacity", "2940/1600", {
    src: "/images/case-studies/hirebit/dashboard-2026-first-screen.png",
    alt: "The 2026 dashboard’s first screen: the Brief with three signals, the At stake card, the ranked issue list and Team capacity",
  }),
  pulse: v("weekly-pulse", "This week’s pulse, cropped on its own", "2368/1358", {
    src: "/images/case-studies/hirebit/weekly-pulse.png",
    alt: "This week’s pulse: submissions 8 of 12, pipeline coverage 4 of 7, roles past SLA 2 of 7 and placements 2 of 4",
  }),
  // A still for now. To use a looping clip, set `video: true` and an .mp4 `src`.
  trayClip: v("tray-clip", "Clicking an issue opens the side tray", "2368/1358", {
    src: "/images/case-studies/hirebit/tray-clip.png",
    alt: "The Escalate Sr. Backend Engineer to Acme decision tray: why it matters, key evidence, the AI recommendation and the actions",
  }),
  briefV1: v("brief-iteration-1", "Iteration 1: the paragraph Brief", "2940/1600", {
    src: "/images/case-studies/hirebit/brief-iteration-1.png",
    alt: "Iteration 1: The Brief as one paragraph about the weekend, with its sources underneath",
  }),
  briefFinal: v("brief-final", "Final: the Brief and the At stake card", "2940/1600", {
    src: "/images/case-studies/hirebit/brief-final.png",
    alt: "The final Brief: three signals, each with its impact and next step, beside the At stake card",
  }),
  triage: v("triage-list", "The final triage list: Needs you, At risk and On track", "2327/1444", {
    src: "/images/case-studies/hirebit/triage-list.png",
    alt: "The triage list: Needs you, At risk and On track, with each role’s fee, recruiter and next step",
  }),
  aiRecommendation: v("ai-recommendation-card", "The AI recommendation", "2368/1358", {
    src: "/images/case-studies/hirebit/ai-recommendation-card.png",
    alt: "The Acme decision tray, Overview tab: why it matters, key evidence and the AI recommendation to escalate",
  }),
  aiUnknowns: v("data-cant-tell-you", "“What the data can’t tell you”", "2368/1358", {
    src: "/images/case-studies/hirebit/data-cant-tell-you.png",
    alt: "The Acme decision tray, Evidence tab, with “What the data can’t tell you” listing the gaps in the data",
  }),
  // The prototype walkthrough: a real recording with sound, so it gets its
  // own native <video> with controls (see ProtoVideo in CaseStudy.tsx)
  // rather than the muted autoplaying loop the other `video: true` slots use.
  flowVideo: v("flow-video", "The five steps below", "16/9", {
    src: "/videos/Issue_Flow_Prototype.mp4",
    alt: "A walkthrough of the Acme issue: spotting it in the Brief, reviewing the tray, drafting the escalation, approving it, and the confirmation with Undo",
  }),
} satisfies Record<string, Visual>;

export const galleryOrder: Visual[] = Object.values(visuals);

export const hirebit = {
  product: "Hirebit",
  title: "A dashboard that answers “What needs me first?”",
  intro:
    "In 2023, as an intern, I designed a recruitment dashboard that showed everything. In 2026 I rebuilt it AI-first, so a wall of numbers becomes the three things a manager must act on today.",

  facts: [
    { label: "My role", value: "Product designer, UX designer" },
    { label: "Domain", value: "Recruitment SaaS, AI" },
    { label: "Year", value: "2026" },
  ],

  cover: visuals.cover,

  monday: {
    eyebrow: "The scenario",
    title: "It’s Monday, 8:02 AM",
    setup: "You manage 3 recruiters and 5 client accounts.",
    weekendLead: "Over the weekend",
    // "a deadline slipped on your oldest client, a strong candidate went
    // quiet, and one of your recruiters took on too much": one moment each,
    // told by an illustration. To use a drawn illustration instead of the
    // built-in one, set `src` (public/images/case-studies/hirebit/).
    weekend: [
      { id: "deadline", text: "A deadline slipped on your oldest client", src: "/images/case-studies/hirebit/scenario-deadline.png" as string | null },
      { id: "candidate", text: "A strong candidate went quiet", src: "/images/case-studies/hirebit/scenario-candidate.png" as string | null },
      { id: "recruiter", text: "One of your recruiters took on too much", src: "/images/case-studies/hirebit/scenario-recruiter.png" as string | null },
    ],
    // "You open the dashboard. It shows 60 openings, 12 offers, a donut chart
    // and a table of revenue." — split into the moment and what you see.
    open: { title: "You open the dashboard.", text: "It shows 60 openings, 12 offers, a donut chart and a table of revenue.", src: null as string | null },
    punch: "**Every number is there. None of them tells you what to do first.**",
  },

  problem: {
    eyebrow: "The problem",
    title: "A dashboard that reports",
    visual: visuals.dashboard2023,
    intro: "In 2023, as an intern, I designed this screen. It put all the hiring data in one place, which was the brief. Looking back, the issue is simple:",
    verdict: "**It showed everything, so nothing stood out.**",
    points: [
      { title: "Every number had the same weight.", text: "“Did not join: 1” was as loud as “Openings: 60.”" },
      { title: "It counted activity, not outcomes.", text: "The donut tracked statuses, not whether hiring was moving." },
      { title: "Nothing said what needed the manager,", text: "or what to do next." },
    ],
    // "This is my critique in hindsight. The 2023 interviews pointed the same
    // way: scattered information, hiring that stalls quietly, and managers
    // unsure where to step in." — split so the findings can sit as tags.
    noteLead: "This is my critique in hindsight. The 2023 interviews pointed the same way:",
    interviews: ["Scattered information", "Hiring that stalls quietly", "Managers unsure where to step in"],
  },

  whyAi: {
    eyebrow: "Why AI",
    title: "Why AI, and what kind",
    intro: "The research didn’t change. AI did. In 2023 it wasn’t practical for a small product to read and reason over hiring data. Now it is.",
    lead: "But I didn’t want AI that decides for the manager. I designed it as **a decision-support layer, not a decision-maker:**",
    roles: [
      { who: "AI", title: "It reads the data,", text: "so the manager doesn’t have to." },
      { who: "AI", title: "It suggests one next step,", text: "with its reasons and sources." },
      { who: "Manager", title: "It never acts alone.", text: "The manager reviews, approves, and can undo." },
    ],
  },

  solution: {
    eyebrow: "The solution",
    title: "One screen that answers “what needs me first?” from top to bottom.",
    visual: visuals.firstScreen,
    parts: [
      { name: "The Brief", text: "what changed since Friday, written by AI, with the money at stake." },
      { name: "Needs your attention", text: "every issue ranked, each with one next step." },
      { name: "Team capacity", text: "who is stretched, who has room, and a suggested handover that explains itself, including why not the other option." },
      { name: "This week’s pulse", text: "four numbers instead of eight, placed below the work." },
      { name: "The side tray", text: "click any issue to see why, then act, without leaving the page." },
    ],
    pulse: visuals.pulse,
    tray: visuals.trayClip,
  },

  decisions: {
    eyebrow: "Design decisions",
    title: "Three decisions that shaped it",
    items: [
      {
        title: "Turn the Brief from a report into a decision",
        problem: "A summary told the manager what happened. They still had to work out what to do.",
        iterations: [
          {
            label: "Iteration 1",
            heading: "One paragraph about the weekend",
            visual: visuals.briefV1,
            text: "The AI wrote one paragraph about the weekend. It was accurate, but three problems were buried in one block, the sources sat apart from the claims, and “₹8.4L need attention” read like money already lost.",
          },
          {
            label: "Final design",
            heading: "Three signals, one pattern each",
            visual: visuals.briefFinal,
            text: "Three signals, each following one pattern: **what happened → why it matters → what to do next.** Each carries its own source and a severity colour. Money moved into its own card, labelled “Risk-weighted estimate · not a loss,” and split into the same groups as the list.",
          },
        ],
        /** Iteration 1's three problems, each paired with the fix in Final. */
        changesHeading: "Three problems, three fixes",
        changes: [
          { before: "Three problems buried in one block", after: "Three signals, one pattern each" },
          { before: "Sources sat apart from the claims", after: "Each signal carries its own source" },
          { before: "“₹8.4L need attention” read like money already lost", after: "Money in its own card: “Risk-weighted estimate · not a loss”" },
        ],
        quote: "The AI stopped summarising and started reasoning.",
      },
      {
        title: "Rank by who must act, not by how late",
        problem: "A list sorted by lateness puts every overdue role on the manager’s plate, even when someone else should fix it.",
        visual: visuals.triage,
        text: "The UX Designer role is overdue, but it stays in At risk. Chasing that client is the recruiter’s job, so it never lands on the manager’s list.",
        quote: "Being late doesn’t make it yours.",
      },
      {
        title: "Review before you act",
        problem: "A one-click AI button is fast. It also asks the manager to trust a suggestion without seeing why.",
        visuals: [visuals.aiRecommendation, visuals.aiUnknowns],
        text: "Every issue opens a tray that leads with the decision. Below it: why it matters, the evidence, the AI’s recommendation and other options. Each statement is labelled as confirmed, calculated or AI-suggested, and the tray lists what the data can’t tell you. AI-drafted emails leave blanks, like [date], so the AI never invents a promise.",
        quote: "The AI drafts. The manager decides.",
      },
    ],
    /** Decision 2's triage diagram: only the two roles the source names. */
    triage: {
      lateness: { title: "Sorted by how late", note: "Every overdue role lands on your plate." },
      ranked: { title: "Ranked by who must act", note: "The UX Designer role never lands on your list." },
      acme: { role: "Acme", detail: "9 days late · ₹4.2L at stake" },
      ux: { role: "UX Designer", detail: "Overdue · the recruiter chases the client" },
      groups: ["Needs you", "At risk", "On track"],
    },
  },

  flow: {
    eyebrow: "The flow",
    title: "Back to Monday: one problem, five steps",
    intro: "Remember the deadline that slipped on your oldest client? Here it is, from first sight to done: Acme, 9 days late, with ₹4.2L at stake.",
    video: visuals.flowVideo,
    steps: [
      { label: "Spot it", text: "it leads the Brief" },
      { label: "Review it", text: "evidence and AI recommendation" },
      { label: "Draft it", text: "AI writes, leaves blanks" },
      { label: "Approve it", text: "fill in and confirm" },
      { label: "Done", text: "escalated, with Undo" },
    ],
    closing: "**One issue, one place, and nothing sent without the manager’s say.**",
  },

  tradeoffs: {
    eyebrow: "Trade-offs",
    title: "Trade-offs I chose",
    items: [
      { title: "Trust over speed.", text: "Reviewing before acting adds a step. For decisions that touch clients and money, it’s a trade I’m willing to make." },
      { title: "Honest blanks over smooth drafts.", text: "The AI leaves placeholders instead of guessing names or dates." },
      { title: "A taller Brief.", text: "Adding impact and next steps made it about 100px taller, so I cut copy to keep the list on the first screen." },
    ],
  },

  process: {
    eyebrow: "Process",
    title: "How I worked",
    items: [
      { title: "Explored wide with the same data.", text: "Five directions, one structure, so I compared design, not content." },
      { title: "Checked the logic before the visuals.", text: "I audited every number and stated each assumption. For example, ₹8.4L is ₹19.2L of flagged fees, weighted at about 44%." },
      { title: "Built it to be used.", text: "I turned the design into a clickable prototype, where one action updates the Brief, the list and the team view together." },
    ],
  },

  metrics: {
    eyebrow: "Measuring success",
    title: "If Hirebit works, the numbers will show it",
    intro: "It hasn’t been tested yet. These are the three numbers I’d watch first:",
    items: [
      { title: "Time to first action", text: "how long from opening the dashboard to acting on the top issue." },
      { title: "Recommendations accepted after review", text: "a high rate means the evidence earns trust. A low rate means the suggestions aren’t useful." },
      { title: "“Needs you” cleared the same day", text: "if this rises, the ranking points managers at the right work." },
    ],
  },

  learned: {
    eyebrow: "Reflection",
    title: "What I learned",
    lead: "**In 2023 I designed to show the data. In 2026 I designed to help someone decide.**",
    points: [
      "**Start from the user’s question,** not the data you have.",
      "**Good AI does the reading.** The person still makes the call.",
      "**Trust is designed.** Sources, labels, limits and undo matter more than clever suggestions.",
    ],
  },

  thanks: {
    badge: "You’ve reached the end",
    title: "Thank you for reading.",
    body: "If something here made you curious, I’d love to hear from you.",
    signoff: "— Athul",
  },
};

/** Section anchors for the side rail / tab bar. Short labels so they scan. */
export const sections = [
  { id: "monday", label: "Monday, 8:02 AM" },
  { id: "problem", label: "The problem" },
  { id: "why-ai", label: "Why AI" },
  { id: "solution", label: "The solution" },
  { id: "decisions", label: "Three decisions" },
  { id: "flow", label: "Back to Monday" },
  { id: "tradeoffs", label: "Trade-offs" },
  { id: "process", label: "How I worked" },
  { id: "metrics", label: "Measuring success" },
  { id: "learned", label: "What I learned" },
];
