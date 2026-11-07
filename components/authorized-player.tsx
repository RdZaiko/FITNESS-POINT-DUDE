"use client";
import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { LoaderCircle, LockKeyhole } from "lucide-react";

export function AuthorizedPlayer({id,type,title}:{id:string;type:"lesson"|"live";title:string}){const [auth,setAuth]=useState<{playbackId:string;token:string}|null>(null);const [error,setError]=useState("");useEffect(()=>{let live=true;fetch("/api/mux/playback",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({id,type})}).then(async response=>{const data=await response.json();if(!response.ok)throw new Error(data.error??"Playback unavailable.");if(live)setAuth(data);}).catch(reason=>{if(live)setError(reason instanceof Error?reason.message:"Playback unavailable.");});return()=>{live=false};},[id,type]);if(error)return <div className="player-message"><LockKeyhole size={24}/><p>{error}</p></div>;if(!auth)return <div className="player-message"><LoaderCircle size={25}/><p>Checking your class access…</p></div>;return <MuxPlayer playbackId={auth.playbackId} tokens={{playback:auth.token}} metadata={{video_title:title}} style={{width:"100%",aspectRatio:"16/9"}}/>}
