/**
 * Represents the parsed components of an ISO date string.
 */
export type DateParts = {
  /** The full year (e.g., 2025) */
  year: number;
  /** The month of the year (1-12) */
  month: number;
  /** The day of the month (1-31) */
  day: number;
  /** The hour of the day in UTC (0-23) */
  hours: number;
  /** The minute of the hour in UTC (0-59) */
  minutes: number;
  /** The second of the minute in UTC (0-59) */
  seconds: number;
  /** Milliseconds of the date (0-999) */
  milliseconds: number;
  /** The original ISO string passed to the parser */
  iso: string;
  /** The native JavaScript Date object representing the same time */
  date: Date;
  /** YYYY-MM-DD */
  dateOnly: string;
  /** Time string in HH:MM:SS (UTC) */
  time: string;
  /** Formatted string in YYYY-MM-DD HH:MM:SS (UTC) */
  formatted: string;
};

/**
 * Parses an ISO date string into a detailed object with individual date components.
 *
 * @param isoString - The ISO string to parse (e.g., "2025-08-18T18:39:47.537Z").
 * @returns A DateParts object containing breakdowns of the date/time or `undefined` if input is falsy.
 *
 * @example
 * const parsed = parseIsoDate("2025-08-18T18:39:47.537Z");
 * console.log(parsed.formatted); // "2025-08-18 18:39:47"
 * console.log(parsed.year); // 2025
 * console.log(parsed.date); // JavaScript Date object
 */
export function parseIsoDate(isoString?: string): DateParts | undefined {
  if (!isoString) return undefined;

  const date = new Date(isoString);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1, // JS months are 0-indexed
    day: date.getUTCDate(),
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
    seconds: date.getUTCSeconds(),
    milliseconds: date.getUTCMilliseconds(),
    iso: isoString,
    date,
    dateOnly: `${date.getUTCFullYear()} ${pad(date.getUTCMonth() + 1)} ${pad(date.getUTCDate())}`,
    time: `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`,
    formatted: `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
      date.getUTCDate(),
    )} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`,
  };
}
