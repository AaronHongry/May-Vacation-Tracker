"use client";

import React, { useState, useEffect } from "react";
import { ExpenseProps } from "@/types";
import Category from "@/components/category";
import { motion, useAnimate } from "framer-motion";
import TotalBar from "@/components/totalBar";


export default function Home() {
  const [scope, animate] = useAnimate();
  const [isTitleDone, setIsTitleDone] = useState(false);

  const [amenitiesExpenses, setAmenitiesExpenses] = useState<ExpenseProps[]>([]);
  const [ubersExpenses, setUbersExpenses] = useState<ExpenseProps[]>([]);
  const [foodExpenses, setFoodExpenses] = useState<ExpenseProps[]>([]);

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

  const handleAnimate = () => {
    animate([
      ["#title", {y: ["170%", "170%", "170%", "170%", "0%"], x: ["0%", "0%", "0%", "0%", "-0.22%"], opacity: [0, 1, 1, 1, 1, 0]}, {duration: 2, times: [0, 0.15, 0.2, 0.35, 0.65, 0.75], ease: ["easeOut", "easeOut", "easeOut", "anticipate"]}]
    ]);
    animate([
      ["#subtitle", {opacity: [0, 0, 1]}, {duration: 2, times: [0, 0.15, 0.25]}]
    ]);
    setTimeout(() => {
      setIsTitleDone(true);
    }, 1180);
  };

  const handleTabOpen = () => {
    const backdrop = document.getElementById("backdrop");
    animate([
      ["#backdrop", { backgroundColor: "rgba(0, 0, 0, 0.8)" }, { duration: 0.1 }]
    ]);
    backdrop?.classList.remove("hidden");
  };

  const handleTabClose = async () => {
    const backdrop = document.getElementById("backdrop");
    await animate([
      ["#backdrop", { backgroundColor: "rgba(0, 0, 0, 0)" }, { duration: 0.5 }]
    ]);
    backdrop?.classList.add("hidden");
  };

  useEffect(() => {
    handleAnimate();
  }, []);

  return (
    <div ref={scope} className={`${isTitleDone ? "" : "h-screen"} overflow-hidden p-4 relative justify-center`}>
      <motion.div id="title" initial={{ y: "200%", opacity: 0}} className={`${isTitleDone ? "hidden" : ""} py-14 px-8 z-50 absolute justify-items-center`}>
        <h1 className="text-5xl text-center font-extrabold">Los Angeles</h1>
        <motion.div id="subtitle" initial={{opacity: 0}}><h2 className="text-lg text-center font-semibold text-gray-400">May 3rd - May 8th</h2></motion.div>
      </motion.div>


      <motion.div whileTap={{ scale: 1.05 }} className={`${isTitleDone ? "opacity-100" : "opacity-0"} py-14 px-6`} >
        <h1 className="text-5xl text-center font-extrabold">Los Angeles</h1>
        <h2 className="text-lg text-center font-semibold text-gray-400">May 3rd - May 8th</h2>
      </motion.div>

      <motion.div initial="initial" animate={isTitleDone ? "animate" : "initial"} variants={containerVariants} id="num" className="z-30 flex flex-col md:flex-row gap-8 pb-12">
        <motion.div variants={itemVariants}><Category name="Amenities" nameSingle="Amenity" description="Add accomodations, tickets, etc." collection="amenities" passExpense={setAmenitiesExpenses}/></motion.div>
        <motion.div variants={itemVariants}><Category name="Ubers" nameSingle="Uber" description="Add all the Ubers, Lyfts, etc." collection="ubers" passExpense={setUbersExpenses}/></motion.div>
        <motion.div variants={itemVariants}><Category name="Food" nameSingle="Food" description="Add food, snacks, drinks, etc." collection="food" passExpense={setFoodExpenses}/></motion.div>  
      </motion.div>
      <div className="h-24"/>
      <motion.div id="backdrop" initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }} className="bg-black/80 h-full w-full z-10 fixed inset-0 hidden"></motion.div>
      <div className="z-20 fixed bg-red-500"><TotalBar amenitiesCollection={amenitiesExpenses} ubersCollection={ubersExpenses} foodCollection={foodExpenses} tabOpen={handleTabOpen} tabClose={handleTabClose}/></div>
      
    </div>
  );
}
