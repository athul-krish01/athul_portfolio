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
}

export const projects: Project[] = [
  {
    id: "program-management",
    title: "Redesigning an Underused Program Management Experience",
    description:
      "Joined a six-week discovery sprint to uncover adoption challenges and redesign the experience from the ground up.",
    tags: ["B2B SaaS", "Product Discovery", "2025"],
    image: "/images/projects/program-management.png",
    href: "#", // TODO: real case-study URL
  },
  {
    id: "pharma-pricing",
    title: "Making Complex Pharma Pricing Decisions Easier to Evaluate",
    description:
      "Restructured a dense pricing grid to bring proposed prices, market context, and compliance information into a clearer decision-making workflow.",
    tags: ["Pharma", "Enterprise SaaS", "2025"],
    image: "/images/projects/pharma-pricing.png",
    href: "#", // TODO: real case-study URL
  },
  {
    id: "waste-collection",
    title: "From Paper Logs to a Smarter Waste Collection Workflow",
    description:
      "Designed a mobile app that replaced manual, offline waste records with a simpler way for garbage truck drivers to log collections and locate pickup facilities.",
    tags: ["Mobile App", "Field Operations", "2022"],
    image: "/images/projects/waste-collection.png",
    href: "#", // TODO: real case-study URL
  },
  {
    id: "trading-flow",
    title: "Redesigning trading flow to be 40% faster.",
    description:
      "Redesigned order placement, reducing steps and cutting time by 40%, now powering 6M+ daily orders.",
    // Both badges read "shadcn/ui Specimen Matrix" in the source file —
    // transcribed as-is rather than invented. This reads like unfinished
    // placeholder copy in the Figma file itself; flag rather than replace.
    tags: ["shadcn/ui Specimen Matrix", "shadcn/ui Specimen Matrix"],
    image: "/images/projects/trading-flow.png",
    href: "#", // TODO: real case-study URL
  },
];
