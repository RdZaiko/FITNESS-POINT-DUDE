import type { MetadataRoute } from "next";
import { gym } from "@/lib/gym-config";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? gym.siteUrl;
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${base}/sitemap.xml` };
}
