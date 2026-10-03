/**
 * Tiny weather glyphs for the navbar status chip, mapped from WMO weather
 * interpretation codes (what Open-Meteo returns in `current.weather_code`).
 *
 * These are drawn here rather than exported from Figma because the design
 * file has no weather set — the reference screenshot shows a single cloud
 * mark, and a live chip needs the other states too. Deliberately crude at
 * 14px: stroked `currentColor` paths, no fills, so they sit at the same
 * visual weight as the text either side of them.
 */

type GlyphKind = "sun" | "moon" | "cloud-sun" | "cloud" | "fog" | "rain" | "snow" | "storm";

/** WMO code -> glyph. Ranges follow Open-Meteo's own documented grouping. */
function glyphFor(code: number, isDay: boolean): GlyphKind {
  if (code === 0) return isDay ? "sun" : "moon";
  if (code === 1 || code === 2) return isDay ? "cloud-sun" : "cloud";
  if (code === 3) return "cloud";
  if (code === 45 || code === 48) return "fog";
  if (code >= 95) return "storm";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  // 51–67 drizzle/rain/freezing rain, 80–82 showers.
  return "rain";
}

const CLOUD_PATH = "M4.5 11.5h6a2.75 2.75 0 0 0 .2-5.49A3.75 3.75 0 0 0 4.2 7.1a2.25 2.25 0 0 0 .3 4.4Z";

function Paths({ kind }: { kind: GlyphKind }) {
  switch (kind) {
    case "sun":
      return (
        <>
          <circle cx="8" cy="8" r="3.1" />
          {/* Eight rays, 45° apart, as one path to keep the node count low. */}
          <path d="M8 1.6v1.3M8 13.1v1.3M1.6 8h1.3M13.1 8h1.3M3.5 3.5l.9.9M11.6 11.6l.9.9M12.5 3.5l-.9.9M4.4 11.6l-.9.9" />
        </>
      );
    case "moon":
      return <path d="M12.6 9.6A5 5 0 0 1 6.4 3.4a5 5 0 1 0 6.2 6.2Z" />;
    case "cloud-sun":
      return (
        <>
          <circle cx="5.4" cy="5.4" r="2.1" />
          <path d="M5.4 1.7v.9M1.7 5.4h.9M2.8 2.8l.6.6M8 2.8l-.6.6" />
          <path d={CLOUD_PATH} />
        </>
      );
    case "cloud":
      return <path d={CLOUD_PATH} />;
    case "fog":
      return (
        <>
          <path d={CLOUD_PATH} />
          <path d="M3.2 14h9.6" />
        </>
      );
    case "rain":
      return (
        <>
          <path d={CLOUD_PATH} />
          <path d="M5.8 13.3l-.6 1.3M8.3 13.3l-.6 1.3M10.8 13.3l-.6 1.3" />
        </>
      );
    case "snow":
      return (
        <>
          <path d={CLOUD_PATH} />
          <path d="M5.6 14h.1M8.1 14h.1M10.6 14h.1" />
        </>
      );
    case "storm":
      return (
        <>
          <path d={CLOUD_PATH} />
          <path d="M8.6 13l-1.9 0 1.2 1.9" />
        </>
      );
  }
}

export function WeatherGlyph({
  code,
  isDay = true,
  className,
}: {
  code: number;
  isDay?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <Paths kind={glyphFor(code, isDay)} />
    </svg>
  );
}
