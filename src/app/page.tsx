"use client";

import React, { useState, useEffect } from "react";
import { ExpenseProps } from "@/types";
import Category from "@/components/category";
import { motion, useAnimate, animate } from "framer-motion";


export default function Home() {
  const [amenities, setAmenities] = useState<ExpenseProps[]>();
  const [ubers, setUbers] = useState<ExpenseProps[]>(); 
  const [food, setFood] = useState<ExpenseProps[]>();

  const [title, animateTitle] = useAnimate();
  const [subtitle, animateSubtitle] = useAnimate();
  const [isTitleDone, setIsTitleDone] = useState(false);

  const containerVariants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.2,
        }
    }
  };

  const itemVariants = {
      initial: { x: -20, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  useEffect(() => {
    animateTitle([
      [title.current, {y: ["170%", "150%", "150%", "150%", "0%"], x: ["0%", "0%", "0%", "0%", "-0.22%"], opacity: [0, 1, 1, 1, 1, 0]}, {duration: 2, times: [0, 0.15, 0.2, 0.35, 0.65, 0.75], ease: ["easeOut", "easeOut", "easeOut", "anticipate"]}]
    ]);
    animateSubtitle([
      [subtitle.current, {opacity: [0, 0, 1]}, {duration: 2, times: [0, 0.15, 0.25]}]
    ]);
    setTimeout(() => {
      setIsTitleDone(true);
    }, 1155);
  }, []);


  return (
    <div className={`${isTitleDone ? "" : "h-screen"} p-4 overflow-hidden flex flex-col`}>
      <motion.div ref={title} initial={{ y: "170%", opacity: 0}} className="absolute py-14 px-8 z-10">
        <h1 className="text-5xl text-center font-extrabold">Los Angeles</h1>
        <motion.div ref={subtitle} initial={{opacity: 0}}><h2 className="text-lg text-center font-semibold text-gray-400">May 3rd - May 8th</h2></motion.div>
      </motion.div>


      <motion.div whileTap={{ scale: 1.5 }} className={`${isTitleDone ? "opacity-100" : "opacity-0"} py-14 px-6`} >
        <h1 className="text-5xl text-center font-extrabold">Los Angeles</h1>
        <h2 className="text-lg text-center font-semibold text-gray-400">May 3rd - May 8th</h2>
      </motion.div>

      <motion.div initial="initial" animate={isTitleDone ? "animate" : "initial"} variants={containerVariants} id="num" className="flex flex-col md:flex-row gap-8 pb-12">
        <motion.div variants={itemVariants}><Category name="Amenities" nameSingle="Amenity" description="Add accomodations, tickets, etc." collection="amenities"/></motion.div>
        <motion.div variants={itemVariants}><Category name="Ubers" nameSingle="Uber" description="Add all the Ubers, Lyfts, etc." collection="ubers"/></motion.div>
        <motion.div variants={itemVariants}><Category name="Food" nameSingle="Food" description="Add food, snacks, drinks, etc." collection="food"/></motion.div>
      </motion.div>
    </div>
  );
}
