"use client";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ToggleGroup,
    ToggleGroupItem,
  } from "@/components/ui/toggle-group"
import React from "react";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useEffect, useState } from "react";

interface addExpenseProps {
    name: string;
    nameSingle: string;
    description: string;
}

async function addExpense(category: string, name: string, amount: number, people: string[]) {
    const docRef = doc(db, category, `${new Date()}`);
    try {
        setDoc(docRef, {
            name: name,
            id: "",
            amount: amount,
            people: people
        });

        try {
            await updateDoc(docRef, {
                id: docRef.id
            });
        } catch (e) {
            console.error("Error updating expense id of expense: ", e);
        }

      } catch (e) {
        console.error("Error adding expense: ", e);
    }
}

const AddExpense: React.FC<addExpenseProps> = ({name, nameSingle, description}) => {
    const names = ["Aaron", "Andrew", "Tenzin"];

    const [expenseName, setExpenseName] = useState("");
    const [expenseAmount, setExpenseAmount] = useState(0.0);
    const [expensePeople, setExpensePeople] = useState<string[]>([]);

    const [hasName, setHasName] = useState(true);
    const [hasAmount, setHasAmount] = useState(true);
    const [hasPerson, setHasPerson] = useState(true);

    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setHasName(!!expenseName);
        setHasAmount(!!expenseAmount);
        setHasPerson((expensePeople.length > 0));

        setTimeout(() => {
            setHasPerson(true);
        }, 300);

        if (hasName && hasAmount && hasPerson) {
            addExpense(name.toLowerCase(), expenseName, expenseAmount, expensePeople);
            setDrawerOpen(false);
        }

    }

    const handleToggle = (value: string[]) => {
        setExpensePeople(value);
    }

    return (
        <>
            <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <DrawerTrigger asChild>
                    <button onClick={() => setDrawerOpen(true)} className="bg-slate-50 text-slate-950 px-4 py-2 rounded-xl w-full">Add {nameSingle}</button>
                </DrawerTrigger>
                <DrawerContent className="h-3/5 bg-slate-950 border-2 border-slate-800 rounded-t-3xl">
                    <DrawerHeader>
                        <DrawerTitle className="text-3xl">Add {nameSingle}</DrawerTitle>
                        <DrawerDescription className="text-gray-400">{description}</DrawerDescription>
                    </DrawerHeader>

                    <div className="flex flex-col gap-3 px-5">
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
                                            <ToggleGroupItem className={`${hasPerson ? "bg-slate-900" : "bg-red-400" } transition duration-300 data-[state=on]:bg-slate-600 data-[state=on]:text-slate-50`} value={name}>{name}</ToggleGroupItem>
                                        </React.Fragment>
                                    );
                                })}
                            </ToggleGroup>
                        </div>
                    </div>

                    <DrawerFooter className="flex gap-3">
                        <button onClick={handleSubmit} className="bg-slate-50 text-slate-950 px-4 py-2 rounded-xl">Submit</button>
                        <DrawerClose asChild>
                            <button onClick={() => setDrawerOpen(false)} className="bg-slate-800 text-gray-300 px-4 py-2 rounded-xl w-full">Close</button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default AddExpense;
