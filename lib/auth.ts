import { cookies } from "next/headers";
import { isDemoEnabled } from "@/lib/config";

export type UserContext = { id: string; role: "teacher" | "student"; teacherId: string | null; displayName: string | null; demo: boolean };

export async function getUserContext(): Promise<UserContext | null> {
  if (isDemoEnabled() && (await cookies()).get("learning-room-demo")?.value === "teacher") {
    return { id: "demo-teacher", role: "teacher", teacherId: "demo-teacher", displayName: "Ananya Sharma", demo: true };
  }
  if (isDemoEnabled() && (await cookies()).get("learning-room-demo")?.value === "student") {
    return { id: "demo-student", role: "student", teacherId: "demo-teacher", displayName: "Aarav Mehta", demo: true };
  }
  return null;
}
import "server-only";
