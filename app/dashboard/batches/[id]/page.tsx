import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, FileText, Video } from "lucide-react";
import { getUserContext } from "@/lib/auth";
import { createClient } from "@/lib/local-backend/server";
import { BatchControls, LessonControls } from "@/components/batch-controls";
type BatchView={id:string;title:string;grade:string;description:string;status:string};
type LessonView={id:string;title:string;description:string|null;status:string;duration_minutes:number|null;sort_order:number};
const demo:Record<string,{title:string;grade:string;description:string;lessons:string[]}>= {
  "math-10":{title:"Mathematics, made clear",grade:"Grade 10 · CBSE",description:"Build confidence in algebra, geometry, and exam problem solving.",lessons:["Quadratic equations: completing the square","Coordinate geometry foundations","Similarity and trigonometry"]},
  "physics-12":{title:"Physics that clicks",grade:"Grade 12 · CBSE",description:"Learn from first principles with weekly guided practice.",lessons:["Electric fields and potential","Current electricity: circuit thinking"]},
  "chemistry-11":{title:"Chemistry with a plan",grade:"Grade 11 · CBSE",description:"A structured route through chemistry and revision.",lessons:["Mole concept: a visual guide","Periodic trends that make sense"]},
};
export default async function BatchDetails({params}:{params:Promise<{id:string}>}){
  const {id}=await params;const user=await getUserContext();let batch:BatchView|null=null;let lessons:LessonView[]=[];
  if(user?.demo&&id in demo){const sample=demo[id];batch={id,title:sample.title,grade:sample.grade,description:sample.description,status:"active"};lessons=sample.lessons.map((title,index)=>({id:`lesson-demo-${index+1}`,title,description:"Sample lesson details.",status:"ready",duration_minutes:18+index*4,sort_order:index}));}
  else{const db=await createClient();if(db&&user){const {data}=await db.from("batches").select("id,title,grade,description,status").eq("id",id).maybeSingle();if(data){batch=data as BatchView;const {data:lessonRows}=await db.from("lessons").select("id,title,status,duration_minutes,sort_order,description").eq("batch_id",id).order("sort_order");lessons=(lessonRows??[]) as LessonView[];}}}
  if(!batch)notFound();
  return <><div className="portal-title-row"><div><Link href="/dashboard/courses" className="under-link"><ArrowLeft size={12}/> All batches</Link><div className="eyebrow" style={{marginTop:14}}>{batch.grade}</div><h1>{batch.title}</h1><p>{batch.description}</p></div><span className="badge">{batch.status}</span></div>{user?.role==="teacher"&&!user.demo&&<BatchControls batch={batch}/>}<div className="detail-layout"><section className="panel"><h2>Lessons</h2>{lessons.length?lessons.map((lesson,index)=><div key={lesson.id} className="list-row"><Link href={`/dashboard/lessons/${lesson.id}`} style={{flex:1}}><b>{String(index+1).padStart(2,"0")} · {lesson.title}</b><small>{lesson.duration_minutes?`${lesson.duration_minutes} minutes · `:""}Recorded lesson</small></Link><span className="badge"><Video size={12}/> {lesson.status}</span>{user?.role==="teacher"&&!user.demo&&<LessonControls id={lesson.id} title={lesson.title} description={lesson.description??""} sortOrder={lesson.sort_order}/>}</div>):<div className="empty-state">Lessons will appear here after your teacher adds them.</div>}</section><aside><div className="panel"><h2>Batch resources</h2><Link className="list-row" href="/dashboard/live"><div><b>Live classes</b><small>See upcoming and active sessions</small></div><CalendarDays size={15}/></Link><Link className="list-row" href="/dashboard/materials"><div><b>Study materials</b><small>Notes and practice sheets</small></div><FileText size={15}/></Link><Link className="list-row" href="/dashboard/announcements"><div><b>Announcements</b><small>Updates for this batch</small></div><ArrowUpRight size={14}/></Link></div></aside></div></>;
}
