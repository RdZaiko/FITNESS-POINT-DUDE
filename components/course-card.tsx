"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
export type CourseCardData={slug:string;tag:string;title:string;description:string;color:string;icon:string;count:string;image:string};
export function CourseCard({course,index}:{course:CourseCardData;index:number}){const reduceMotion=useReducedMotion();return <motion.article className={`course-card ${course.color}`} initial={reduceMotion?false:{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:reduceMotion?0:.45,delay:reduceMotion?0:index*.08,ease:"easeOut"}}><div className="course-card-art"><Image src={course.image} alt="" fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" loading={index===0?"eager":"lazy"}/><span className="course-icon" aria-hidden="true">{course.icon}</span></div><div className="course-card-body"><span className="course-tag">{course.tag}</span><h3>{course.title}</h3><p>{course.description}</p><div className="course-card-foot"><span>{course.count}</span><Link href={`/courses/${course.slug}`} aria-label={`View ${course.title} outline`}><ArrowUpRight size={17}/></Link></div></div></motion.article>}
