import type { ReactNode } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { Reveal } from "@/components/reveal";

export function Subpage({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description: string; children: ReactNode }) {
  return <div className="subpage"><SiteNav/><Reveal><header className="page-hero wrap"><span className="eyebrow"><span className="eyebrow-line"/>{eyebrow}</span><h1>{title}</h1><p>{description}</p></header></Reveal><Reveal><main className="page-content wrap">{children}</main></Reveal><footer className="wrap footer-bottom footer-compact"><span>© 2026 The Learning Room · Thoughtful teaching for bright futures</span><span/><Link href="/">Back to home ↗</Link></footer></div>;
}
