import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/local-backend/admin";
import { validMuxSignature } from "@/lib/mux-webhook";

const eventSchema=z.object({type:z.string().min(1).max(100),data:z.object({id:z.string().optional(),upload_id:z.string().optional(),asset_id:z.string().optional(),live_stream_id:z.string().optional(),passthrough:z.string().optional(),duration:z.number().optional(),playback_ids:z.array(z.object({id:z.string(),policy:z.string()})).optional()}).passthrough()}).passthrough();

export async function POST(request:Request){
  const secret=process.env.MUX_WEBHOOK_SECRET;if(!secret)return NextResponse.json({error:"Mux webhook secret is not configured."},{status:503});
  const raw=await request.text();if(!validMuxSignature(raw,request.headers.get("mux-signature")??"",secret))return NextResponse.json({error:"Invalid webhook signature."},{status:401});
  let parsed:ReturnType<typeof eventSchema.safeParse>;try{parsed=eventSchema.safeParse(JSON.parse(raw))}catch{return NextResponse.json({error:"Invalid JSON."},{status:400})}
  if(!parsed.success)return NextResponse.json({error:"Invalid Mux event payload."},{status:400});
  const admin=createAdminClient();if(!admin)return NextResponse.json({error:"Webhook database access is not configured."},{status:503});
  const {data,eventType}= {data:parsed.data.data,eventType:parsed.data.type};
  if(eventType==="video.upload.asset_created"){
    const {error}=await admin.from("lessons").update({status:"processing",mux_asset_id:data.asset_id??null}).eq("mux_upload_id",data.id??"");if(error)return NextResponse.json({error:"Upload processing status could not be saved."},{status:500});
  }
  if(eventType==="video.upload.errored"||eventType==="video.upload.cancelled"||eventType==="video.upload.timed_out"){
    const {error}=await admin.from("lessons").update({status:"failed"}).eq("mux_upload_id",data.id??"");if(error)return NextResponse.json({error:"Upload failure status could not be saved."},{status:500});
  }
  if((eventType==="video.asset.ready"||eventType==="video.asset.errored")&&data.live_stream_id){
    const recordingPlaybackId=data.playback_ids?.find(item=>item.policy==="signed")?.id??null;const {error}=await admin.from("live_sessions").update({recording_asset_id:data.id??null,recording_playback_id:recordingPlaybackId,status:eventType.endsWith("ready")?"completed":"failed"}).eq("mux_live_stream_id",data.live_stream_id);if(error)return NextResponse.json({error:"Live recording status could not be saved."},{status:500});
  }
  if((eventType==="video.asset.ready"||eventType==="video.asset.errored")&&!data.live_stream_id){
    const status=eventType.endsWith("ready")?"ready":"failed";const playbackId=data.playback_ids?.find(item=>item.policy==="signed")?.id??null;
    const update=admin.from("lessons").update({status,mux_asset_id:data.id??null,mux_playback_id:playbackId,duration_minutes:data.duration?Math.round(data.duration/60):null});
    const result=data.passthrough?await update.eq("id",data.passthrough):data.upload_id?await update.eq("mux_upload_id",data.upload_id):null;
    if(result?.error)return NextResponse.json({error:"Lesson status could not be saved."},{status:500});
  }
  if(eventType==="video.live_stream.active"||eventType==="video.live_stream.idle"||eventType==="video.live_stream.connected"||eventType==="video.live_stream.disconnected"){
    const status=eventType.endsWith("active")||eventType.endsWith("connected")?"live":"idle";const {error}=await admin.from("live_sessions").update({status}).eq("mux_live_stream_id",data.id??"");if(error)return NextResponse.json({error:"Live session status could not be saved."},{status:500});
  }
  if(eventType==="video.asset.created"&&data.live_stream_id){
    const {error}=await admin.from("live_sessions").update({recording_asset_id:data.id??null}).eq("mux_live_stream_id",data.live_stream_id);if(error)return NextResponse.json({error:"Live recording could not be linked."},{status:500});
  }
  return NextResponse.json({received:true});
}
