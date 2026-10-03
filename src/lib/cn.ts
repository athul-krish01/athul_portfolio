type ClassValue = string | number | null | false | undefined | ClassValue[];

function flatten(input: ClassValue, out: string[]) {
  if (input === null || input === undefined || input === false) return;
  if (Array.isArray(input)) {
    input.forEach((item) => flatten(item, out));
    return;
  }
  out.push(String(input));
}

/**
 * Minimal classnames combiner. Intentionally dependency-free (no clsx /
 * tailwind-merge) per the instruction not to add new libraries during the
 * foundation phase. It concatenates and does not deduplicate conflicting
 * Tailwind classes — keep variant class lists mutually exclusive at the
 * call site.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  inputs.forEach((input) => flatten(input, out));
  return out.join(" ");
}
