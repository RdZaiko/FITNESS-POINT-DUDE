import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserContext } from "@/lib/auth";
import { createClient } from "@/lib/local-backend/server";
const schema=z.object({fullName:z.string().trim().min(2).max(100)});
export async function PUT(request:Request){const user=await getUserContext();if(!user||user.demo)return NextResponse.json({error:"A verified account is required."},{status:401});const db=await createClient();if(!db)return NextResponse.json({error:"Backend services are unavailable in local-only mode."},{status:503});const input=schema.safeParse(await request.json().catch(()=>null));if(!input.success)return NextResponse.json({error:"Enter a name between 2 and 100 characters."},{status:400});const {error}=await db.from("profiles").update({full_name:input.data.fullName,updated_at:new Date().toISOString()}).eq("id",user.id);if(error)return NextResponse.json({error:"Could not save your profile."},{status:500});return NextResponse.json({ok:true});}
