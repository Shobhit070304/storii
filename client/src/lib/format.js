const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** "3 hours ago", "12 days ago", then a plain date once it stops mattering. */
export function timeAgo(timestamp) {
  if (!timestamp) return "";
  const time = typeof timestamp === "string" ? new Date(timestamp).getTime() : Number(timestamp);
  if (isNaN(time)) return "";
  const seconds = Math.max(1, Math.round((Date.now() - time) / 1000));

  if (seconds < 90) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.round(hours / 24);
  if (days < 8) return `${days} ${days === 1 ? "day" : "days"} ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  return shortDate(time);
}

/** "28 September", with the year only when it isn't this one. */
export function shortDate(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "";
  const year =
    date.getFullYear() === new Date().getFullYear()
      ? ""
      : ` ${date.getFullYear()}`;
  return `${date.getDate()} ${MONTHS[date.getMonth()]}${year}`;
}

/** "Sunday, 28 September 2026" — the dateline under the masthead. */
export function dateline(timestamp = Date.now()) {
  const date = new Date(timestamp);
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${
    MONTHS[date.getMonth()]
  } ${date.getFullYear()}`;
}

/** "Maya Rodrigues" → "MR" */
export function initials(name) {
  if (!name) return "?";
  const parts = String(name).trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "?";
}

export function plural(count, singular, pluralForm) {
  return `${count} ${count === 1 ? singular : pluralForm || `${singular}s`}`;
}

/** Split an answer body into paragraphs. */
export function paragraphs(text) {
  return String(text || "")
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * How a question or an experience is signed on the page: the author's name,
 * or "Anonymous" when it was shared without one.
 */
export function signedBy(entry) {
  if (!entry) return "Anonymous";
  if (entry.anonymous) return "Anonymous";
  return entry.authorName || "Anonymous";
}
