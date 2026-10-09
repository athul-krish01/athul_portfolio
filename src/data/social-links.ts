export interface SocialLink {
  label: string;
  href: string;
  /** Path under public/icons/social — the colored icons8 PNG export. */
  icon: string;
}

export const socialLinks: SocialLink[] = [
  { label: "Linkedin", href: "https://www.linkedin.com/in/athulkrishnakk/", icon: "/icons/social/linkedin.png" },
  { label: "Medium", href: "https://medium.com/@athul.krishna", icon: "/icons/social/medium-logo-icon.png" },
  { label: "Behance", href: "https://www.behance.net/Athulkrishkk", icon: "/icons/social/behance.png" },
];
