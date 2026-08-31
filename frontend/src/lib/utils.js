export function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function formatSalary(value) {
  if (value === undefined || value === null || value === "") return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return `৳${n.toLocaleString("en-IN")}`;
}

export function timeAgo(dateString) {
  if (!dateString) return "";
  const then = new Date(dateString).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export function csvToArray(str = "") {
  return str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
