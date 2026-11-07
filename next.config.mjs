// @ts-check

/** @type {import("next").NextConfig} */
const nextConfig = {
  /* config options here */
  // Use an app-owned cache folder; the old .next folder had restrictive
  // Windows/OneDrive permissions that prevented Next from creating API output.
  distDir: process.env.NEXT_DIST_DIR || ".next-localdev",
  cacheComponents: true,
  partialPrefetching: true,
  devIndicators: false,
  async redirects() {
    const legacySections = [
      "/about", "/contact", "/courses/:path*", "/teachers", "/leaderboard",
      "/dashboard/:path*", "/login", "/register", "/api/:path*",
    ];
    return [
      ...legacySections.map((source) => ({ source, destination: "/", permanent: false })),
      { source: "/dashboard", destination: "/", permanent: false },
      { source: "/courses", destination: "/", permanent: false },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ] }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
