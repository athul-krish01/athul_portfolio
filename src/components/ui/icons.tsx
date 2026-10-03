import Image from "next/image";

/**
 * Both icons are the real exported Figma assets (Phosphor "arrow-right" and
 * the split-button "copy" glyph), downloaded to public/icons/ui — not
 * hand-drawn approximations. Their fills are already baked as white in the
 * source export, which matches every place they're currently used (on dark
 * gradient buttons), so no currentColor trick is needed.
 */

export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/ui/arrow-right.svg"
      alt=""
      width={16}
      height={16}
      className={className}
    />
  );
}

export function CopyIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/ui/copy.svg"
      alt=""
      width={16}
      height={16}
      className={className}
    />
  );
}
