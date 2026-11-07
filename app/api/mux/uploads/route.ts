import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserContext } from "@/lib/auth";
import { createClient } from "@/lib/local-backend/server";
import { getMux } from "@/lib/mux";

const bodySchema=z.object({lessonId:z.string().uuid()});
export async function POST(request:Request){
  const user=await getUserContext();if(!user||user.role!=="teacher"||user.demo)return NextResponse.json({error:"Teacher access is required."},{status:403});
  const mux=getMux();if(!mux)return NextResponse.json({error:"Mux is not configured. Add the server-side Mux API credentials."},{status:503});
  const configuredOrigin=process.env.APP_URL;if(!configuredOrigin)return NextResponse.json({error:"APP_URL is not configured for secure direct-upload CORS."},{status:503});
  const db=await createClient();if(!db)return NextResponse.json({error:"Backend services are unavailable in local-only mode."},{status:503});
  try{const input=bodySchema.parse(await request.json());const {data:lesson}=await db.from("lessons").select("id,batch_id,batches!inner(teacher_id)").eq("id",input.lessonId).maybeSingle();if(!lesson)return NextResponse.json({error:"Lesson not found."},{status:404});
    const batch=Array.isArray(lesson.batches)?lesson.batches[0]:lesson.batches;if(!batch||batch.teacher_id!==user.id)return NextResponse.json({error:"This lesson is not in your teaching workspace."},{status:403});
    const appOrigin=new URL(configuredOrigin);if(appOrigin.protocol!=="https:"&&appOrigin.hostname!=="localhost")return NextResponse.json({error:"APP_URL must use HTTPS outside local development."},{status:500});const upload=await mux.video.uploads.create({cors_origin:appOrigin.origin,new_asset_settings:{playback_policies:["signed"],passthrough:lesson.id,video_quality:"basic"}});
    const {error}=await db.from("lessons").update({mux_upload_id:upload.id,status:"uploading"}).eq("id",lesson.id);if(error)return NextResponse.json({error:"Upload was created but could not be linked to the lesson. Check database setup."},{status:500});
    return NextResponse.json({uploadId:upload.id,url:upload.url},{status:201});
  }catch(error){const message=error instanceof z.ZodError?"A valid lesson ID is required.":"Could not create a video upload. Check Mux credentials and try again.";return NextResponse.json({error:message},{status:error instanceof z.ZodError?400:502});}
}
