/**
 * Selected Work content — copy transcribed verbatim from the Figma file
 * (work-grid cards, node 1:104 / 1:147 / 1:123 / 1:395). Thumbnails are
 * placeholders (`image: null`) until real exported images are supplied —
 * the source cards are flattened screenshot mockups, not live UI, so there
 * is nothing faithful to extract yet.
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  /** Case-study page. No URLs exist in the design or data yet — see the TODOs below. */
  href: string;
  /** When true the card shows a "Coming Soon" status and the link is suppressed. */
  comingSoon?: boolean;
}

export const projects: Project[] = [
  {
    id: "program-management",
    title: "Redesigning an Underused Program Management Experience",
    description:
      "Joined a six-week discovery sprint to uncover adoption challenges and redesign the experience from the ground up.",
    tags: ["Enterprise UX", "Program Management"],
    image: "/images/projects/program-management.png",
    href: "#", // TODO: real case-study URL
  },
  {
    id: "pharma-pricing",
    title: "Making Complex Pharma Pricing Decisions Easier to Evaluate",
    description:
      "Restructured a dense pricing grid to bring proposed prices, market context, and compliance information into a clearer decision-making workflow.",
    tags: ["Enterprise UX", "Pricing & Compliance"],
    image: "/images/projects/pharma-pricing.png",
    href: "#", // TODO: real case-study URL
  },
  {
    id: "waste-collection",
    title: "From Paper Logs to a Smarter Waste Collection Workflow",
    description:
      "Designed a mobile app that replaced manual, offline waste records with a simpler way for garbage truck drivers to log collections and locate pickup facilities.",
    tags: ["Mobile", "Workflow Design"],
    image: "/images/projects/waste-collection.png",
    href: "https://medium.com/@athul.krishna/streamlining-waste-collection-a-mobile-app-for-garbage-truck-drivers-e0cb4da0013c",
  },
  {
    id: "recruitment-ai",
    title: "Reimagining Recruitment with AI",
    description:
      "Exploring how an AI-first recruitment platform can help recruiters and hiring managers streamline candidate evaluation, uncover hiring insights, and make better-informed decisions.",
    tags: ["AI-Powered", "Recruitment"],
    image: "/images/projects/recruitment-ai.png",
    href: "#", // TODO: real case-study URL — replace when ready
    comingSoon: true,
  },
];
