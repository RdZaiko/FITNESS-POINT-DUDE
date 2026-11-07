"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, CalendarDays, GraduationCap, Star } from "lucide-react";
import type { DemoTeacher } from "@/lib/education-content";

export function TeacherDirectory({ teachers }: { teachers: DemoTeacher[] }) {
  const [subject, setSubject] = useState("All subjects");
  const [rating, setRating] = useState("any");
  const [sort, setSort] = useState("rating");
  const visible = useMemo(() => teachers
    .filter((teacher) => subject === "All subjects" || teacher.subject === subject)
    .filter((teacher) => rating === "any" || teacher.sampleRating >= Number(rating))
    .sort((a, b) => sort === "experience" ? b.sampleExperience - a.sampleExperience : b.sampleRating - a.sampleRating), [rating, sort, subject, teachers]);

  return <div className="teacher-directory">
    <div className="demo-disclosure"><span className="demo-disclosure-mark">i</span><p><b>Illustrative demo profiles.</b> Names, ratings, experience, profile details, and availability below are synthetic design examples—not real tutors, credentials, verified reviews, or bookings.</p></div>
    <div className="teacher-filters" aria-label="Teacher directory filters">
      <label>Subject<select value={subject} onChange={(event) => setSubject(event.target.value)}><option>All subjects</option>{teachers.map((teacher) => <option key={teacher.id}>{teacher.subject}</option>)}</select></label>
      <label>Sample rating<select value={rating} onChange={(event) => setRating(event.target.value)}><option value="any">Any example score</option><option value="4.8">4.8 and above</option><option value="4.7">4.7 and above</option></select></label>
      <label>Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="rating">Illustrative rating</option><option value="experience">Illustrative experience</option></select></label>
    </div>
    <p className="catalog-result-count" aria-live="polite">Showing {visible.length} sample {visible.length === 1 ? "profile" : "profiles"}</p>
    {visible.length ? <div className="teacher-grid">{visible.map((teacher, index) => <article className="teacher-card" key={teacher.id}>
      <div className={`teacher-avatar teacher-avatar-${index % 3}`} aria-hidden="true"><span>{teacher.avatar}</span><i><GraduationCap size={18}/></i></div>
      <div className="teacher-card-heading"><span className="badge">Sample profile</span><div className="sample-score"><Star size={14} fill="currentColor"/><b>{teacher.sampleRating.toFixed(1)}</b><span>synthetic example</span></div></div>
      <h2>{teacher.name}</h2><p className="teacher-subject">{teacher.subject} <span>·</span> {teacher.grades}</p><p className="teacher-focus">{teacher.focus}</p>
      <div className="teacher-facts"><span><BookOpen size={15}/>{teacher.subject}</span><span><CalendarDays size={15}/>{teacher.sampleExperience}-year sample bio</span></div>
      <details className="teacher-profile-details"><summary>View sample profile</summary><div className="teacher-profile-body"><p>This profile is placeholder content for local design review. Real qualifications, teaching history, availability, and contact details have not been provided.</p><div className="review-placeholder"><div aria-label="Illustrative five star review card" className="review-stars">★★★★★</div><b>Review display preview</b><p>Consented student and family feedback will appear here when real reviews are collected.</p></div></div></details>
      <Link className="button button-ink teacher-book-link" href={`/contact?teacher=${encodeURIComponent(teacher.name)}`}>Ask about a trial <ArrowUpRight size={15}/></Link>
    </article>)}</div> : <div className="empty-state"><h2>No profiles match those filters</h2><p>Choose another subject or rating threshold.</p><button className="small-button" onClick={() => { setSubject("All subjects"); setRating("any"); }}>Clear filters</button></div>}
    <p className="directory-footnote">The contact link opens the existing email-based enquiry form; it does not reserve or confirm a lesson.</p>
  </div>;
}
