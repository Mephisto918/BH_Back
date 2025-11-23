export function hasNullOrUndefinedDeep(obj: any): boolean {
  if (obj === null || obj === undefined) return true;
  if (typeof obj !== 'object') return false;
  return Object.values(obj).some((value) => hasNullOrUndefinedDeep(value));
}
