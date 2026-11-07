"use client";
import { useRouter } from "next/navigation";
export function LogoutButton(){const router=useRouter();return <button className="logout-button" onClick={async()=>{await fetch("/api/logout",{method:"POST"});router.push("/");router.refresh();}}>Log out ↗</button>}
