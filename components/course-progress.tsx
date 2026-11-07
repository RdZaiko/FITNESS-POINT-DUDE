"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Check, Circle, Clock3, NotebookPen } from "lucide-react";
import type { LearningCourse } from "@/lib/education-content";

function progressKey(slug: string) { return `learning-room-preview:${slug}:completed`; }
function notesKey(slug: string) { return `learning-room-preview:${slug}:notes`; }

export function CourseProgress({ course }: { course: LearningCourse }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const percent = useMemo(() => Math.round((completed.length / course.lessons.length) * 100), [completed.length, course.lessons.length]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const savedItems: unknown = JSON.parse(localStorage.getItem(progressKey(course.slug)) ?? "[]");
        if (Array.isArray(savedItems)) setCompleted(savedItems.filter((item): item is string => typeof item === "string"));
        setNotes(localStorage.getItem(notesKey(course.slug)) ?? "");
      } catch { /* A blocked or invalid local preview store starts empty. */ }
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [course.slug]);

  function toggleLesson(id: string) {
    const next = completed.includes(id) ? completed.filter((item) => item !== id) : [...completed, id];
    setCompleted(next);
    try { localStorage.setItem(progressKey(course.slug), JSON.stringify(next)); setSaved(true); } catch { setSaved(false); }
  }

  function updateNotes(value: string) {
    setNotes(value);
    try { localStorage.setItem(notesKey(course.slug), value); setSaved(true); } catch { setSaved(false); }
  }

  return <div className="course-detail-grid">
    <section className="course-outline-card">
      <div className="course-detail-section-heading"><div><span className="eyebrow"><span className="eyebrow-line"/> SAMPLE CURRICULUM</span><h2>A clear path, one lesson at a time.</h2></div><span className="course-outline-count">{completed.length}/{course.lessons.length} preview checkpoints</span></div>
      <div className="course-progress-meter"><div className="course-progress-label"><span>Local preview progress</span><b>{percent}%</b></div><div className="progress-track" role="meter" aria-label={`${course.title} local preview progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{ width: `${percent}%` }}/></div></div>
      <ol className="course-lesson-list">{course.lessons.map((lesson, index) => { const done = completed.includes(lesson.id); return <li className={done ? "lesson-checkpoint is-complete" : "lesson-checkpoint"} key={lesson.id}>
        <button type="button" className="lesson-check-button" aria-pressed={done} onClick={() => toggleLesson(lesson.id)} aria-label={`${done ? "Mark incomplete" : "Mark complete"}: ${lesson.title}`}>{done ? <Check size={17}/> : <Circle size={17}/>}</button>
        <div className="lesson-check-content"><span className="lesson-check-index">LESSON {String(index + 1).padStart(2, "0")}</span><h3>{lesson.title}</h3><p>{lesson.summary}</p></div><span className="lesson-check-duration"><Clock3 size={14}/>{lesson.duration}</span>
      </li>; })}</ol>
      <p className="local-save-note" aria-live="polite">{ready ? saved ? "Saved in this browser only." : "Progress stays on this device; it is not sent to a server." : "Loading your local preview progress…"}</p>
    </section>
    <aside className="course-detail-aside"><div className="course-detail-art"><Image src={course.image} alt="" fill sizes="(max-width: 760px) 100vw, 38vw"/><span className="course-detail-art-stamp"><NotebookPen size={16}/> Sample course</span></div>
      <section className="course-objectives"><span className="eyebrow">WHAT YOU’LL PRACTISE</span><ul>{course.objectives.map((objective) => <li key={objective}><Check size={15}/><span>{objective}</span></li>)}</ul></section>
      <label className="course-notes-label" htmlFor="course-notes">Your private preview notes</label><textarea id="course-notes" value={notes} onChange={(event) => updateNotes(event.target.value)} rows={5} maxLength={1200} placeholder="Jot down one question or idea…"/><p className="local-save-note">Notes save only in this browser.</p>
    </aside>
  </div>;
}
