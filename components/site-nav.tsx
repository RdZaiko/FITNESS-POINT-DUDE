import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Menu } from "lucide-react";
import { getBrandData } from "@/lib/branding";

export async function SiteNav() {
  const brand=await getBrandData();
  return <header className="nav sub-nav wrap site-nav">
    <Link href="/" className="brand">{brand.logoUrl?<Image src={brand.logoUrl} alt={`${brand.brandName} logo`} width={40} height={40} unoptimized className="brand-logo"/>:<span className="brand-mark"><GraduationCap size={22}/></span>}<span>{brand.brandName}<small>{brand.teacherName==="Your teacher"?"ONLINE TUITION":`WITH ${brand.teacherName}`}</small></span></Link>
    <nav className="desktop-nav" aria-label="Main navigation"><Link href="/courses">Courses</Link><Link href="/teachers">Teachers</Link><Link href="/#how-it-works">How it works</Link><Link href="/leaderboard">Leaderboard</Link></nav>
    <div className="nav-actions"><Link className="text-link" href="/about">About</Link><Link className="button button-ink nav-cta" href="/login">Student preview</Link></div>
    <details className="mobile-menu"><summary aria-label="Open main navigation"><Menu aria-hidden="true"/><span>Menu</span></summary><nav aria-label="Main navigation"><Link href="/courses">Courses</Link><Link href="/teachers">Teachers</Link><Link href="/leaderboard">Leaderboard</Link><Link href="/#how-it-works">How it works</Link><Link href="/#fees">Fees &amp; plans</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/login">Preview login</Link><Link className="mobile-menu-cta" href="/login">Open student preview <span aria-hidden="true">↗</span></Link></nav></details>
  </header>
}
