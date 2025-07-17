"use client";
import Image from "next/image";
import React from "react";
import { BsCheckCircle } from "react-icons/bs";
import FiverrLogo from "@/components/logo";

function FiverrBusiness() {
  return (
    <div className="bg-[#0d084d] flex flex-col-reverse md:flex-row px-4 sm:px-8 md:px-20 py-12 md:py-16 gap-10">
      {/* Left Content */}
      <div className="text-white flex flex-col gap-6 justify-center items-start w-full md:w-1/2">
        <div className="flex gap-2 items-center">
          <FiverrLogo textColor={"#fff"} />
          <span className="text-white text-2xl sm:text-3xl font-bold">Business</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold">A solution built for business</h2>
        <h4 className="text-base sm:text-lg">
          Upgrade to a curated experience to access vetted talent and exclusive tools
        </h4>
        <ul className="flex flex-col gap-4">
          {[
            "Talent matching",
            "Dedicated account management",
            "Team collaboration tools",
            "Business payment solutions",
          ].map((item) => (
            <li key={item} className="flex gap-2 items-center">
              <BsCheckCircle className="text-[#1DBF73] text-xl" />
              <span className="text-white">{item}</span>
            </li>
          ))}
        </ul>
        <button
          className="border text-base font-medium px-5 py-2 border-[#1DBF73] bg-[#1DBF73] text-white rounded-md"
          type="button"
        >
          Explore GigMarket Business
        </button>
      </div>

      {/* Right Image */}
      <div className="relative h-64 sm:h-96 md:h-[512px] w-full md:w-1/2">
        <Image src="/business.webp" alt="business" fill className="object-contain" />
      </div>
    </div>
  );
}

export default FiverrBusiness;
