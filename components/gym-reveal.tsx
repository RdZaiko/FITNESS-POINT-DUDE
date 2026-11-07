"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduceMotion = useReducedMotion();
  return <motion.div
    className={`reveal ${className}`}
    variants={variants}
    initial={reduceMotion ? false : "hidden"}
    whileInView="visible"
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: reduceMotion ? 0 : 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
  >{children}</motion.div>;
}
