"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, Clock3, Search, SlidersHorizontal } from "lucide-react";
import type { LearningCourse } from "@/lib/education-content";

export function CourseExplorer({ courses }: { courses: LearningCourse[] }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All subjects");
  const [grade, setGrade] = useState("All grades");
  const [sort, setSort] = useState("recommended");
  const subjects = useMemo(() => ["All subjects", ...new Set(courses.map((course) => course.subject))], [courses]);
  const grades = useMemo(() => ["All grades", ...new Set(courses.map((course) => course.grade))], [courses]);
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return courses
      .filter((course) => (subject === "All subjects" || course.subject === subject))
      .filter((course) => (grade === "All grades" || course.grade === grade))
      .filter((course) => !term || `${course.subject} ${course.title} ${course.grade} ${course.description}`.toLowerCase().includes(term))
      .sort((a, b) => sort === "title" ? a.title.localeCompare(b.title) : sort === "lessons" ? b.lessonCount - a.lessonCount : 0);
  }, [courses, grade, query, sort, subject]);

  return <div className="course-explorer">
    <div className="catalog-toolbar" aria-label="Course filters">
      <label className="catalog-search"><span className="sr-only">Search courses</span><Search size={17} aria-hidden="true"/><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a subject or topic"/></label>
      <label><span className="sr-only">Filter by subject</span><select value={subject} onChange={(event) => setSubject(event.target.value)}>{subjects.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span className="sr-only">Filter by grade</span><select value={grade} onChange={(event) => setGrade(event.target.value)}>{grades.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="catalog-sort"><SlidersHorizontal size={15} aria-hidden="true"/><span className="sr-only">Sort courses</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Recommended</option><option value="title">Title A–Z</option><option value="lessons">Most lessons</option></select></label>
    </div>
    <p className="catalog-result-count" aria-live="polite">{visible.length} sample {visible.length === 1 ? "course" : "courses"}</p>
    {visible.length ? <div className="catalog-grid">{visible.map((course, index) => <article className="catalog-card" key={course.slug}>
      <Link href={`/courses/${course.slug}`} className="catalog-image-link" aria-label={`View ${course.title}`}><Image src={course.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw" loading={index === 0 ? "eager" : "lazy"}/><span className="catalog-image-tag">{course.subject}</span></Link>
      <div className="catalog-card-content"><span className="eyebrow"><BookOpen size={14} aria-hidden="true"/>{course.grade}</span><h2><Link href={`/courses/${course.slug}`}>{course.title}</Link></h2><p>{course.description}</p>
        <div className="catalog-meta"><span><BookOpen size={14}/>{course.lessonCount} example lessons</span><span><Clock3 size={14}/>{course.duration}</span></div>
        <Link href={`/courses/${course.slug}`} className="under-link">View course outline <ArrowUpRight size={15}/></Link>
      </div>
    </article>)}</div> : <div className="empty-state catalog-empty"><Search size={20}/><h2>No matching courses</h2><p>Try another subject, grade, or search term.</p><button className="small-button" onClick={() => { setQuery(""); setSubject("All subjects"); setGrade("All grades"); }}>Clear filters</button></div>}
  </div>;
}
