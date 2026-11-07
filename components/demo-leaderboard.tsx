"use client";

import { useMemo, useState } from "react";
import { Award, BookOpen, Crown, Flame, Medal, Trophy } from "lucide-react";
import type { DemoLearner } from "@/lib/education-content";

type Period = "week" | "all-time";

export function DemoLeaderboard({ learners, studentPreview }: { learners: DemoLearner[]; studentPreview: boolean }) {
  const [period, setPeriod] = useState<Period>("week");
  const [subject, setSubject] = useState("All subjects");
  const ranked = useMemo(() => learners
    .filter((learner) => subject === "All subjects" || learner.subject === subject)
    .sort((a, b) => (period === "week" ? b.weeklyPoints - a.weeklyPoints : b.totalPoints - a.totalPoints)), [learners, period, subject]);
  const current = ranked.find((learner) => learner.id === "learner-3");

  return <div className="leaderboard-shell">
    <div className="demo-disclosure"><span className="demo-disclosure-mark">i</span><p><b>Demo leaderboard only.</b> All names, points, streaks, and badges are synthetic examples; no real student results or personal data are shown.</p></div>
    <div className="leaderboard-controls">
      <div className="leaderboard-period" role="group" aria-label="Leaderboard period"><button type="button" aria-pressed={period === "week"} onClick={() => setPeriod("week")}>This week</button><button type="button" aria-pressed={period === "all-time"} onClick={() => setPeriod("all-time")}>All time</button></div>
      <label>Subject<select value={subject} onChange={(event) => setSubject(event.target.value)}><option>All subjects</option><option>Mathematics</option><option>Physics</option><option>Chemistry</option></select></label>
    </div>
    {ranked.length >= 3 && subject === "All subjects" && <div className="leader-podium" aria-label="Top three sample learners">
      {[ranked[1], ranked[0], ranked[2]].map((learner, index) => { const place = index === 1 ? 1 : index === 0 ? 2 : 3; const isYou = studentPreview && learner.id === "learner-3"; const Icon = place === 1 ? Crown : place === 2 ? Medal : Award; return <article className={`podium-place podium-place-${place}`} key={learner.id}><span className="podium-medal"><Icon size={22}/></span><span className="podium-rank">0{place}</span><b>{isYou ? "You · Aarav" : learner.name}</b><small>{(period === "week" ? learner.weeklyPoints : learner.totalPoints).toLocaleString("en-IN")} example points</small><div className="podium-block" aria-hidden="true"/></article>; })}
    </div>}
    <div className="leaderboard-list" aria-live="polite">
      {ranked.length ? ranked.map((learner, index) => { const isYou = studentPreview && learner.id === "learner-3"; const points = period === "week" ? learner.weeklyPoints : learner.totalPoints; return <article className={`leaderboard-row${isYou ? " leaderboard-row-you" : ""}`} key={learner.id}>
        <span className="leader-rank">{String(index + 1).padStart(2, "0")}</span><span className="leader-avatar" aria-hidden="true">{learner.name.slice(0, 1)}</span><div className="leader-person"><b>{isYou ? "Aarav · your sample account" : learner.name}</b><small><BookOpen size={12}/>{learner.subject} · {learner.badge}</small></div><div className="leader-score"><b>{points.toLocaleString("en-IN")}</b><small>demo points</small></div>
      </article>; }) : <div className="empty-state"><Trophy size={20}/><h2>No demo learners for this subject</h2><p>Choose a different filter to see the synthetic example board.</p></div>}
    </div>
    {studentPreview && current && <aside className="your-rank-card"><span className="rank-icon"><Flame size={17}/></span><div><small>YOUR SAMPLE PREVIEW POSITION</small><b>Rank #{ranked.findIndex((learner) => learner.id === current.id) + 1} · {current[period === "week" ? "weeklyPoints" : "totalPoints"].toLocaleString("en-IN")} demo points</b></div></aside>}
  </div>;
}
