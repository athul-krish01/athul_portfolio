/**
 * Shape of the navbar's ambient payload, shared between the route handler
 * that resolves it (app/api/ambient/route.ts) and the client chip that
 * renders it (components/sections/StatusPill.tsx).
 *
 * Every field is optional: the route answers with whatever it managed to
 * resolve rather than failing, so the chip can degrade to a bare clock.
 */
export interface AmbientData {
  /** Nearest city name, e.g. "Kochi". */
  city?: string;
  /** ISO 3166-1 alpha-2, e.g. "IN". */
  country?: string;
  /** IANA zone the coordinates resolve to, e.g. "Asia/Kolkata". */
  timeZone?: string;
  /** Degrees Celsius, rounded. */
  temperatureC?: number;
  /** WMO weather interpretation code — see ui/WeatherGlyph.tsx. */
  weatherCode?: number;
  isDay?: boolean;
}
