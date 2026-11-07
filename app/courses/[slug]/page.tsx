import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock3, GraduationCap, Layers3 } from "lucide-react";
import Link from "next/link";
import { CourseProgress } from "@/components/course-progress";
import { Subpage } from "@/components/subpage";
import { demoCourses } from "@/lib/education-content";

export const instant = false;
export function generateStaticParams() { return demoCourses.map(({ slug }) => ({ slug })); }

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = demoCourses.find((item) => item.slug === slug);
  if (!course) notFound();

  return <Subpage eyebrow={`${course.subject} · local sample outline`} title={<>{course.title}<br/><em>Make the ideas click.</em></>} description={course.description}>
    <div className="course-detail-topline"><Link href="/courses" className="under-link"><ArrowLeft size={14}/> All courses</Link><span className="badge orange">Sample curriculum · no enrolment</span></div>
    <div className="course-fact-strip"><span><GraduationCap size={16}/>{course.grade}</span><span><Layers3 size={16}/>{course.lessonCount} outline lessons</span><span><Clock3 size={16}/>{course.duration}</span><span>{course.difficulty}</span></div>
    <CourseProgress course={course}/>
    <div className="course-detail-contact"><div><span className="eyebrow light">CLASS TIMES & AVAILABILITY</span><h2>Talk through the right next step.</h2><p>Schedules and fees are not set in this preview. Ask the teacher before deciding.</p></div><Link href={`/contact?course=${encodeURIComponent(course.title)}`} className="button button-light">Ask about this class <ArrowUpRight size={15}/></Link></div>
  </Subpage>;
}
