"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { Reveal } from "@/components/gym-reveal";

const gallery = ["photo-1534438327276-14e5300c3a48", "photo-1583454110551-21f2fa2afe61", "photo-1579758629938-03607ccdbaba", "photo-1581009146145-b5ef050c2e1e", "photo-1517836357463-d25dfeac3438", "photo-1534258936925-c58bed479fcb"];
const photo = (id: string, width: number) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export function GymGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (lightbox === null) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox]);

  return <>
    <section className="section gallery-section" id="gallery"><div className="container"><Reveal className="section-top"><div><div className="eyebrow"><span/>GYM VISUALS</div><h2>ENERGY FOR<br/><em>EVERY REP.</em></h2></div><p>Illustrative stock photography. These images do not represent actual photographs of Fitness Point Dude.</p></Reveal><div className="gallery-grid">{gallery.map((image,i)=><button key={image} className={`gallery-item gallery-${i+1}`} onClick={()=>setLightbox(i)} aria-label={`View illustrative gym image ${i+1}`}><Image unoptimized width={1000} height={750} sizes="(max-width: 520px) 100vw, 40vw" src={photo(image,1000)} alt={`Illustrative stock image of gym equipment, image ${i+1}`} loading="lazy"/><span>0{i+1} <ArrowUpRight size={16}/></span></button>)}</div><p className="gallery-disclaimer">Illustrative stock imagery only — not photos of this gym.</p></div></section>
    {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Illustrative gym image" onClick={()=>setLightbox(null)}><button aria-label="Close image" onClick={()=>setLightbox(null)}><X/></button><Image unoptimized width={1800} height={1200} src={photo(gallery[lightbox],1800)} alt={`Illustrative stock gym image ${lightbox+1}`} onClick={event=>event.stopPropagation()}/><span>ILLUSTRATIVE · 0{lightbox+1} / 06</span></div>}
  </>;
}
