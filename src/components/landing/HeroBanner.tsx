"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import GroupsIcon from "@mui/icons-material/Groups";
import SecurityIcon from "@mui/icons-material/Security";

function HomeBanner() {
  const router = useRouter();
  const [searchData, setSearchData] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const fullText = "What are you looking for?";

  useEffect(() => {
    let index = 0;
    let typingInterval: NodeJS.Timeout;

    const startTyping = () => {
      typingInterval = setInterval(() => {
        setPlaceholder(fullText.slice(0, index + 1));
        index++;
        if (index === fullText.length) {
          clearInterval(typingInterval);
          setTimeout(() => {
            index = 0;
            setPlaceholder("");
            startTyping();
          }, 2000);
        }
      }, 100);
    };

    startTyping();
    return () => clearInterval(typingInterval);
  }, []);

  const stats = [
    { num: "960M", label: "Total Freelancer" },
    { num: "850M", label: "Positive Review" },
    { num: "98M", label: "Order received" },
    { num: "250M", label: "Projects Completed" },
  ];

  return (
    <div className="relative py-14 px-4 sm:px-8 lg:px-20 text-white overflow-hidden min-h-[30pc] md:min-h-[45pc]">
      {/* Background */}
      <Image
        src="/pattern.png"
        alt="Background Pattern"
        fill
        className="object-cover z-0"
        priority
      />
      <div className="absolute inset-0 bg-[#0e5135]/80 z-0" />

      <div className="relative pt-8 md:pt-20 z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center h-full">
        {/* Left Side */}
        <div className="flex flex-col gap-6 justify-center">
          <h1 className="text-3xl md:text-5xl font-bold leading-snug">
            Find the perfect freelance services for your business
          </h1>
          <p className="pb-8 md:pb-15 text-gray-200 text-sm md:text-base max-w-lg">
            Work with talented people at the most affordable price to get the
            most out of your time and cost
          </p>

          {/* Search Bar */}
          <div className="relative w-full max-w-2xl">
            <div className="h-20 w-[120%] bg-white rounded-full flex flex-col sm:flex-row items-center overflow-hidden shadow-lg">
              <div className="flex items-center flex-1 w-full">
                <SearchIcon className="text-gray-500 text-lg ml-4" />
                <input
                  type="text"
                  className="flex-1 py-3 px-3 text-black text-sm outline-none"
                  placeholder={placeholder}
                  value={searchData}
                  onChange={(e) => setSearchData(e.target.value)}
                />
              </div>
              <button
                className="cursor-pointer h-20 w-full sm:w-40 bg-[#1DBF73] text-white px-6 py-3 font-medium hover:bg-[#19a564] transition-colors"
                onClick={() => router.push(`/publicGigs?search=${searchData}`)}
              >
                Search
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold">{stat.num}</p>
                <p className="text-xs text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="group relative sm:hidden md:flex justify-center lg:justify-end items-end h-full gap-4">
          {/* Man Image */}
          <div className="relative w-44 md:w-60 h-72 md:h-96 overflow-hidden shadow-lg z-[-1]">
            <Image src="/man.png" alt="Man" fill className="object-cover transition-all duration-500 group-hover:brightness-110" />
            {/* Light Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-4 right-4 bg-white text-black text-xs px-3 py-2 rounded-lg shadow flex items-center gap-2 transition-all duration-500 group-hover:-translate-x-1">
              <WorkspacePremiumIcon fontSize="small" sx={{ color: "green" }} />
              <div>
                Proof of quality <br />
                <span className="text-gray-500 text-[10px]">
                  Lorem Ipsum Dolar Amet
                </span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-white text-black text-xs px-3 py-2 rounded-lg shadow flex items-center gap-2 transition-all duration-500 group-hover:-translate-x-1">
              <GroupsIcon fontSize="small" sx={{ color: "green" }} />
              <span>58M+ Professionals</span>
            </div>
          </div>

          {/* Woman Image */}
          <div className="relative w-48 md:w-72 h-[28rem] md:h-[34rem] overflow-hidden shadow-lg z-[-1]">
            <Image src="/woman.png" alt="Woman" fill className="object-cover transition-all duration-500 group-hover:brightness-110" />
            {/* Light Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-4 right-4 bg-white text-black text-xs px-3 py-2 rounded-lg shadow flex items-center gap-2 transition-all duration-500 group-hover:-translate-x-1">
              <SecurityIcon fontSize="small" sx={{ color: "green" }} />
              <div>
                Safe and secure <br />
                <span className="text-gray-500 text-[10px]">
                  Lorem Ipsum Dolar Amet
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeBanner;
