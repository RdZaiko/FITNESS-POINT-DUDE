import type { MetadataRoute } from "next";
import { gym } from "@/lib/gym-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? gym.siteUrl;
  return [{ url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
