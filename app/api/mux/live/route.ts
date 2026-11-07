import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserContext } from "@/lib/auth";
import { createClient } from "@/lib/local-backend/server";
import { getMux } from "@/lib/mux";

const bodySchema=z.object({batchId:z.string().uuid(),title:z.string().trim().min(3).max(120),description:z.string().trim().max(1000).optional(),startsAt:z.string().datetime()});

export async function POST(request:Request){
  const user=await getUserContext();
  if(!user||user.role!=="teacher"||user.demo)return NextResponse.json({error:"Teacher access is required."},{status:403});
  const mux=getMux();if(!mux)return NextResponse.json({error:"Mux is not configured."},{status:503});
  const db=await createClient();if(!db)return NextResponse.json({error:"Backend services are unavailable in local-only mode."},{status:503});
  let sessionId:string|undefined;
  try{
    const input=bodySchema.parse(await request.json());
    const {data:batch}=await db.from("batches").select("id").eq("id",input.batchId).eq("teacher_id",user.id).maybeSingle();
    if(!batch)return NextResponse.json({error:"Batch not found in your workspace."},{status:404});
    const {data:session,error}=await db.from("live_sessions").insert({teacher_id:user.id,batch_id:batch.id,title:input.title,description:input.description??"",starts_at:input.startsAt,status:"scheduled"}).select("id").single();
    if(error||!session)return NextResponse.json({error:"Could not save the live session."},{status:500});sessionId=session.id;
    const live=await mux.video.liveStreams.create({playback_policies:["signed"],new_asset_settings:{playback_policies:["signed"],video_quality:"basic",passthrough:session.id},reconnect_window:60,latency_mode:"reduced",passthrough:session.id});
    const playbackId=live.playback_ids?.find(x=>x.policy==="signed")?.id??null;
    const updated=await db.from("live_sessions").update({mux_live_stream_id:live.id,mux_playback_id:playbackId}).eq("id",session.id);
    if(updated.error)return NextResponse.json({error:"Mux stream is ready, but the session details did not save. Contact the administrator."},{status:500});
    // Mux only returns the private stream key at creation. It is passed directly to this authenticated teacher once.
    return NextResponse.json({sessionId:session.id,streamId:live.id,rtmpUrl:"rtmps://global-live.mux.com:443/app",streamKey:live.stream_key,playbackId},{status:201});
  }catch(error){
    if(sessionId)await db.from("live_sessions").update({status:"failed"}).eq("id",sessionId);
    return NextResponse.json({error:error instanceof z.ZodError?"Check the title, batch, and start date.":"Could not schedule the live class. Check Mux setup and try again."},{status:error instanceof z.ZodError?400:502});
  }
}
