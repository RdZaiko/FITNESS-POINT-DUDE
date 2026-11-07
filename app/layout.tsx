import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { gym } from "@/lib/gym-config";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? gym.siteUrl),
  title: `${gym.name} | Fitness & Training in New Delhi`,
  description: gym.description,
  openGraph: {
    title: `${gym.name} | ${gym.tagline}`,
    description: gym.description,
    siteName: gym.name,
    type: "website",
  },
  twitter: { card: "summary", title: `${gym.name} | ${gym.tagline}`, description: gym.description },
  icons: { icon: "/fitness-mark.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const brandStyle = {
    "--bg": gym.brandColors.background,
    "--white": gym.brandColors.text,
    "--red": gym.brandColors.accent,
  } as CSSProperties;
  return <html lang="en" style={brandStyle}><body>{children}</body></html>;
}
