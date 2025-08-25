/**
 * Transforms a backend enum-like string to human-readable format.
 * Example: "BUSINESS_PERMIT" => "Business Permit"
 */
export function transformUppercaseSnakeCase(label: string): string {
  if (!label) return '';

  return label
    .toLowerCase() // business_permit
    .split('_') // ["business", "permit"]
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // ["Business", "Permit"]
    .join(' '); // "Business Permit"
}
