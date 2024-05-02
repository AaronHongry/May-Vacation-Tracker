import { motion, useAnimate } from "framer-motion";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { ExpenseProps } from "@/types";

interface TotalBarProps {
    collection: ExpenseProps[];
}

const TotalBar: React.FC<TotalBarProps> = ({collection}) => {
    const [isOpen, setIsOpen] = useState(false);

    const [scope, animate] = useAnimate();

    const [expenses, setExpenses] = useState<ExpenseProps[]>([]);

    const handleTab = () => {
        if (!isOpen) {
            animate([
                ["#tab", { y: "20%" }, { duration: 0.4, ease: "backOut" }]
            ]);
            animate([
                ["#backdrop", { backgroundColor: "rgba(0, 0, 0, 0.8)" }, { duration: 0.1 }]
            ]);
            setIsOpen(true);
        }
        else {
            animate([
                ["#tab", { y: "88.5%" }, { duration: 0.6, ease: "anticipate" }]
            ]);
            animate([
                ["#backdrop", { backgroundColor: "rgba(0, 0, 0, 0)" }, { duration: 0.5 }]
            ]);
            setIsOpen(false);
        }
    };

    useEffect(() => {
        setExpenses(collection);


    }, [expenses]);

    useEffect(() => {
        const body = document.getElementById("layoutBody");

        if (isOpen) {
            body?.classList.add("overflow-hidden"); 
        }
        else {
            body?.classList.remove("overflow-hidden");
        }

        return () => {
            body?.classList.remove('overflow-hidden');
        };

    }, [isOpen]);

    return (
        <div ref={scope}>
            <motion.div id="backdrop" initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }} className={`fixed top-0 left-0 bg-black/80 z-50 w-full h-full justify-end items-center flex flex-col`}>
                <motion.div id="tab" initial={{ y: "100%" }} animate={{ y: "88.5%", transition: { delay: 1.2, duration: 0.3 } }} onClick={handleTab} className={`h-full fixed left-0 top-0 z-50 bg-slate-950 border-t-2 border-slate-800 rounded-t-xl drop-shadow-xl w-full px-5`}>
                    <div className="h-24 w-full flex flex-row justify-between items-center ">
                        <h1 className="text-3xl font-extrabold">Total:</h1>
                        <h1 className="text-3xl font-extrabold">$100.00</h1>
                    </div>

                    <Separator className="bg-gray-400"/>

                    <div className="overflow-y-auto tab-scroll-height">
                        <div className="flex flex-row justify-between pt-4 pb-1">
                            <h2 className="text-2xl font-bold">Aaron</h2>
                            <h2 className="text-2xl font-bold">$50.00</h2>
                        </div>
                        <div className="flex flex-row justify-between">
                            <h3 className="text-lg text-gray-400">Amenities</h3>
                            <h3 className="text-lg text-gray-400">$23.00</h3>
                        </div>
                        <div className="flex flex-row justify-between">
                            <h4 className="text-md text-gray-600">Flight</h4>
                            <h4 className="text-md text-gray-600">$5.00</h4>
                        </div>
                        <div className="flex flex-row justify-between pt-2">
                            <h3 className="text-lg text-gray-400">Ubers</h3>
                            <h3 className="text-lg text-gray-400">$23.00</h3>
                        </div>
                        <div className="flex flex-row justify-between">
                            <h4 className="text-md text-gray-600">To Airport</h4>
                            <h4 className="text-md text-gray-600">$5.00</h4>
                        </div>
                        <div className="flex flex-row justify-between pt-2">
                            <h3 className="text-lg text-gray-400">Food</h3>
                            <h3 className="text-lg text-gray-400">$23.00</h3>
                        </div>
                        <div className="flex flex-row justify-between">
                            <h4 className="text-md text-gray-600">Burger</h4>
                            <h4 className="text-md text-gray-600">$5.00</h4>
                        </div>

                        <div className="flex flex-row justify-between pt-4 pb-1">
                            <h2 className="text-2xl font-bold">Andrew</h2>
                            <h2 className="text-2xl font-bold">$50.00</h2>
                        </div>
                        <div className="flex flex-row justify-between">
                            <h3 className="text-lg text-gray-400">Amenities</h3>
                            <h3 className="text-lg text-gray-400">$23.00</h3>
                        </div>
                        <div className="flex flex-row justify-between">
                            <h4 className="text-md text-gray-600">Flight</h4>
                            <h4 className="text-md text-gray-600">$5.00</h4>
                        </div>
                        <div className="flex flex-row justify-between pt-2">
                            <h3 className="text-lg text-gray-400">Ubers</h3>
                            <h3 className="text-lg text-gray-400">$23.00</h3>
                        </div>
                        <div className="flex flex-row justify-between">
                            <h4 className="text-md text-gray-600">To Airport</h4>
                            <h4 className="text-md text-gray-600">$5.00</h4>
                        </div>
                        <div className="flex flex-row justify-between pt-2">
                            <h3 className="text-lg text-gray-400">Food</h3>
                            <h3 className="text-lg text-gray-400">$23.00</h3>
                        </div>
                        <div className="flex flex-row justify-between">
                            <h4 className="text-md text-gray-600">Burger</h4>
                            <h4 className="text-md text-gray-600">$5.00</h4>
                        </div>

                        <div className="flex flex-row justify-between pt-4 pb-1">
                            <h2 className="text-2xl font-bold">Tenzin</h2>
                            <h2 className="text-2xl font-bold">$50.00</h2>
                        </div>
                        <div className="flex flex-row justify-between">
                            <h3 className="text-lg text-gray-400">Amenities</h3>
                            <h3 className="text-lg text-gray-400">$23.00</h3>
                        </div>
                        <div className="flex flex-row justify-between">
                            <h4 className="text-md text-gray-600">Flight</h4>
                            <h4 className="text-md text-gray-600">$5.00</h4>
                        </div>
                        <div className="flex flex-row justify-between pt-2">
                            <h3 className="text-lg text-gray-400">Ubers</h3>
                            <h3 className="text-lg text-gray-400">$23.00</h3>
                        </div>
                        <div className="flex flex-row justify-between">
                            <h4 className="text-md text-gray-600">To Airport</h4>
                            <h4 className="text-md text-gray-600">$5.00</h4>
                        </div>
                        <div className="flex flex-row justify-between pt-2">
                            <h3 className="text-lg text-gray-400">Food</h3>
                            <h3 className="text-lg text-gray-400">$23.00</h3>
                        </div>
                        <div className="flex flex-row justify-between">
                            <h4 className="text-md text-gray-600">Burger</h4>
                            <h4 className="text-md text-gray-600">$5.00</h4>
                        </div>

                        <div className="h-10"/>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default TotalBar;