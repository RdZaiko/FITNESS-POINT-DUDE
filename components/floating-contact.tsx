"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { gym, whatsappHref, whatsappMessages } from "@/lib/gym-config";

export function FloatingContact() {
  const [hideContact, setHideContact] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    const location = document.getElementById("location");
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setHideContact(visible.size > 0);
    }, { threshold: 0.08 });
    [contact, location].filter((section): section is HTMLElement => section !== null).forEach((section) => observer.observe(section));
    const scroll = () => setShowTop(window.scrollY > 500);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", scroll); };
  }, []);

  return <div className="floating-contact">
    {!hideContact && <>
      <a className="float-call" href={`tel:${gym.phone}`} aria-label={`Call Fitness Point Dude at ${gym.phoneDisplay}`}><Phone size={18} fill="currentColor" /><span>Call</span></a>
      <a className="float-whatsapp" href={whatsappHref(whatsappMessages.general)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Fitness Point Dude"><MessageCircle size={19} /><span>WhatsApp</span></a>
    </>}
    {showTop && <a className="float-top" href="#home" aria-label="Back to top"><ArrowUp size={19} /><span>Top</span></a>}
  </div>;
}
