import { NextResponse } from "next/server";
import { z } from "zod";
import { isDemoEnabled } from "@/lib/config";
const input=z.object({role:z.enum(["teacher","student"])});
export async function POST(request:Request){if(!isDemoEnabled())return NextResponse.json({error:"Demo preview is disabled."},{status:404});try{const data=input.parse(await request.json());const response=NextResponse.json({ok:true});response.cookies.set("learning-room-demo",data.role,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:60*60*4});return response;}catch{return NextResponse.json({error:"Invalid demo request."},{status:400});}}
