"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, FileText, GraduationCap, LayoutDashboard, Menu, Megaphone, Settings, Trophy, Users, Video } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/teachers", label: "Teacher examples", icon: GraduationCap },
  { href: "/leaderboard", label: "Demo leaderboard", icon: Trophy },
  { href: "/dashboard/courses", label: "Courses & batches", icon: BookOpen },
  { href: "/dashboard/lessons", label: "Recorded lessons", icon: Video },
  { href: "/dashboard/live", label: "Live classes", icon: CalendarDays },
  { href: "/dashboard/announcements", label: "Announcements", icon: Megaphone },
  { href: "/dashboard/materials", label: "Study materials", icon: FileText },
  { href: "/dashboard/students", label: "Students", icon: Users, teacher: true },
  { href: "/dashboard/settings", label: "Profile & settings", icon: Settings },
];

export function PortalNavigation({ role }: { role: "teacher" | "student" }) {
  const pathname = usePathname();
  const visibleLinks = links.filter((item) => !item.teacher || role === "teacher");
  const renderLinks = (mobile = false) => visibleLinks.map(({ href, label, icon: Icon }) => {
    const active = href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
    return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`side-link${active ? " active" : ""}`} onClick={mobile ? (event) => { const menu = event.currentTarget.closest("details"); if (menu) menu.open = false; } : undefined}><Icon aria-hidden="true"/><span>{label}</span></Link>;
  });

  return <>
    <nav className="sidebar-nav" aria-label="Learning portal">{renderLinks()}</nav>
    <details className="portal-mobile-nav">
      <summary aria-label="Open portal navigation"><Menu aria-hidden="true"/><span>Menu</span></summary>
      <nav aria-label="Learning portal">{renderLinks(true)}</nav>
    </details>
  </>;
}
