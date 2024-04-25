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

interface ExpenseProps {
  id: string;
  name: string;
  amount: number;
  people: string[];
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
    <div className="grid grid-cols-5 gap-4 py-2 px-4 w-full bg-slate-900">
      <p className="text-md text-slate-50 col-span-1 font-bold">{name}</p>
      <Separator orientation="vertical" className="bg-slate-300 col-span-1"/>
      <div className="col-span-1 justify-self-center">
        {people.map((person, index) => (
            <React.Fragment key={index}>
              <span className="text-xs font-medium text-slate-500 inline-block">{person}</span>
              {(index != people.length - 1) && <span className="text-slate-500">, </span>}
            </React.Fragment>
          ))}
      </div>
      <Separator orientation="vertical" className="bg-slate-300 col-span-1 justify-self-end"/>
      {amount > 0 ? <p className="text-md text-slate-950 col-span-1 justify-self-end font-bold">${amount.toFixed(2)}</p> : <p className="text-md text-slate-950 col-span-1 justify-self-end font-bold">-${(amount * -1).toFixed(2)}</p>}
    </div> 
  );
}

export default function Home() {
  const [amenities, setAmenities] = useState<ExpenseProps[]>();
  const [ubers, setUbers] = useState<ExpenseProps[]>(); 
  const [food, setFood] = useState<ExpenseProps[]>(); 

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const fetchedData = await fetchCollectionData("amenities");
        setAmenities(fetchedData);
      } catch (error) {
        console.error("Failed to fetch amenities:", error);
      }
    };
    fetchAmenities();
  }, []);

  return (
    <div className="p-6">
      <Card className="bg-slate-950 border-slate-800 p-2">
        <CardHeader className="">
          <CardTitle>Amenities</CardTitle>
          <CardDescription className="text-gray-400">Add accomodations, tickets, etc.</CardDescription>
          <Separator className="bg-gray-400"/>
        </CardHeader>
        <CardContent>
          {amenities?.map(amenity => (
            <React.Fragment key={amenity.id}>
              <Expense id={amenity.id} name={amenity.name} amount={amenity.amount} people={amenity.people}/>
            </React.Fragment>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
