/**
 * Terminal command normalization and pattern matching utilities.
 * Validates commands safely WITHOUT running eval() or exec().
 */

/**
 * Normalizes user input for relaxed, robust comparison:
 * - Trims leading & trailing whitespace
 * - Converts to lowercase
 * - Normalizes curly and single quotes to standard double quotes '"'
 * - Collapses consecutive spaces into a single space
 */
export function normalizeCommand(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .toLowerCase()
    .replace(/[\u201c\u201d\u2018\u2019"']/g, '"')
    .replace(/\s+/g, ' ');
}

/**
 * Checks if normalized input matches any of the provided regex patterns.
 * Patterns can be regular expressions encoded as strings (e.g., `^print\\s*\\(`).
 */
export function testCommandPattern(input: string, patterns: string[]): boolean {
  const normalized = normalizeCommand(input);
  if (!normalized) return false;

  for (const patternStr of patterns) {
    try {
      const regex = new RegExp(patternStr, 'i');
      if (regex.test(normalized)) {
        return true;
      }
      // Also test against trimmed lowercase raw input in case raw spacing matters
      if (regex.test(input.trim().toLowerCase())) {
        return true;
      }
    } catch {
      // If regex syntax fails, fall back to simple substring or exact equality
      if (normalized === normalizeCommand(patternStr)) {
        return true;
      }
    }
  }

  return false;
}
