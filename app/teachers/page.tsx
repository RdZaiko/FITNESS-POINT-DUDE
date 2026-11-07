import { Subpage } from "@/components/subpage";
import { TeacherDirectory } from "@/components/teacher-directory";
import { demoTeachers } from "@/lib/education-content";

export const instant = false;

export default function TeachersPage() {
  return <Subpage eyebrow="Meet the teaching approach" title={<>Thoughtful teaching.<br/><em>Clear next steps.</em></>} description="Explore how a sample tutor profile can help families understand teaching style, subjects, and class fit.">
    <TeacherDirectory teachers={demoTeachers}/>
  </Subpage>;
}
