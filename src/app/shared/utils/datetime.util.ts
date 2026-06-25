/** Converts a datetime-local input value to ISO-8601 local format for the API. */
export function toApiDateTime(value: string): string {
  if (!value) {
    return value;
  }
  // datetime-local: "YYYY-MM-DDTHH:mm" → "YYYY-MM-DDTHH:mm:00"
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return `${value}:00`;
  }
  return value;
}
