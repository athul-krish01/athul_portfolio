import { contact } from "@/data/site";
import { SplitButton } from "@/components/ui/SplitButton";
import { CopyIcon } from "@/components/ui/icons";

export function ContactCta() {
  return (
    <section className="flex flex-col items-center gap-6 py-16 text-center">
      <div className="flex max-w-[472px] flex-col gap-4">
        <h2 className="text-contact-heading text-ink">{contact.heading}</h2>
        <p className="text-body text-muted">{contact.body}</p>
      </div>
      {/* TODO: wire up the real contact action (mailto:, copy-to-clipboard,
          or a form) once a destination is decided — currently a static link. */}
      <SplitButton icon={<CopyIcon />}>Contact me</SplitButton>
    </section>
  );
}
