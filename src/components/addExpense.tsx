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


interface addExpenseProps {
    name: string;
    description: string;
}

const AddExpense: React.FC<addExpenseProps> = ({name, description}) => {
    const names = ["Aaron", "Andrew", "Tenzin"];
    return (
        <>
            <Drawer>
                <DrawerTrigger asChild>
                    <button className="bg-slate-50 text-slate-950 px-4 py-2 rounded-xl">Add {name}</button>
                </DrawerTrigger>
                <DrawerContent className="h-3/5 bg-slate-950 border-2 border-slate-800 rounded-t-3xl">
                    <DrawerHeader>
                        <DrawerTitle className="text-3xl">Add {name}</DrawerTitle>
                        <DrawerDescription className="text-gray-400">{description}</DrawerDescription>
                    </DrawerHeader>

                    <div className="flex flex-col gap-3 px-5">
                        <div>
                            <Label className="text-lg">Name</Label>
                            <Input></Input>
                        </div>
                        <div>
                            <Label className="text-lg">Amount</Label>
                            <Input placeholder="0.00" type="number"></Input>
                        </div>
                        <div>
                            <ToggleGroup type="multiple">
                                {names.map(name => {
                                    return (
                                        <React.Fragment key={name}>
                                            <ToggleGroupItem className="data-[state=on]:bg-slate-600 data-[state=on]:text-slate-50" value={name}>{name}</ToggleGroupItem>
                                        </React.Fragment>
                                    );
                                })}
                            </ToggleGroup>
                        </div>
                    </div>

                    <DrawerFooter className="flex gap-3">
                        <button className="bg-slate-50 text-slate-950 px-4 py-2 rounded-xl">Submit</button>
                        <DrawerClose asChild>
                            <button className="bg-slate-800 text-gray-300 px-4 py-2 rounded-xl w-full">Close</button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default AddExpense;
