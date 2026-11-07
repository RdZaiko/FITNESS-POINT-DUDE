"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, MessageCircle, Phone, X } from "lucide-react";
import { gym, whatsappHref, whatsappMessages } from "@/lib/gym-config";

const nav = [["About", "about"], ["Facilities", "facilities"], ["Programs", "programs"], ["Trainers", "trainers"], ["Plans", "membership"], ["Gallery", "gallery"], ["Contact", "contact"]];

function Brand() {
  const words = gym.name.split(" ");
  return <a href="#home" className="brand" aria-label={`${gym.name} home`}><span className="brand-mark"><Image src={gym.logoUrl} width={42} height={42} alt="" /></span><span>{words.slice(0, -1).join(" ")} <b>{words.at(-1)}</b><small>{gym.tagline}</small></span></a>;
}

export function GymNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="site-header">
    <Brand />
    <nav className="desktop-nav" aria-label="Main navigation">{nav.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
    <div className="header-actions">
      <a className="header-whatsapp" href={whatsappHref(whatsappMessages.general)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Fitness Point Dude"><MessageCircle size={16} /> WhatsApp</a>
      <a className="header-call" href={`tel:${gym.phone}`}><Phone size={15} /> Call now <ArrowUpRight size={14} /></a>
    </div>
    <button className="menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    <AnimatePresence>{menuOpen && <motion.nav id="mobile-navigation" className="mobile-nav" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} aria-label="Mobile navigation">{nav.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={15} /></a>)}<div className="mobile-contact-actions"><a className="button button-red" href={`tel:${gym.phone}`}><Phone size={16} />Call now</a><a className="button button-outline" href={whatsappHref(whatsappMessages.general)} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} />WhatsApp</a></div></motion.nav>}</AnimatePresence>
  </header>;
}
