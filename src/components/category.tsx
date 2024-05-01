"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React, { useState, useEffect, useRef } from "react";
import { ExpenseProps } from "@/types";
import AddExpense from "./addExpense";
import { db } from "@/firebase/config";
import { collection, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform} from "framer-motion";
import EditExpense from "./editExpense";
import { Trash2 } from "lucide-react";
 
interface CategoryProps {
  name: string;
  nameSingle: string;
  description: string;
  collection: string;
}

async function fetchCollectionData(collectionName: string): Promise<ExpenseProps[]> {
  const collectionRef = collection(db, collectionName);
  const querySnapshot = await getDocs(collectionRef);

  const documents: ExpenseProps[] = [];
  querySnapshot.forEach((doc) => {
      documents.push({...doc.data()  as ExpenseProps});
  });

  return documents;
}

function Expense({id, name, amount, people, date}: ExpenseProps) {
  return (
    <motion.div initial={{ opacity: 0, x: "-30%" }} animate={{ opacity: 1, x: "0%", transition: { delay: 0.25 } }} transition={{ duration: 1, ease: [0, 1, 0, 1] }} className="grid grid-cols-5 gap-4 py-2 px-4 w-full items-center bg-slate-800 rounded-lg ">
      <div className="col-span-3">
        <p className="text-2xl font-bold">{name}</p>
        {people.map((person, index) => (
            <React.Fragment key={index}>
              <span className="text-xs font-medium text-gray-400 inline-block">{person}</span>
              {(index != people.length - 1) && <span className="text-gray-400">, </span>}
            </React.Fragment>
          ))}
        <p className="text-xs font-medium text-gray-600">{date}</p>
      </div>
      <p className="text-xl font-bold col-span-1">${amount.toFixed(2)}</p>
    </motion.div> 
  );
}

const Category: React.FC<CategoryProps> = ({name, nameSingle, description, collection}) => {
  const [expenses, setExpenses] = useState<ExpenseProps[]>();
  const [expenseOpen, setExpenseOpen] = useState<string | null>(null);
  
  const [tapPos, setTapPos] = useState(0.0);
  const [doubleTap, setDoubleTap] = useState("");

  const x = useMotionValue(0);
  const opacity = useTransform(x, [-40, 0], [0.4, 0]);
  const expensesRef = useRef(new Map);

  const fetchExpenses = async () => {
    try {
      const fetchedData = await fetchCollectionData(collection);
      console.log("fetchCat");
      setExpenses(fetchedData);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [expenseOpen]);

  const handleExpensesChanged = () => {
    fetchExpenses();
    setTimeout(() => {
      setExpenseOpen(null);
    }, 400);
  }; 

  const handleExpenseClose = () => {
    setTimeout(() => {
      setExpenseOpen(null);
    }, 600);
  };

  const handleExpenseEdit = (id: string) => {
    setDoubleTap(i => {
      if (i == id) {
        setExpenseOpen(id);
        setDoubleTap("");
      }
      return id;
    });
    setTimeout(() => setDoubleTap(""), 1000);
  }

  const handleDelete = (event: MouseEvent | TouchEvent, info: PanInfo) => {
    const currentPoint = Math.abs(info.point.x - tapPos) * 0.3076;
    console.log(currentPoint)
    if (currentPoint < -130) {
      console.log(currentPoint);
    }
  };

  return (
    <AnimatePresence>
      <Card className="bg-slate-950 border-slate-800 rounded-2xl border-2">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{name}</CardTitle>
            <CardDescription className="text-gray-400">{description}</CardDescription>
            <Separator className="bg-gray-400"/>
          </CardHeader>
          <CardContent>
            <motion.div layout animate={{ transition: { duration: 1 } }} className="flex flex-col gap-3">
              {expenses?.length == 0 && <p className="text-gray-400 text-sm text-center">There are no expenses added!</p>}
              {expenses?.map(expense => (
                <div key={expense.id}>
                  <motion.div className="relative overflow-hidden" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={{ left: 0.2, right: 0 }} onDragStart={(e, i) => {setTapPos(i.point.x)}} whileTap={{ scale: 1.1, backgroundColor: "rgb(51 65 85)"}} onDrag={handleDelete} onDragEnd={()=>{}} onClick={() => {handleExpenseEdit(expense.id)}} style={{x}}>
                    <motion.div id="delete" className={`absolute rounded-xl z-40 w-full h-full bg-red-500 flex justify-center items-center`} style={{opacity: opacity}}>
                      <Trash2 className="absolute rounded-xl size-14 text-red-500 z-50 "/>
                      <div className="absolute w-full h-full z-30 rounded-xl bg-red-400"></div>
                    </motion.div>
                    <Expense id={expense.id} name={expense.name} amount={expense.amount} people={expense.people} date={expense.date}/>
                  </motion.div>
                  {expenseOpen == expense.id && <EditExpense id={expense.id} name={name} nameSingle={nameSingle} onExpenseEdit={handleExpensesChanged} isOpen={expenseOpen == expense.id} onClose={handleExpenseClose} currentName={expense.name} currentAmount={expense.amount} currentPeople={expense.people}/>}
                </div> 
              ))}
            </motion.div>
          </CardContent>
          <CardFooter className="justify-center items-center">
            <AddExpense name={name} nameSingle={nameSingle} description={description} onExpenseAdd={handleExpensesChanged}/>
          </CardFooter>
      </Card>
    </AnimatePresence>
  );
}

export default Category;