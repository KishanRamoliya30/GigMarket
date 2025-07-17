"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { popularServicesData } from "../../../utils/constants";

function PopularServices() {
  const router = useRouter();

  return (
    <section className="px-4 sm:px-10 lg:px-20 py-16">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-8 text-[#404145] font-bold">
        Popular Services
      </h2>
      
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {popularServicesData.map(({ name, label, image }) => (
          <li
            key={name}
            className="relative cursor-pointer group h-80 w-full max-w-[18rem] mx-auto"
            onClick={() => router.push(`/search?q=${name.toLowerCase()}`)}
          >
            {/* Text Overlay */}
            <div className="absolute z-10 text-white left-4 top-4">
              <span className="text-sm">{label}</span>
              <h6 className="font-extrabold text-xl sm:text-2xl">{name}</h6>
            </div>

            {/* Image */}
            <div className="relative w-full h-full rounded-md overflow-hidden shadow-md">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PopularServices;
