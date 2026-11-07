import Link from "next/link";
import { ArrowUpRight, CalendarDays, CirclePlay } from "lucide-react";
import { getUserContext } from "@/lib/auth";
import { createClient } from "@/lib/local-backend/server";
import { StudentLearningPanel } from "@/components/student-learning-panel";

const demoBatches = [{id:"math-10",title:"Mathematics, made clear",grade:"Grade 10 · CBSE",status:"active",students:18},{id:"physics-12",title:"Physics that clicks",grade:"Grade 12 · CBSE",status:"active",students:14},{id:"chemistry-11",title:"Chemistry with a plan",grade:"Grade 11 · CBSE",status:"active",students:12}];
export default async function DashboardPage() {
  const user=await getUserContext();
  const db=await createClient();
  let batches: {id:string;title:string;grade:string;status:string;students?:number}[]=[];
  let studentCount=0; let upcomingCount=0;
  if(user?.demo) { batches=demoBatches; studentCount=44; upcomingCount=2; }
  else if(db&&user) {
    if(user.role==="teacher") {
      const [batchResult,studentResult,liveResult]=await Promise.all([
        db.from("batches").select("id,title,grade,status").eq("teacher_id",user.id).eq("archived",false).order("created_at",{ascending:false}),
        db.from("enrollments").select("id",{count:"exact",head:true}).eq("teacher_id",user.id).eq("status","active"),
        db.from("live_sessions").select("id",{count:"exact",head:true}).eq("teacher_id",user.id).in("status",["scheduled","live"]).gte("starts_at",new Date().toISOString()),
      ]);
      batches=(batchResult.data??[]) as typeof batches;studentCount=studentResult.count??0;upcomingCount=liveResult.count??0;
    } else {
      const {data}=await db.from("enrollments").select("batch_id,batches(id,title,grade,status)").eq("student_id",user.id).eq("status","active");
      batches=(data??[]).flatMap((row: {batches:{id:string;title:string;grade:string;status:string}|{id:string;title:string;grade:string;status:string}[]|null})=>Array.isArray(row.batches)?row.batches:row.batches?[row.batches]:[]) as typeof batches;
      const {count}=await db.from("live_sessions").select("id",{count:"exact",head:true}).in("batch_id",batches.map(b=>b.id)).in("status",["scheduled","live"]).gte("starts_at",new Date().toISOString());upcomingCount=count??0;
    }
  }
  const isTeacher=user?.role==="teacher";
  return <><div className="portal-title-row"><div><span className="eyebrow"><span className="eyebrow-line"/>{isTeacher?"YOUR CLASSROOM":"YOUR LEARNING SPACE"}</span><h1>{isTeacher?"A good day to teach.":`Welcome back, ${user?.displayName?.split(" ")[0]??"there"}.`}</h1><p>{isTeacher?"Here’s a little snapshot of your classroom today.":"You’re building good habits. Here’s what’s coming up."}</p></div>{isTeacher&&<Link href="/dashboard/courses" className="button button-ink">Manage batches <ArrowUpRight size={15}/></Link>}</div>
    <div className="stats-grid">{isTeacher?<><div className="stat-card"><span>Active students</span><b>{studentCount}</b></div><div className="stat-card"><span>Active batches</span><b>{batches.length}</b></div><div className="stat-card"><span>Upcoming classes</span><b>{upcomingCount}</b></div><div className="stat-card"><span>Video lessons</span><b>{user?.demo?38:"—"}</b></div></>:<><div className="stat-card"><span>Your active batches</span><b>{batches.length}</b></div><div className="stat-card"><span>Upcoming classes</span><b>{upcomingCount}</b></div><div className="stat-card"><span>Learning streak</span><b>{user?.demo?"4 days":"—"}</b></div><div className="stat-card"><span>Lessons completed</span><b>{user?.demo?"12":"—"}</b></div></>}</div>
    <div className="panel-grid"><section className="panel"><h2>{isTeacher?"Your batches":"My batches"}</h2>{batches.length?batches.slice(0,4).map((batch)=><Link key={batch.id} href={`/dashboard/batches/${batch.id}`} className="list-row"><div><b>{batch.title}</b><small>{batch.grade} · {isTeacher?`${(batch as {students?:number}).students??"—"} students`:"Your enrolled batch"}</small></div><span className="badge">{batch.status}</span></Link>):<div className="empty-state">{isTeacher?"Your first batch is waiting to be set up.":"No active batch yet. Ask your teacher to connect your enrollment."}</div>}<div style={{marginTop:12}}><Link className="under-link" href="/dashboard/courses">{isTeacher?"Manage batches":"Explore your courses"} <ArrowUpRight size={13}/></Link></div></section><section className="panel"><h2>{isTeacher?"Next on your schedule":"Next live class"}</h2>{user?.demo?<><div className="list-row"><div><b>Functions &amp; graphs · Grade 10</b><small>Today · 5:00 PM IST</small></div><span className="badge orange">Soon</span></div><div className="list-row"><div><b>Electrostatics · Grade 12</b><small>Tomorrow · 6:30 PM IST</small></div><span className="badge">Scheduled</span></div></>:<div className="empty-state">Your upcoming class schedule will appear here.</div>}<Link href="/dashboard/live" className="under-link" style={{marginTop:15}}>Open live classes <CalendarDays size={13}/></Link></section></div>
    <section className="panel" style={{marginTop:15}}><h2>Pick up where you left off</h2>{user?.demo?<Link href="/courses/mathematics-made-clear" className="list-row"><div><b>Patterns, variables &amp; expressions</b><small>Mathematics sample outline · continue your local preview</small></div><span className="badge"><CirclePlay size={12}/> Continue</span></Link>:<div className="empty-state">Your recent lessons and learning progress will appear here.</div>}</section>{user?.demo&&user.role==="student"&&<StudentLearningPanel/>}{user?.demo&&user.role==="teacher"&&<section className="teacher-preview-links"><span className="eyebrow"><span className="eyebrow-line"/> SAMPLE CLASSROOM</span><h2>Explore the learning experience</h2><p>This teacher workspace is read-only. Real student records and editing require a connected backend.</p><div><Link href="/courses">Browse sample courses ↗</Link><Link href="/teachers">View tutor examples ↗</Link><Link href="/leaderboard">Open demo leaderboard ↗</Link></div></section>}</>;
}
