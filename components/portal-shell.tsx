import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { getUserContext } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { PortalNavigation } from "@/components/portal-navigation";
import { Reveal } from "@/components/reveal";

export async function PortalShell({ children }: { children: React.ReactNode }) {
  const user = await getUserContext();
  if (!user) redirect("/login");
  const name = user.displayName?.trim() || (user.role === "teacher" ? "Teacher" : "Student");
  return <div className="portal-page"><div className="portal-layout"><aside className="sidebar"><div className="sidebar-header"><Link href="/" className="brand"><span className="brand-mark"><GraduationCap size={19}/></span><span>The Learning<span className="brand-serif"> Room</span><small>LEARNING PORTAL</small></span></Link></div><div className="sidebar-label">YOUR CLASSROOM</div><PortalNavigation role={user.role}/><div className="sidebar-foot">{user.demo ? "Demo preview · synthetic content" : user.role === "teacher" ? "Teacher workspace" : "Student workspace"}<div style={{marginTop:9}}><LogoutButton/></div></div></aside><div className="portal-main"><header className="portal-topbar"><span>{user.role === "teacher" ? "Teacher workspace" : "Your learning space"}</span><div className="top-user"><span className="top-avatar" aria-hidden="true">{name.charAt(0).toUpperCase()}</span><span>{name}{user.demo ? " · Demo" : ""}</span></div></header><main>{user.demo && <div className="demo-banner portal-demo-banner">Demo preview · all data is synthetic; Account access, saved data, and video are unavailable in this local-only preview.</div>}<Reveal className="portal-body">{children}</Reveal></main></div></div></div>
}
