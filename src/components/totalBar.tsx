import { motion, useAnimate } from "framer-motion";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { ExpenseProps } from "@/types";

interface TotalBarProps {
    amenitiesCollection: ExpenseProps[];
    ubersCollection: ExpenseProps[];
    foodCollection: ExpenseProps[];
    tabOpen: () => void;
    tabClose: () => void;
}

const TotalBar: React.FC<TotalBarProps> = ({amenitiesCollection, ubersCollection, foodCollection, tabOpen, tabClose}) => {
    const [isOpen, setIsOpen] = useState(false);

    const [scope, animate] = useAnimate();

    const [expensesCounted, setExpensesCounted] = useState<string[]>([]);

    const [aaronTotal, setAaronTotal] = useState(0.0);
    const [aaronAmenities, setAaronAmenities] = useState(0.0); 
    const [aaronUbers, setAaronUbers] = useState(0.0);
    const [aaronFood, setAaronFood] = useState(0.0);

    const [andrewTotal, setAndrewTotal] = useState(0.0);
    const [andrewAmenities, setAndrewAmenities] = useState(0.0); 
    const [andrewUbers, setAndrewUbers] = useState(0.0);
    const [andrewFood, setAndrewFood] = useState(0.0);

    const [tenzinTotal, setTenzinTotal] = useState(0.0);
    const [tenzinAmenities, setTenzinAmenities] = useState(0.0); 
    const [tenzinUbers, setTenzinUbers] = useState(0.0);
    const [tenzinFood, setTenzinFood] = useState(0.0);

    const [total, setTotal] = useState(0.0);

    const handleTab = () => {
        if (!isOpen) {
            animate([
                ["#tab", { y: "-80%" }, { duration: 0.4, ease: "backOut" }]
            ]);
            animate([
                ["#items", { opacity: 1 }, { duration: 0.2, delay: 0.1 }]
            ]);
            tabOpen();
            setIsOpen(true);
        }
        else {
            animate([
                ["#items", { opacity: 0 }, { duration: 0.2 }]
            ]);
            animate([
                ["#tab", { y: "-11.5%" }, { duration: 0.6, ease: "anticipate" }]
            ]);
            tabClose();
            setIsOpen(false);
        }
    };

    const preciseCalculate = (current: number, addition: number) => {
        return parseFloat((current + addition).toFixed(2));
    };

    useEffect(() => {
        amenitiesCollection.filter(amenity => !expensesCounted.includes(amenity.id)).forEach(amenity => {
            setExpensesCounted(prev => [...prev, amenity.id]);
            if (amenity.people.includes("Aaron")) {
                setAaronAmenities(prev => preciseCalculate(prev, (amenity.amount / amenity.people.length)));
                setAaronTotal(prev => preciseCalculate(prev, (amenity.amount / amenity.people.length)));
            }
            if (amenity.people.includes("Andrew")) {
                setAndrewAmenities(prev => preciseCalculate(prev, (amenity.amount / amenity.people.length)));
                setAndrewTotal(prev => preciseCalculate(prev, (amenity.amount / amenity.people.length)));
            }
            if (amenity.people.includes("Tenzin")) {
                setTenzinAmenities(prev => preciseCalculate(prev, (amenity.amount / amenity.people.length)));
                setTenzinTotal(prev => preciseCalculate(prev, (amenity.amount / amenity.people.length)));
            }
            setTotal(prev => preciseCalculate(prev, amenity.amount));
        });

        ubersCollection.filter(uber => !expensesCounted.includes(uber.id)).forEach(uber => {
            setExpensesCounted(prev => [...prev, uber.id]);
            if (uber.people.includes("Aaron")) {
                setAaronUbers(prev => preciseCalculate(prev, (uber.amount / uber.people.length)));
                setAaronTotal(prev => preciseCalculate(prev, (uber.amount / uber.people.length)));
            }
            if (uber.people.includes("Andrew")) {
                setAndrewUbers(prev => preciseCalculate(prev, (uber.amount / uber.people.length)));
                setAndrewTotal(prev => preciseCalculate(prev, (uber.amount / uber.people.length)));
            }
            if (uber.people.includes("Tenzin")) {
                setTenzinUbers(prev => preciseCalculate(prev, (uber.amount / uber.people.length)));
                setTenzinTotal(prev => preciseCalculate(prev, (uber.amount / uber.people.length)));
            }
            setTotal(prev => preciseCalculate(prev, uber.amount));
        });

        foodCollection.filter(food => !expensesCounted.includes(food.id)).forEach(food => {
            setExpensesCounted(prev => [...prev, food.id]);
            if (food.people.includes("Aaron")) {
                setAaronFood(prev => preciseCalculate(prev, (food.amount / food.people.length)));
                setAaronTotal(prev => preciseCalculate(prev, (food.amount / food.people.length)));
            }
            if (food.people.includes("Andrew")) {
                setAndrewFood(prev => preciseCalculate(prev, (food.amount / food.people.length)));
                setAndrewTotal(prev => preciseCalculate(prev, (food.amount / food.people.length)));
            }
            if (food.people.includes("Tenzin")) {
                setTenzinFood(prev => preciseCalculate(prev, (food.amount / food.people.length)));
                setTenzinTotal(prev => preciseCalculate(prev, (food.amount / food.people.length)));
            }
            setTotal(prev => preciseCalculate(prev, food.amount));
        });
    }, [amenitiesCollection, ubersCollection, foodCollection]);

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
            <motion.div>
                <motion.div id="tab" initial={{ y: "0%" }} animate={{ y: "-11.5%", transition: { delay: 1.2, duration: 0.3 } }} onClick={handleTab} className={`h-full fixed left-0 top-full z-50 bg-slate-950 border-t-2 border-slate-800 rounded-t-xl drop-shadow-xl w-full px-5`}>
                    <div className="h-24 w-full flex flex-row justify-between items-center">
                        <h1 className="text-3xl font-extrabold">Total:</h1>
                        <h1 className="text-3xl font-extrabold">${total}</h1>
                    </div>

                    <Separator className="bg-gray-400"/>

                    <motion.div initial={{ opacity: 0 }} id="items" className="overflow-y-auto tab-scroll-height">
                        <div className="flex flex-row justify-between pt-4 pb-1">
                            <h2 className="text-2xl font-bold">Aaron</h2>
                            <h2 className="text-2xl font-bold">${aaronTotal.toFixed(2)}</h2>
                        </div>
                        <div className="flex flex-row justify-between">
                            <h3 className="text-lg text-gray-400">Amenities</h3>
                            <h3 className="text-lg text-gray-400">${aaronAmenities}</h3>
                        </div>
                        {amenitiesCollection.filter(amenity => amenity.people.includes("Aaron")).length == 0 && <h4 className="text-md text-gray-600">---</h4>}
                        {amenitiesCollection.filter(amenity => amenity.people.includes("Aaron")).map((amenity, index) => (
                            <div key={index} className="flex flex-row justify-between">
                                <h4 className="text-md text-gray-600">{amenity.name}</h4>
                                <h4 className="text-md text-gray-600">${(amenity.amount / amenity.people.length).toFixed(2)}</h4>
                            </div>
                        ))}
                        <div className="flex flex-row justify-between pt-2">
                            <h3 className="text-lg text-gray-400">Ubers</h3>
                            <h3 className="text-lg text-gray-400">${aaronUbers.toFixed(2)}</h3>
                        </div>
                        {ubersCollection.filter(uber => uber.people.includes("Aaron")).length == 0 && <h4 className="text-md text-gray-600">---</h4>}
                        {ubersCollection.filter(uber => uber.people.includes("Aaron")).map((uber, index) => (
                            <div key={index} className="flex flex-row justify-between">
                                <h4 className="text-md text-gray-600">{uber.name}</h4>
                                <h4 className="text-md text-gray-600">${(uber.amount / uber.people.length).toFixed(2)}</h4>
                            </div>
                        ))}
                        <div className="flex flex-row justify-between pt-2">
                            <h3 className="text-lg text-gray-400">Food</h3>
                            <h3 className="text-lg text-gray-400">${aaronFood.toFixed(2)}</h3>
                        </div>
                        {foodCollection.filter(food => food.people.includes("Aaron")).length == 0 && <h4 className="text-md text-gray-600">---</h4>}
                        {foodCollection.filter(food => food.people.includes("Aaron")).map((food, index) => (
                            <div key={index} className="flex flex-row justify-between">
                                <h4 className="text-md text-gray-600">{food.name}</h4>
                                <h4 className="text-md text-gray-600">${(food.amount / food.people.length).toFixed(2)}</h4>
                            </div>
                        ))}

                        <div className="flex flex-row justify-between pt-4 pb-1">
                            <h2 className="text-2xl font-bold">Andrew</h2>
                            <h2 className="text-2xl font-bold">${andrewTotal.toFixed(2)}</h2>
                        </div>
                        <div className="flex flex-row justify-between">
                            <h3 className="text-lg text-gray-400">Amenities</h3>
                            <h3 className="text-lg text-gray-400">${andrewAmenities.toFixed(2)}</h3>
                        </div>
                        {amenitiesCollection.filter(amenity => amenity.people.includes("Andrew")).length == 0 && <h4 className="text-md text-gray-600">---</h4>}
                        {amenitiesCollection.filter(amenity => amenity.people.includes("Andrew")).map((amenity, index) => (
                            <div key={index} className="flex flex-row justify-between">
                                <h4 className="text-md text-gray-600">{amenity.name}</h4>
                                <h4 className="text-md text-gray-600">${(amenity.amount / amenity.people.length).toFixed(2)}</h4>
                            </div>
                        ))}
                        <div className="flex flex-row justify-between pt-2">
                            <h3 className="text-lg text-gray-400">Ubers</h3>
                            <h3 className="text-lg text-gray-400">${andrewUbers.toFixed(2)}</h3>
                        </div>
                        {ubersCollection.filter(uber => uber.people.includes("Andrew")).length == 0 && <h4 className="text-md text-gray-600">---</h4>}
                        {ubersCollection.filter(uber => uber.people.includes("Andrew")).map((uber, index) => (
                            <div key={index} className="flex flex-row justify-between">
                                <h4 className="text-md text-gray-600">{uber.name}</h4>
                                <h4 className="text-md text-gray-600">${(uber.amount / uber.people.length).toFixed(2)}</h4>
                            </div>
                        ))}
                        <div className="flex flex-row justify-between pt-2">
                            <h3 className="text-lg text-gray-400">Food</h3>
                            <h3 className="text-lg text-gray-400">${andrewFood.toFixed(2)}</h3>
                        </div>
                        {foodCollection.filter(food => food.people.includes("Andrew")).length == 0 && <h4 className="text-md text-gray-600">---</h4>}
                        {foodCollection.filter(food => food.people.includes("Andrew")).map((food, index) => (
                            <div key={index} className="flex flex-row justify-between">
                                <h4 className="text-md text-gray-600">{food.name}</h4>
                                <h4 className="text-md text-gray-600">${(food.amount / food.people.length).toFixed(2)}</h4>
                            </div>
                        ))}

                        <div className="flex flex-row justify-between pt-4 pb-1">
                            <h2 className="text-2xl font-bold">Tenzin</h2>
                            <h2 className="text-2xl font-bold">${tenzinTotal.toFixed(2)}</h2>
                        </div>
                        <div className="flex flex-row justify-between">
                            <h3 className="text-lg text-gray-400">Amenities</h3>
                            <h3 className="text-lg text-gray-400">${tenzinAmenities.toFixed(2)}</h3>
                        </div>
                        {amenitiesCollection.filter(amenity => amenity.people.includes("Tenzin")).length == 0 && <h4 className="text-md text-gray-600">---</h4>}
                        {amenitiesCollection.filter(amenity => amenity.people.includes("Tenzin")).map((amenity, index) => (
                            <div key={index} className="flex flex-row justify-between">
                                <h4 className="text-md text-gray-600">{amenity.name}</h4>
                                <h4 className="text-md text-gray-600">${(amenity.amount / amenity.people.length).toFixed(2)}</h4>
                            </div>
                        ))}
                        <div className="flex flex-row justify-between pt-2">
                            <h3 className="text-lg text-gray-400">Ubers</h3>
                            <h3 className="text-lg text-gray-400">${tenzinUbers.toFixed(2)}</h3>
                        </div>
                        {ubersCollection.filter(uber => uber.people.includes("Tenzin")).length == 0 && <h4 className="text-md text-gray-600">---</h4>}
                        {ubersCollection.filter(uber => uber.people.includes("Tenzin")).map((uber, index) => (
                            <div key={index} className="flex flex-row justify-between">
                                <h4 className="text-md text-gray-600">{uber.name}</h4>
                                <h4 className="text-md text-gray-600">${(uber.amount / uber.people.length).toFixed(2)}</h4>
                            </div>
                        ))}
                        <div className="flex flex-row justify-between pt-2">
                            <h3 className="text-lg text-gray-400">Food</h3>
                            <h3 className="text-lg text-gray-400">${tenzinFood.toFixed(2)}</h3>
                        </div>
                        {foodCollection.filter(food => food.people.includes("Tenzin")).length == 0 && <h4 className="text-md text-gray-600">---</h4>}
                        {foodCollection.filter(food => food.people.includes("Tenzin")).map((food, index) => (
                            <div key={index} className="flex flex-row justify-between">
                                <h4 className="text-md text-gray-600">{food.name}</h4>
                                <h4 className="text-md text-gray-600">${(food.amount / food.people.length).toFixed(2)}</h4>
                            </div>
                        ))}

                        <div className="h-10"/>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default TotalBar;