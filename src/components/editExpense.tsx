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

interface editExpenseProps {
    id: string;
    name: string;
    nameSingle: string;
    onExpenseEdit: () => void;
    isOpen: boolean;
    onClose: () => void;
    currentName: string;
    currentAmount: number;
    currentPeople: string[];
}

async function editExpense(id: string, category: string, name: string, amount: number, people: string[]) {
    const docRef = doc(db, `${category}`, id);
    try {
        updateDoc(docRef, {
            name: name,
            amount: amount,
            people: people,
        });
        console.log("Edited Doc!");
      } catch (e) {
        console.error("Error editing expense: ", e);
    }
}

const EditExpense: React.FC<editExpenseProps> = ({id, name, nameSingle, onExpenseEdit, isOpen, onClose, currentName, currentAmount, currentPeople}) => {
    const names = ["Aaron", "Andrew", "Tenzin"];

    const [expenseName, setExpenseName] = useState<string>(currentName);
    const [expenseAmount, setExpenseAmount] = useState<number>(currentAmount);
    const [expensePeople, setExpensePeople] = useState<string[]>(currentPeople);

    const [hasName, setHasName] = useState(true);
    const [hasAmount, setHasAmount] = useState(true);
    const [hasPerson, setHasPerson] = useState(true);

    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setHasName(!!expenseName);
        setHasAmount(!!expenseAmount);
        setHasPerson((expensePeople.length > 0));

        setTimeout(() => {
            setHasPerson(true);
        }, 300);

        if (expenseName != "" && expenseAmount > 0 && expensePeople.length > 0) {
            editExpense(id, name.toLowerCase(), expenseName, expenseAmount, expensePeople);
            setIsEditOpen(false);
        }

        onExpenseEdit();
    }

    const handleToggle = (value: string[]) => {
        setExpensePeople(value.sort());
    }

    useEffect(() => {
        setIsEditOpen(isOpen);
    }, []);

    useEffect(() => {
        const body = document.getElementById("layoutBody");

        if (isEditOpen) {
            body?.classList.add("overflow-hidden"); 
        }
        else {
            body?.classList.remove("overflow-hidden");
        }

        return () => {
            body?.classList.remove('overflow-hidden');
        };

    }, [isEditOpen]);

    return (
        <>
            <AnimatePresence>
                {isEditOpen && (
                    <motion.div key="backdrop" initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }} animate={{ backgroundColor: "rgba(0, 0, 0, 0.8)", transition: { duration: 0.1} }} exit={{ backgroundColor: "rgba(0, 0, 0, 0)", transition: { duration: 0.5 } }} className={`fixed top-0 left-0 bg-black/80 z-50 w-full h-full justify-end items-center flex flex-col`}>
                        <motion.div key="add" initial={{ y: "100%" }} animate={{ y: "0%", transition: { duration: 0.4, ease: "backOut" } }} exit={{ y: "100%", transition: { duration: 0.6, ease: "anticipate" } }} className="h-3/5 w-full bg-slate-950 border-2 border-slate-800 rounded-t-3xl flex flex-col items-center">
                            <h1 className="text-4xl pt-12 pb-14 font-semibold w-full text-center">Edit {nameSingle}</h1>
                            
                            <div className="flex flex-col gap-3 px-5 w-full">
                                <div>
                                    <Label className="text-lg ">Name</Label>
                                    <Input onChange={e => setExpenseName(e.target.value)} value={expenseName} className={`${hasName ? "border-slate-50" : "border-red-300"} text-slate-950 border-4`} onBlur={e => setExpenseName(e.target.value)}></Input>
                                </div>
                                <div>
                                    <Label className="text-lg">Amount</Label>
                                    <Input onChange={e => setExpenseAmount(+(+e.target.value).toFixed(2))}  value={expenseAmount} placeholder="0.00" type="number" className={`${hasAmount ? "border-slate-50" : "border-red-300"} text-slate-950 border-4`} onBlur={e => setExpenseAmount(+(+e.target.value).toFixed(2))}></Input>
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
                                <motion.button whileTap={{ scale: 1.1, backgroundColor: "rgb(51 65 85)" }} onClick={() => {setIsEditOpen(false); onClose()}} className="bg-slate-800 text-gray-300 px-4 py-2 rounded-xl w-full">Close</motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>  
        </>
    );
};

export default EditExpense;
