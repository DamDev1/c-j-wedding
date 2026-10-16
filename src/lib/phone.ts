/**
 * Normalizes user input phone numbers into 11-digit Nigerian format:
 * - strips all non-numeric characters (spaces, dashes, plus sign, etc.)
 * - converts +234 or 234 prefixes to standard local 0XXXXXXXXXX format
 * - prepends 0 if user enters 10 digits without leading 0
 */
export function normalizePhoneNumber(raw: string): string {
  if (!raw) return "";
  let cleaned = raw.replace(/\D/g, "");

  // If starts with international country code 234
  if (cleaned.startsWith("234")) {
    cleaned = cleaned.slice(3);
  }

  // Ensure standard Nigerian mobile 0 prefix
  if (!cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "0" + cleaned;
  }

  return cleaned;
}
