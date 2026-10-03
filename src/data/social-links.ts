export interface SocialLink {
  label: string;
  href: string;
  /** Path under public/icons/social, matching the real exported Figma asset. */
  icon: string;
}

// Labels and icons are transcribed from the Figma file; the Figma file does
// not specify destination URLs, so these are left as explicit placeholders.
export const socialLinks: SocialLink[] = [
  { label: "Linkedin", href: "#", icon: "/icons/social/linkedin.svg" }, // TODO: real LinkedIn URL
  { label: "Twitter", href: "#", icon: "/icons/social/twitter.svg" }, // TODO: real Twitter/X URL
  { label: "Behance", href: "#", icon: "/icons/social/behance.svg" }, // TODO: real Behance URL
];
