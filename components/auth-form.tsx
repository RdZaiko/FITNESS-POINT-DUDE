"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isLocalDemoMode } from "@/lib/config";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const isRegister = mode === "register";

  async function demoLogin(role: "teacher" | "student") {
    if (!isLocalDemoMode()) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/demo-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "The demo preview could not be opened.");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The demo preview could not be opened.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="form-card">
      <span className="eyebrow"><span className="eyebrow-line" /> {isRegister ? "A lovely place to start" : "Welcome back"}</span>
      <h2>{isRegister ? "Create your student account" : "Good to have you back."}</h2>
      <p>{isRegister ? "Make an account to join your batch and keep your learning in one place." : "Sign in to pick up right where you left off."}</p>
      <div className="notice" role="status">
        {isLocalDemoMode()
          ? "Local preview mode is on. Real sign-in and registration are unavailable; preview data is synthetic and is not saved."
          : "Account sign-in is unavailable because this app is running without an authentication service."}
      </div>
      {isLocalDemoMode() && (
        <div style={{ marginTop: 16 }}>
          <p className="form-note">Local preview · synthetic sample accounts</p>
          {isRegister ? (
            <p className="form-note">To preview the classroom, open the <Link href="/login" style={{ color: "#31563f" }}>login page</Link> and choose a sample role.</p>
          ) : (
            <div className="action-row">
              <button className="small-button" onClick={() => demoLogin("student")} disabled={busy}>Preview as student</button>
              <button className="small-button" onClick={() => demoLogin("teacher")} disabled={busy}>Preview as teacher</button>
            </div>
          )}
        </div>
      )}
      {message && <div className="form-message" role="status">{message}</div>}
      <p className="form-note">{isRegister ? <>Already have an account? <Link href="/login" style={{ color: "#31563f" }}>Log in</Link></> : <>New to the Learning Room? <Link href="/register" style={{ color: "#31563f" }}>Create a student account</Link></>}</p>
    </div>
  );
}
