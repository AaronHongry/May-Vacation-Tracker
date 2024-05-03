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
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import EditExpense from "./editExpense";
import { Trash2 } from "lucide-react";
import DeleteExpense from "./deleteExpense";
 
interface CategoryProps {
  name: string;
  nameSingle: string;
  description: string;
  collection: string;
  passExpense: (expense: ExpenseProps[]) => void;
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
    <motion.div initial={{ opacity: 0, x: "-30%" }} animate={{ opacity: 1, x: "0%", transition: { delay: 0.25 } }} transition={{ duration: 1, ease: [0, 1, 0, 1] }} className="grid grid-cols-5 gap-4 py-2 px-4 w-full items-center bg-slate-800 rounded-lg flex-shrink-0 flex-grow-0">
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

const Category: React.FC<CategoryProps> = ({name, nameSingle, description, collection, passExpense}) => {
  const [expenses, setExpenses] = useState<ExpenseProps[]>();
  const [expenseOpen, setExpenseOpen] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState<string | null>(null);
  
  const [tapPos, setTapPos] = useState(0.0);
  const [doubleTap, setDoubleTap] = useState("");

  const fetchExpenses = async () => {
    try {
      const fetchedData = await fetchCollectionData(collection);
      console.log("fetchCat");
      setExpenses(fetchedData);
      passExpense(fetchedData);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  
  useEffect(() => {
    fetchExpenses();
  }, [expenseOpen, deleteOpen]);

  const handleExpensesChanged = () => {
    fetchExpenses();
    setTimeout(() => {
      setExpenseOpen(null);
      setDeleteOpen(null);
    }, 400);
  }; 

  const handleExpenseClose = () => {
    setTimeout(() => {
      setExpenseOpen(null);
      setDeleteOpen(null);
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
  const handleDeleteOpen = (event: MouseEvent | TouchEvent, info: PanInfo, id: string) => {
    const currentPoint = Math.abs(info.point.x - tapPos) * 0.3076;
    if (currentPoint > 40) {
      setDeleteOpen(id);
    }
  };

  return (
        <Card className="bg-slate-950 border-slate-800 rounded-2xl border-2">
          <motion.div className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{name}</CardTitle>
              <CardDescription className="text-gray-400">{description}</CardDescription>
              <Separator className="bg-gray-400"/>
            </CardHeader>
            <CardContent>
              <motion.div className="flex flex-col gap-3">
                <AnimatePresence>
                  {expenses?.length == 0 && <p className="text-gray-400 text-sm text-center">There are no expenses added!</p>}
                  {expenses?.map(expense =>
                    <motion.div key={expense.id}>
                      <motion.div exit={{ x: "-30%", opacity: 0, transition: { duration: 1, ease: [0, 1, 0, 1] } }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={{ left: 0.2, right: 0 }} onDragStart={(e, i) => {setTapPos(i.point.x);}} onDragEnd={(e, i) => handleDeleteOpen(e, i, expense.id)} whileTap={{ scale: 1.1, backgroundColor: "rgb(51 65 85)"}} onClick={() => {handleExpenseEdit(expense.id)}}>
                          <Expense id={expense.id} name={expense.name} amount={expense.amount} people={expense.people} date={expense.date}/>             
                      </motion.div>
                      {expenseOpen == expense.id && <EditExpense id={expense.id} name={name} nameSingle={nameSingle} onExpenseEdit={handleExpensesChanged} isOpen={expenseOpen == expense.id} onClose={handleExpenseClose} currentName={expense.name} currentAmount={expense.amount} currentPeople={expense.people}/>}
                      {deleteOpen == expense.id && <DeleteExpense id={expense.id} name={name} nameSingle={nameSingle} onExpenseDelete={handleExpensesChanged} isOpen={deleteOpen == expense.id} onClose={handleExpenseClose} currentName={expense.name} currentAmount={expense.amount} currentPeople={expense.people} currentDate={expense.date}/>}
                    </motion.div> 
                  )}
                  </AnimatePresence>
              </motion.div>
              
            </CardContent>
            <CardFooter className="justify-center items-center">
              <AddExpense name={name} nameSingle={nameSingle} description={description} onExpenseAdd={handleExpensesChanged}/>
            </CardFooter>
            </motion.div>
        </Card>
  );
}

export default Category;