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
import React, { useState, useEffect } from "react";
import { db } from "@/firebase/config";
import { collection, getDocs } from 'firebase/firestore';
import { ExpenseProps } from "@/types";
import AddExpense from "./addExpense";

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

function Expense({id, name, amount, people}: ExpenseProps) {
  return (
    <div className="grid grid-cols-5 gap-4 py-2 px-4 w-full items-center bg-slate-800 rounded-lg">
      <div className="col-span-3">
        <p className="text-2xl font-bold">{name}</p>
        {people.map((person, index) => (
            <React.Fragment key={index}>
              <span className="text-xs font-medium text-gray-400 inline-block">{person}</span>
              {(index != people.length - 1) && <span className="text-gray-400">, </span>}
            </React.Fragment>
          ))}
      </div>
      <p className="text-xl font-bold col-span-1">${amount.toFixed(2)}</p>
    </div> 
  );
}

const Category: React.FC<CategoryProps> = ({name, nameSingle, description, collection}) => {
  const [expenses, setExpenses] = useState<ExpenseProps[]>();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const fetchedData = await fetchCollectionData(collection);
        setExpenses(fetchedData);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      }
    };
    fetchExpenses();
  }, []);

  return (
    <Card className="bg-slate-950 border-slate-800 rounded-2xl border-2">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription className="text-gray-400">{description}</CardDescription>
          <Separator className="bg-gray-400"/>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {expenses?.map(expense => (
              <Expense key={expense.id} id={expense.id} name={expense.name} amount={expense.amount} people={expense.people}/>
            ))}
            <AddExpense name={nameSingle} description={description}/>
          </div>
        </CardContent>
      </Card>
  );
}

export default Category;