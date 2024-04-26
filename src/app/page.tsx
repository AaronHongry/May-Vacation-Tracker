"use client";

import React, { useState, useEffect } from "react";
import { ExpenseProps } from "@/types";
import Category from "@/components/category";

export default function Home() {
  const [amenities, setAmenities] = useState<ExpenseProps[]>();
  const [ubers, setUbers] = useState<ExpenseProps[]>(); 
  const [food, setFood] = useState<ExpenseProps[]>(); 

  return (
    <div className="p-4">
      <div className="p-14">
        <h1 className="text-4xl text-center font-extrabold">Los Angeles</h1>
        <h2 className="text-lg text-center font-semibold text-gray-400">May 3rd - May 8th</h2>
      </div>

      <div className="flex flex-col gap-8">
        <Category name="Amenities" nameSingle="Amenity" description="Add accomodations, tickets, etc." collection="amenities"/>
        <Category name="Ubers" nameSingle="Uber" description="Add all the Ubers, Lyfts, etc." collection="ubers"/>
        <Category name="Food" nameSingle="Food" description="Add food, snacks, drinks, etc." collection="food"/>
      </div>
    </div>
  );
}
