import { headers } from "next/headers";
import type { AmbientData } from "@/lib/ambient";

/**
 * Ambient data for the navbar status chip: where the visitor is, and what
 * the weather is doing there.
 *
 * This runs server-side rather than straight from the client for two
 * reasons: the upstream responses can be cached per-location instead of
 * once per visitor, and neither provider has to be reachable via CORS.
 *
 * Nothing here is keyed — every provider used is free/no-auth, so there is
 * no secret to leak and no env var to configure. If they are all
 * unreachable the route answers 200 with the fields it managed to resolve;
 * the chip degrades to a live clock on its own (see StatusPill.tsx).
 */

/** Cache windows, in seconds. Weather moves; a city does not. */
const WEATHER_TTL = 900; // 15 min
const GEO_TTL = 60 * 60 * 24; // 24 h

/**
 * Hosting platforms that resolve geography at the edge hand it over in
 * request headers, which is both faster and more accurate than an IP
 * lookup. Vercel and Cloudflare use different names for the same four
 * values, so both spellings are checked.
 */
function geoFromHeaders(h: Headers) {
  const lat = h.get("x-vercel-ip-latitude") ?? h.get("cf-iplatitude");
  const lon = h.get("x-vercel-ip-longitude") ?? h.get("cf-iplongitude");
  if (!lat || !lon) return null;

  const latitude = Number(lat);
  const longitude = Number(lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const rawCity = h.get("x-vercel-ip-city") ?? h.get("cf-ipcity");
  return {
    latitude,
    longitude,
    // Vercel percent-encodes city names ("S%C3%A3o%20Paulo").
    city: rawCity ? safeDecode(rawCity) : undefined,
    country: h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry") ?? undefined,
    timeZone: h.get("x-vercel-ip-timezone") ?? undefined,
  };
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * First public address in the forwarded chain. Private/loopback entries are
 * skipped so that in local development we fall through to the no-argument
 * ipapi.co call, which geolocates the machine running `next dev` — i.e. the
 * developer, which is the useful answer there.
 */
function clientIp(h: Headers) {
  const chain = (h.get("x-forwarded-for") ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const candidates = [...chain, h.get("x-real-ip") ?? ""].filter(Boolean);
  return candidates.find((ip) => !isPrivateAddress(ip));
}

function isPrivateAddress(ip: string) {
  if (ip === "::1" || ip === "127.0.0.1" || ip.startsWith("fc") || ip.startsWith("fd")) {
    return true;
  }
  if (ip.startsWith("10.") || ip.startsWith("192.168.")) return true;
  // 172.16.0.0 – 172.31.255.255
  const match = /^172\.(\d{1,2})\./.exec(ip);
  return match !== null && Number(match[1]) >= 16 && Number(match[1]) <= 31;
}

interface Place {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  timeZone?: string;
}

/**
 * Keyless IP-geolocation providers, tried in order.
 *
 * There is a chain rather than a single provider because the free tiers all
 * rate-limit per source address, and a developer behind carrier-grade NAT
 * (or a serverless region sharing egress IPs) burns through a shared quota
 * without doing anything wrong — ipapi.co already answers 429 from this
 * machine, which is why it sits last.
 *
 * Each entry builds its URL and narrows its own response shape; they do not
 * agree on field names or nesting.
 */
const GEO_PROVIDERS: { url: (ip?: string) => string; parse: (body: Record<string, unknown>) => Place | null }[] = [
  {
    url: (ip) => (ip ? `https://ipwho.is/${encodeURIComponent(ip)}` : "https://ipwho.is/"),
    parse: (data) => {
      if (data.success === false) return null;
      // ipwho.is nests the zone: { timezone: { id: "Asia/Kolkata", ... } }
      const zone = data.timezone;
      const timeZone =
        typeof zone === "object" && zone !== null && typeof (zone as { id?: unknown }).id === "string"
          ? (zone as { id: string }).id
          : undefined;
      return toPlace(data.latitude, data.longitude, data.city, data.country_code, timeZone);
    },
  },
  {
    url: (ip) =>
      ip
        ? `https://get.geojs.io/v1/ip/geo/${encodeURIComponent(ip)}.json`
        : "https://get.geojs.io/v1/ip/geo.json",
    // geojs returns lat/lon as strings; toPlace coerces.
    parse: (data) =>
      toPlace(data.latitude, data.longitude, data.city, data.country_code, data.timezone),
  },
  {
    url: (ip) => (ip ? `https://ipapi.co/${encodeURIComponent(ip)}/json/` : "https://ipapi.co/json/"),
    parse: (data) =>
      toPlace(data.latitude, data.longitude, data.city, data.country_code, data.timezone),
  },
];

function toPlace(
  lat: unknown,
  lon: unknown,
  city: unknown,
  country: unknown,
  timeZone: unknown,
): Place | null {
  const latitude = Number(lat);
  const longitude = Number(lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  // 0,0 is Null Island — what several providers return for an unknown IP.
  if (latitude === 0 && longitude === 0) return null;

  return {
    latitude,
    longitude,
    city: typeof city === "string" && city ? city : undefined,
    country: typeof country === "string" && country ? country : undefined,
    timeZone: typeof timeZone === "string" && timeZone ? timeZone : undefined,
  };
}

async function geoFromIp(ip: string | undefined): Promise<Place | null> {
  for (const provider of GEO_PROVIDERS) {
    try {
      const res = await fetch(provider.url(ip), { next: { revalidate: GEO_TTL } });
      if (!res.ok) continue;

      const body: unknown = await res.json();
      if (typeof body !== "object" || body === null) continue;

      const place = provider.parse(body as Record<string, unknown>);
      if (place) return place;
    } catch {
      // Network error or non-JSON body — fall through to the next provider.
    }
  }
  return null;
}

async function currentWeather(latitude: number, longitude: number) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(2)}` +
    `&longitude=${longitude.toFixed(2)}` +
    `&current=temperature_2m,weather_code,is_day&timezone=auto`;

  const res = await fetch(url, { next: { revalidate: WEATHER_TTL } });
  if (!res.ok) return null;

  const body: unknown = await res.json();
  if (typeof body !== "object" || body === null) return null;

  const data = body as { current?: Record<string, unknown>; timezone?: unknown };
  const current = data.current;
  if (!current) return null;

  const temperature = Number(current.temperature_2m);
  return {
    temperatureC: Number.isFinite(temperature) ? Math.round(temperature) : undefined,
    weatherCode: Number.isFinite(Number(current.weather_code))
      ? Number(current.weather_code)
      : undefined,
    isDay: current.is_day === 1,
    timeZone: typeof data.timezone === "string" ? data.timezone : undefined,
  };
}

export async function GET() {
  const requestHeaders = await headers();

  let payload: AmbientData = {};

  try {
    const place = geoFromHeaders(requestHeaders) ?? (await geoFromIp(clientIp(requestHeaders)));

    if (place) {
      payload = {
        city: place.city,
        country: place.country,
        timeZone: place.timeZone,
      };

      const weather = await currentWeather(place.latitude, place.longitude);
      if (weather) {
        payload = {
          ...payload,
          temperatureC: weather.temperatureC,
          weatherCode: weather.weatherCode,
          isDay: weather.isDay,
          timeZone: payload.timeZone ?? weather.timeZone,
        };
      }
    }
  } catch {
    // Upstream outage or rate limit. An empty payload is a valid answer —
    // the chip keeps showing a live clock and just omits the weather half.
  }

  return Response.json(payload, {
    headers: {
      "Cache-Control": `public, max-age=0, s-maxage=${WEATHER_TTL}, stale-while-revalidate=${WEATHER_TTL}`,
    },
  });
}
