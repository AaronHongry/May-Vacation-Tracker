"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ToggleGroup,
    ToggleGroupItem,
  } from "@/components/ui/toggle-group"
import React, { useEffect, useState } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { motion, AnimatePresence } from "framer-motion";

interface addExpenseProps {
    name: string;
    nameSingle: string;
    description: string;
    onExpenseAdd: () => void;
}

async function addExpense(category: string, name: string, amount: number, people: string[]) {
    const docRef = doc(db, `${category}`, `${Date.now()}`);
    try {
        setDoc(docRef, {
            name: name,
            id: "",
            amount: amount,
            people: people,
            date: `${new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}`
        });

        try {
            await updateDoc(docRef, {
                id: docRef.id
            });
        } catch (e) {
            console.error("Error updating expense id of expense: ", e);
        }
        console.log("Added doc!");
      } catch (e) {
        console.error("Error adding expense: ", e);
    }
}

const AddExpense: React.FC<addExpenseProps> = ({name, nameSingle, description, onExpenseAdd}) => {
    const names = ["Aaron", "Andrew", "Tenzin"];

    const [expenseName, setExpenseName] = useState<string>("");
    const [expenseAmount, setExpenseAmount] = useState<number>(0.0);
    const [expensePeople, setExpensePeople] = useState<string[]>([]);

    const [hasName, setHasName] = useState(true);
    const [hasAmount, setHasAmount] = useState(true);
    const [hasPerson, setHasPerson] = useState(true);

    const [isAddOpen, setIsAddOpen] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setHasName(!!expenseName);
        setHasAmount(!!expenseAmount);
        setHasPerson((expensePeople.length > 0));

        setTimeout(() => {
            setHasPerson(true);
        }, 300);

        if (expenseName != "" && expenseAmount > 0 && expensePeople.length > 0) {
            addExpense(name.toLowerCase(), expenseName, expenseAmount, expensePeople);
            setExpensePeople([]);
            setIsAddOpen(false);
        }

        onExpenseAdd();
    }

    const handleToggle = (value: string[]) => {
        setExpensePeople(value.sort());
    }

    useEffect(() => {
        const body = document.getElementById("layoutBody");

        if (isAddOpen) {
            body?.classList.add("overflow-hidden"); 
        }
        else {
            body?.classList.remove("overflow-hidden");
        }

        return () => {
            body?.classList.remove('overflow-hidden');
        };

    }, [isAddOpen]);

    return (
        <>
            <motion.button whileTap={{ scale: 1.1, backgroundColor: "rgb(0, 0, 0)"}} onClick={() => {setIsAddOpen(true)}} className="bg-slate-50 text-slate-950 px-4 py-2 rounded-xl w-full">Add {nameSingle}</motion.button>
            <AnimatePresence>
                {isAddOpen && (
                    <motion.div key="backdrop" initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }} animate={{ backgroundColor: "rgba(0, 0, 0, 0.8)", transition: { duration: 0.1} }} exit={{ backgroundColor: "rgba(0, 0, 0, 0)", transition: { duration: 0.5 } }} className={`fixed top-0 left-0 bg-black/80 z-50 w-full h-full justify-end items-center flex flex-col`}>
                        <motion.div key="add" initial={{ y: "100%" }} animate={{ y: "0%", transition: { duration: 0.4, ease: "backOut" } }} exit={{ y: "100%", transition: { duration: 0.6, ease: "anticipate" } }} className="h-4/5 w-full bg-slate-950 border-2 border-slate-800 rounded-t-3xl flex flex-col items-center pb-6">
                            <h1 className="text-4xl pt-12 pb-0 font-semibold w-full text-center">Add {nameSingle}</h1>
                            <h2 className="text-sm p-2 pb-8 w-full text-center text-gray-400">{description}</h2>
                            
                            <div className="flex flex-col gap-3 px-5 w-full">
                                <div>
                                    <Label className="text-lg ">Name</Label>
                                    <Input className={`${hasName ? "border-slate-50" : "border-red-300"} text-slate-950 border-4`} onBlur={e => setExpenseName(e.target.value)}></Input>
                                </div>
                                <div>
                                    <Label className="text-lg">Amount</Label>
                                    <Input placeholder="0.00" type="number" className={`${hasAmount ? "border-slate-50" : "border-red-300"} text-slate-950 border-4`} onBlur={e => setExpenseAmount(+(+e.target.value).toFixed(2))}></Input>
                                </div>
                                <div>
                                    <ToggleGroup type="multiple" onValueChange={handleToggle} value={expensePeople}>
                                        {names.map(name => {
                                            return (
                                                <React.Fragment key={name}>
                                                    <ToggleGroupItem className={`${hasPerson ? "bg-slate-900" : "bg-red-400" } transition duration-200 data-[state=on]:bg-slate-600 data-[state=on]:text-slate-50`} value={name}>{name}</ToggleGroupItem>
                                                </React.Fragment>
                                            );
                                        })}
                                    </ToggleGroup>
                                </div>
                            </div>

                            <div className="w-full pt-7 px-5 flex flex-col gap-3">
                                <motion.button whileTap={{ scale: 1.1, backgroundColor: "rgb(0, 0, 0)" }} onClick={handleSubmit} className="bg-slate-50 text-slate-950 px-4 py-4 rounded-xl w-full">Submit</motion.button>
                                <motion.button whileTap={{ scale: 1.1, backgroundColor: "rgb(51 65 85)" }} onClick={() => {setIsAddOpen(false); setExpensePeople([]);}} className="bg-slate-800 text-gray-300 px-4 py-2 rounded-xl w-full">Close</motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>  
        </>
    );
};

export default AddExpense;
