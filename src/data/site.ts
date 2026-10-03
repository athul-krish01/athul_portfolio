/**
 * Site-level metadata, navigation, and singular section copy.
 *
 * Everything below except explicit TODOs is transcribed verbatim from the
 * Figma file (node 1:61) — nothing here is invented. Fields marked TODO are
 * genuinely absent from the design (Figma gives labels but no URLs/targets)
 * and are left as clearly-flagged placeholders.
 */

export const site = {
  name: "Athul Krishna",
  role: "UX Designer",
  // TODO: confirm final <title> / meta description copy before launch
  title: "Athul Krishna — UX Designer",
  description:
    "Portfolio of Athul Krishna, a UX designer specialising in enterprise SaaS, AI-powered products, and complex digital experiences.",
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  // In-page anchors: #home is the zero-height marker at the top of the
  // canvas (app/page.tsx), #selected-work is the SelectedWork <section>.
  // Both clear the fixed navbar via the scroll-margin rule in globals.css.
  { label: "Home", href: "#home" },
  { label: "Selected work", href: "#selected-work" },
  { label: "Linkedin", href: "#" }, // TODO: real LinkedIn URL
];

export const resumeHref = "#"; // TODO: real resume file URL

export const hero = {
  heading: "I make complicated software less complicated.",
  body: "Hey, I'm Athul Krishna, a UX Designer specialising in enterprise SaaS, AI-powered products, and complex digital experiences. I turn intricate workflows into intuitive interfaces through thoughtful interaction design and a healthy obsession with the details.",
};

export const about = {
  eyebrow: "ABOUT ME",
  heading: "From making things look good to making them work better.",
  paragraphs: [
    "My journey began in Multimedia and Animation, where I fell in love with creating things. Over time, I became more curious about how people use them, what makes an experience click, and why some things are unnecessarily complicated. That curiosity led me to UX design.",
    "These days, I enjoy figuring things out, experimenting with new tools, and finding better ways to bring ideas to life.",
    "Away from the screen, I’m usually playing football, watching matches at unreasonable hours, or sharing football takes on Twitter. I hit the gym, enjoy gaming (despite not owning a PS5), and proudly claim to be the second-best FIFA player at my office.",
  ],
};

export const contact = {
  heading: "Let’s get in touch!",
  body: "I’d love to hear from you. Drop me a message and let’s start a conversation.",
};
