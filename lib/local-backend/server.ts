/**
 * Compatibility boundary for pages and API handlers that still have a remote
 * data branch. The remote backend has been removed; this always returns null.
 * Development pages use the explicitly synthetic preview data instead.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createClient(): Promise<any> {
  return null;
}
