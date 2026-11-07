"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { BookOpen, GraduationCap, LibraryBig, Shapes } from "lucide-react";

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reducedMotion = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => `${Math.round(latest)}${suffix}`);
  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) { count.set(value); return; }
    const control = animate(count, value, { duration: 0.85, ease: "easeOut" });
    return () => control.stop();
  }, [count, inView, reducedMotion, value]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const stats = [
  { value: 3, label: "sample course outlines", icon: BookOpen },
  { value: 3, label: "illustrative tutor cards", icon: GraduationCap },
  { value: 4, label: "learning steps", icon: Shapes },
  { value: 4, label: "example checkpoints per course", icon: LibraryBig },
];

export function DemoStatistics() {
  return <section className="demo-stats-section" aria-labelledby="demo-stats-heading"><div className="wrap">
    <div className="demo-stats-heading"><span className="eyebrow"><span className="eyebrow-line"/> A PREVIEW, NOT A PROMISE</span><h2 id="demo-stats-heading">A thoughtful structure<br/><em>for the next step.</em></h2><p>These are counts from the local demo content—not live platform, teacher, or student totals.</p></div>
    <div className="demo-stats-grid">{stats.map(({ value, label, icon: Icon }) => <article className="demo-stat" key={label}><span className="demo-stat-icon"><Icon size={18}/></span><b><CountUp value={value}/></b><span>{label}</span></article>)}</div>
    <p className="demo-stats-disclaimer">Illustrative local preview content · no verified enrollment or outcome claims</p>
  </div></section>;
}
