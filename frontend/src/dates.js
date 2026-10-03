// Small date helpers. The backend sends times like "2026-10-12T10:00:00" (no timezone).

export function dateKey(d) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function nextDays(count) {
  const days = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

export function timeLabel(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function dateLabel(iso) {
  return new Date(iso).toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
}
