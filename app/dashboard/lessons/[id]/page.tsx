import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CirclePlay } from "lucide-react";
import { getUserContext } from "@/lib/auth";
import { createClient } from "@/lib/local-backend/server";
import { AuthorizedPlayer } from "@/components/authorized-player";
type LessonPageData={id:string;title:string;description:string;batch:string};
type LessonQuery={id:string;title:string;description:string;status:string;batches:{title:string}|{title:string}[]|null};
export default async function LessonPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;const user=await getUserContext();let lesson:LessonPageData|null=null;
  if(user?.demo&&id.startsWith("lesson-demo"))lesson={id,title:id.endsWith("1")?"Quadratic equations: completing the square":"Coordinate geometry foundations",description:"We’ll work through this concept with a visual example, a guided problem, and a practice question to try on your own.",batch:"Mathematics, made clear"};
  else{const db=await createClient();if(db&&user){const {data}=await db.from("lessons").select("id,title,description,status,batches(title)").eq("id",id).maybeSingle();if(data){const row=data as unknown as LessonQuery;lesson={id:row.id,title:row.title,description:row.description,batch:Array.isArray(row.batches)?row.batches[0]?.title??"Batch":row.batches?.title??"Batch"};}}}
  if(!lesson)notFound();
  return <><div className="portal-title-row"><div><Link href="/dashboard/lessons" className="under-link"><ArrowLeft size={12}/> All lessons</Link><span className="eyebrow" style={{marginTop:15}}>{lesson.batch}</span><h1>{lesson.title}</h1><p>{lesson.description}</p></div></div><div className="panel" style={{padding:0,overflow:"hidden"}}>{user?.demo?<div className="player-message"><CirclePlay size={42}/><p>Sample lesson preview</p><small>Demo footage isn’t available; connect Mux for private playback.</small></div>:<AuthorizedPlayer id={id} type="lesson" title={lesson.title}/>}<div style={{padding:18}}><h2>About this lesson</h2><p style={{fontSize:11,color:"#778078"}}>{lesson.description}</p></div></div></>;
}
