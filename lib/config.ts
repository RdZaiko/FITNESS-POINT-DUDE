/** Local-only preview: the app has no authentication or database service. */
export function isLocalDemoMode() {
  return process.env.NODE_ENV !== "production";
}

export const hasMuxConfig = Boolean(
  process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET,
);

export function isDemoEnabled() {
  return isLocalDemoMode();
}
