import Link from "next/link";
import { CirclePlay } from "lucide-react";
import { getUserContext } from "@/lib/auth";
import { createClient } from "@/lib/local-backend/server";
type LessonRow={id:string;title:string;batch:string;duration:number|null;status:string};
type LessonQuery={id:string;title:string;status:string;duration_minutes:number|null;batches:{title:string}|{title:string}[]|null};
const demoLessons:LessonRow[]=[{id:"lesson-demo-1",title:"Quadratic equations: completing the square",batch:"Mathematics, made clear",duration:18,status:"ready"},{id:"lesson-demo-2",title:"Coordinate geometry foundations",batch:"Mathematics, made clear",duration:22,status:"ready"},{id:"lesson-demo-3",title:"Electric fields and potential",batch:"Physics that clicks",duration:25,status:"ready"}];
export default async function LessonsPage(){
  const user=await getUserContext();let rows:LessonRow[]=[];
  if(user?.demo)rows=demoLessons;
  else{const db=await createClient();if(db&&user){const {data}=await db.from("lessons").select("id,title,status,duration_minutes,batches(title)").eq("status","ready").order("created_at",{ascending:false});const lessons=(data??[]) as unknown as LessonQuery[];rows=lessons.map(x=>({id:x.id,title:x.title,batch:Array.isArray(x.batches)?x.batches[0]?.title??"Batch":x.batches?.title??"Batch",duration:x.duration_minutes,status:x.status}));}}
  return <><div className="portal-title-row"><div><span className="eyebrow"><span className="eyebrow-line"/> RECORDED LESSONS</span><h1>Learn at your pace.</h1><p>Revisit a tricky idea whenever you need a little more time.</p></div></div>{rows.length?<section className="panel">{rows.map(row=><Link key={row.id} href={`/dashboard/lessons/${row.id}`} className="list-row"><div><b>{row.title}</b><small>{row.batch} · {row.duration??"—"} min</small></div><span className="badge"><CirclePlay size={12}/> {row.status}</span></Link>)}</section>:<div className="empty-state">No recorded lessons are available yet.</div>}</>;
}
