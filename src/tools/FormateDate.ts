export function formatDate(date: string) {
  return new Date(date).toLocaleString("en-EN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
export function formatDateTime(date: string) {
  return new Date(date).toLocaleString("en-EN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
