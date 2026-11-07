import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserContext } from "@/lib/auth";
import { createClient } from "@/lib/local-backend/server";
const schema=z.object({title:z.string().trim().min(3).max(120),grade:z.string().trim().min(1).max(80),description:z.string().trim().max(1000).default("")});
export async function POST(request:Request){const user=await getUserContext();if(!user||user.role!=="teacher"||user.demo)return NextResponse.json({error:"Teacher access is required."},{status:403});const db=await createClient();if(!db)return NextResponse.json({error:"Backend services are unavailable in local-only mode."},{status:503});try{const input=schema.parse(await request.json());const {data,error}=await db.from("batches").insert({teacher_id:user.id,...input}).select("id").single();if(error||!data)return NextResponse.json({error:"Could not create this batch."},{status:500});return NextResponse.json({id:data.id},{status:201});}catch(error){return NextResponse.json({error:error instanceof z.ZodError?"Check the batch name and grade.":"Could not create this batch."},{status:error instanceof z.ZodError?400:500});}}
