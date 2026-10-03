import Image from "next/image";
import { socialLinks } from "@/data/social-links";

export function SocialLinks() {
  return (
    <nav className="flex items-center justify-center gap-6 py-10" aria-label="Social links">
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="flex items-center gap-1 text-ui text-muted"
        >
          <Image src={link.icon} alt="" width={16} height={16} />
          {link.label}
        </a>
      ))}
    </nav>
  );
}
