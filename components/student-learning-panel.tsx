"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, Check, Flame, Goal, Sparkles } from "lucide-react";

const courseSlug = "mathematics-made-clear";
const courseProgressKey = `learning-room-preview:${courseSlug}:completed`;
const goalKey = "learning-room-preview:weekly-goal";
const courseLessons = [
  { id: "number-patterns", title: "Patterns, variables & expressions" },
  { id: "linear-equations", title: "Linear equations, one step at a time" },
  { id: "coordinate-graphs", title: "Reading a graph with confidence" },
  { id: "quadratic-intro", title: "A first look at quadratic patterns" },
];

export function StudentLearningPanel() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [goal, setGoal] = useState(4);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored: unknown = JSON.parse(localStorage.getItem(courseProgressKey) ?? "[]");
        if (Array.isArray(stored)) setCompleted(stored.filter((item): item is string => typeof item === "string"));
        const savedGoal = Number(localStorage.getItem(goalKey));
        if (Number.isInteger(savedGoal) && savedGoal >= 1 && savedGoal <= 7) setGoal(savedGoal);
      } catch { /* Keep the accessible default preview when browser storage is blocked. */ }
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleNextCheckpoint(id: string) {
    const next = completed.includes(id) ? completed.filter((item) => item !== id) : [...completed, id];
    setCompleted(next);
    try { localStorage.setItem(courseProgressKey, JSON.stringify(next)); } catch { /* Local storage is optional. */ }
  }

  function changeGoal(value: number) {
    setGoal(value);
    try { localStorage.setItem(goalKey, String(value)); } catch { /* Local storage is optional. */ }
  }

  const nextLesson = courseLessons.find((lesson) => !completed.includes(lesson.id));
  const percent = Math.round((completed.length / courseLessons.length) * 100);

  return <section className="student-learning-panel" aria-labelledby="learning-progress-title">
    <div className="student-panel-heading"><div><span className="eyebrow"><span className="eyebrow-line"/> YOUR LOCAL LEARNING PREVIEW</span><h2 id="learning-progress-title">Small steps add up.</h2><p>Progress and goals are stored only in this browser.</p></div><Link href={`/courses/${courseSlug}`} className="under-link">Open course outline <ArrowUpRight size={15}/></Link></div>
    <div className="learning-widget-grid">
      <article className="learning-widget learning-progress-widget"><div className="learning-widget-title"><span className="learning-widget-icon"><BookOpen size={17}/></span><span>Continue learning</span></div><h3>{courseLessons[0].title.split(" &")[0]} · Mathematics</h3><p>{completed.length} of {courseLessons.length} sample checkpoints marked complete</p><div className="course-progress-meter"><div className="course-progress-label"><span>Local course progress</span><b>{ready ? percent : 0}%</b></div><div className="progress-track" role="meter" aria-label="Mathematics local course progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={ready ? percent : 0}><span style={{ width: `${ready ? percent : 0}%` }}/></div></div>
        {nextLesson ? <button className="small-button checkpoint-action" onClick={() => toggleNextCheckpoint(nextLesson.id)}><Check size={14}/> Mark next preview checkpoint</button> : <p className="checkpoint-complete"><Sparkles size={14}/> All example checkpoints complete</p>}
        {nextLesson && <p className="next-lesson-note">Next: {nextLesson.title}</p>}
      </article>
      <article className="learning-widget goal-widget"><div className="learning-widget-title"><span className="learning-widget-icon gold"><Goal size={17}/></span><span>Weekly study goal</span></div><h3>{goal} sessions</h3><p>Choose a gentle target for your preview week.</p><div className="goal-choice-row" role="group" aria-label="Choose a weekly study goal">{[2, 4, 5, 7].map((value) => <button key={value} className={goal === value ? "goal-choice is-selected" : "goal-choice"} aria-pressed={goal === value} onClick={() => changeGoal(value)}>{value}</button>)}</div><small>Saved in this browser only</small></article>
      <article className="learning-widget streak-widget"><div className="learning-widget-title"><span className="learning-widget-icon coral"><Flame size={17}/></span><span>Preview habits</span></div><h3>Keep it kind.</h3><p>One short study session is a good start. Sample streaks and awards aren’t real activity records.</p><div className="sample-badges"><span><Sparkles size={14}/> Curious mind · sample</span><span><Check size={14}/> First step · sample</span></div></article>
    </div>
    <div className="activity-example"><div className="activity-example-heading"><div><span className="eyebrow">EXAMPLE STUDY RHYTHM</span><h3>One week, at a glance</h3></div><span className="badge orange">Illustrative</span></div><div className="activity-bars" role="img" aria-label="Illustrative example activity by day, not personal study history">{[28, 52, 38, 72, 44, 90, 24].map((height, index) => <div className="activity-day" key={index}><span className="activity-bar"><i style={{ height: `${height}%` }}/></span><small>{["M", "T", "W", "T", "F", "S", "S"][index]}</small></div>)}</div></div>
  </section>;
}
