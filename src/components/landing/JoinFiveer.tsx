"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

function JoinFiverr() {
  const router = useRouter()
  return (
    <div className="relative py-12 md:px-16 sm:px-10 md:px-20 my-10 sm:my-16">
      {/* Background Image */}
      <div className="relative w-full h-80 sm:h-96 rounded-sm overflow-hidden">
        <Image
          src="/bg-signup.webp"
          alt="signup"
          fill
          className="object-cover"
        />

        {/* Text Content */}
        <div className="absolute z-10 inset-0 flex flex-col justify-center items-start px-6 sm:px-10 md:px-16">
          <h4 className="text-white text-2xl sm:text-4xl md:text-5xl mb-6 font-semibold leading-snug max-w-xl">
            Freelance services at your <i>fingertips</i>
          </h4>
          <button
            className="border cursor-pointer text-sm sm:text-base font-medium px-5 py-2 border-[#1DBF73] bg-[#1DBF73] text-white rounded-md"
            type="button"
            onClick={()=>router.push("/signup")}
          >
            Join GigMarket
          </button>
        </div>

        <div className="absolute inset-0 bg-black/30 z-0 rounded-sm"></div>
      </div>
    </div>
  );
}

export default JoinFiverr;
