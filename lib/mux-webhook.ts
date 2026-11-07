import { createHmac, timingSafeEqual } from "node:crypto";

export function validMuxSignature(rawBody:string,header:string,secret:string,nowSeconds=Math.floor(Date.now()/1000)){
  const values=Object.fromEntries(header.split(",").map(part=>{const [key,value]=part.split("=",2);return[key,value]}));
  const timestamp=values.t;const signature=values.v1;
  if(!timestamp||!signature||!/^\d+$/.test(timestamp)||Math.abs(nowSeconds-Number(timestamp))>300||!/^[a-f0-9]{64}$/i.test(signature))return false;
  const expected=createHmac("sha256",secret).update(`${timestamp}.${rawBody}`).digest("hex");
  const expectedBytes=Buffer.from(expected,"hex");const suppliedBytes=Buffer.from(signature,"hex");
  return expectedBytes.length===suppliedBytes.length&&timingSafeEqual(expectedBytes,suppliedBytes);
}
