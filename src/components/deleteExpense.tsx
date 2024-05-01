"use client";
import React, { useEffect, useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { motion, AnimatePresence } from "framer-motion";

interface deleteExpenseProps {
    id: string;
    name: string;
    nameSingle: string;
    onExpenseDelete: () => void;
    isOpen: boolean;
    onClose: () => void;
    currentName: string;
    currentAmount: number;
    currentPeople: string[];
    currentDate: string;
}

async function deleteExpense(id: string, category: string) {
    const docRef = doc(db, `${category}`, id);
    try {
        await deleteDoc(docRef)
        console.log("Deleted doc!");
      } catch (e) {
        console.error("Error deleting expense: ", e);
    }
}

const DeleteExpense: React.FC<deleteExpenseProps> = ({id, name, nameSingle, onExpenseDelete, isOpen, onClose, currentName, currentAmount, currentPeople, currentDate}) => {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleDelete = (event: React.FormEvent) => {
        event.preventDefault();
        deleteExpense(id, name.toLowerCase());
        setIsDeleteOpen(false);


        onExpenseDelete();
    }


    useEffect(() => {
        setIsDeleteOpen(isOpen);
    }, []);

    useEffect(() => {
        const body = document.getElementById("layoutBody");

        if (isDeleteOpen) {
            body?.classList.add("overflow-hidden"); 
        }
        else {
            body?.classList.remove("overflow-hidden");
        }

        return () => {
            body?.classList.remove('overflow-hidden');
        };

    }, [isDeleteOpen]);

    return (
        <>
            <AnimatePresence>
                {isDeleteOpen && (
                    <motion.div key="backdrop" initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }} animate={{ backgroundColor: "rgba(0, 0, 0, 0.8)", transition: { duration: 0.1} }} exit={{ backgroundColor: "rgba(0, 0, 0, 0)", transition: { duration: 0.5 } }} className={`fixed top-0 left-0 bg-black/80 z-50 w-full h-full justify-end items-center flex flex-col`}>
                        <motion.div key="add" initial={{ y: "100%" }} animate={{ y: "0%", transition: { duration: 0.4, ease: "backOut" } }} exit={{ y: "100%", transition: { duration: 0.6, ease: "anticipate" } }} className="h-3/5 w-full bg-slate-950 border-2 border-slate-800 rounded-t-3xl flex flex-col items-center">
                            <h1 className="text-4xl pt-12 pb-0 font-semibold w-full text-center">Delete {nameSingle}?</h1>
                            <h2 className="text-sm p-2 pb-8 w-full text-center text-gray-400">Are you sure? This cannot be undone.</h2>
                            <div className="h-full flex flex-col justify-center items-center">
                                <div className="grid grid-cols-5 w-4/5 gap-4 py-2 px-4 items-center bg-slate-800 rounded-lg ">
                                    <div className="col-span-3">
                                        <p className="text-2xl font-bold">{currentName}</p>
                                        {currentPeople.map((person, index) => (
                                            <React.Fragment key={index}>
                                            <span className="text-xs font-medium text-gray-400 inline-block">{person}</span>
                                            {(index != currentPeople.length - 1) && <span className="text-gray-400">, </span>}
                                            </React.Fragment>
                                        ))}
                                        <p className="text-xs font-medium text-gray-600">{currentDate}</p>
                                    </div>
                                    <p className="text-xl font-bold col-span-1">${currentAmount.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="w-full pt-8 pb-6 px-5 flex flex-col gap-3">
                                <motion.button whileTap={{ scale: 1.1, backgroundColor: "rgb(0, 0, 0)" }} onClick={handleDelete} className="bg-red-500 text-slate-50 px-4 py-4 rounded-xl w-full">Delete</motion.button>
                                <motion.button whileTap={{ scale: 1.1, backgroundColor: "rgb(51 65 85)" }} onClick={() => {setIsDeleteOpen(false); onClose()}} className="bg-slate-800 text-gray-300 px-4 py-2 rounded-xl w-full">Close</motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>  
        </>
    );
};

export default DeleteExpense;
