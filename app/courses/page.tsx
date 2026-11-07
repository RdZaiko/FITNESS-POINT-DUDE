import Link from "next/link";
import { Subpage } from "@/components/subpage";
import { CourseExplorer } from "@/components/course-explorer";
import { demoCourses } from "@/lib/education-content";
export const instant = false;

export default function CoursesPage() {
  return <Subpage eyebrow="A good place to begin" title={<>A course that fits <em>your next step.</em></>} description="Explore the existing mathematics, physics, and chemistry sample outlines. Course schedules and enrolment are confirmed with the teacher.">
    <div className="notice catalog-demo-note">Local preview catalogue · lesson counts and outlines are sample content. No class is booked or enrolled from this page.</div>
    <CourseExplorer courses={demoCourses}/>
    <div className="notice" style={{ marginTop: 24 }}>Ask about fees or current availability through the contact form. <Link className="under-link" href="/contact">Contact the teacher ↗</Link></div>
  </Subpage>;
}
