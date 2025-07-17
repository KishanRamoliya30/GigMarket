"use client";

import Image from "next/image";
import React from "react";
import { BsCheckCircle } from "react-icons/bs";
import { everythingData } from "../../../utils/constants";

function Everything() {
  return (
    <div className="bg-[#f1fdf7] flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 md:px-16 lg:px-24 py-16 gap-10">
      {/* Text Content */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-3xl md:text-4xl mb-6 text-[#404145] font-bold text-center lg:text-left">
          The best part? Everything.
        </h2>
        <ul className="flex flex-col gap-8">
          {everythingData.map(({ title, subtitle }) => (
            <li key={title}>
              <div className="flex items-center gap-2 text-lg md:text-xl text-[#404145]">
                <BsCheckCircle className="text-[#62646a]" />
                <h4>{title}</h4>
              </div>
              <p className="text-[#62646a] text-sm md:text-base mt-1">
                {subtitle}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Image */}
      <div className="relative w-full lg:w-1/2 h-64 sm:h-80 md:h-96">
        <Image
          src="/everything.webp"
          alt="everything"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default Everything;
