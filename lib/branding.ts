import "server-only";
import { cache } from "react";
import { z } from "zod";
import { createClient } from "@/lib/local-backend/server";

const courseSchema=z.array(z.object({title:z.string().max(120),grade:z.string().max(80),description:z.string().max(600),schedule:z.string().max(120).optional()})).max(12);
export type PublicCourse={title:string;grade:string;description:string;schedule?:string};
export type BrandData={brandName:string;teacherName:string;logoUrl:string|null;primaryColor:string;accentColor:string;contactEmail:string|null;contactPhone:string|null;courses:PublicCourse[]};
const defaults:BrandData={brandName:"The Learning Room",teacherName:"Your teacher",logoUrl:null,primaryColor:"#153f34",accentColor:"#bd9958",contactEmail:process.env.NEXT_PUBLIC_CONTACT_EMAIL??null,contactPhone:null,courses:[]};
function safeImageUrl(value:string|null){if(!value)return null;try{const url=new URL(value);return url.protocol==="https:"||url.protocol==="http:"?url.toString():null;}catch{return null;}}
export const getBrandData=cache(async function getBrandData():Promise<BrandData>{
  const db=await createClient();if(!db)return defaults;
  try{const {data}=await db.from("teacher_settings").select("brand_name,teacher_name,logo_url,primary_color,accent_color,contact_email,contact_phone,course_details").limit(1).maybeSingle();if(!data)return defaults;
    const color=(value:string|undefined,fallback:string)=>value&&/^#[\da-fA-F]{6}$/.test(value)?value:fallback;
    const courses=courseSchema.safeParse(data.course_details);
    return {brandName:data.brand_name||defaults.brandName,teacherName:data.teacher_name||defaults.teacherName,logoUrl:safeImageUrl(data.logo_url),primaryColor:color(data.primary_color,defaults.primaryColor),accentColor:color(data.accent_color,defaults.accentColor),contactEmail:data.contact_email||defaults.contactEmail,contactPhone:data.contact_phone||null,courses:courses.success?courses.data:[]};
  }catch{return defaults;}
});
