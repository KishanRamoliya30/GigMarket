"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

function HomeBanner() {
  const router = useRouter();
  const [image, setImage] = useState(1);
  const [searchData, setSearchData] = useState("");
  const fullText = "Search any service here...";
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    const interval = setInterval(
      () => setImage(image >= 6 ? 1 : image + 1),
      10000
    );
    return () => clearInterval(interval);
  }, [image]);

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

  return (
    <div className="h-[680px] relative bg-cover">
      {/* Background Images */}
      <div className="absolute top-0 right-0 w-[110vw] h-full transition-opacity z-0">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <Image
            key={num}
            alt="hero"
            src={`/bg-hero${num}.webp`}
            fill
            className={`${
              image === num ? "opacity-100" : "opacity-0"
            } transition-all duration-1000`}
          />
        ))}
      </div>

      {/* Foreground Content */}
      <div className="z-10 relative w-full max-w-[650px] flex justify-center flex-col h-full gap-3 md:gap-5 p-4 md:p-0 md:ml-20">
        <h1 className="text-white text-2xl xs:text-3xl sm:text-4xl md:text-5xl leading-tight md:leading-snug">
          Find the perfect&nbsp;
          <i>freelance</i>
          <br className="hidden xs:block" />
          services for your business
        </h1>

        {/* Search Bar - joined input and button */}
        <div className="flex w-full flex-col sm:flex-row gap-2 xs:gap-0">
          <div className="relative flex-grow">
            <IoSearchOutline className="absolute text-gray-500 text-xl md:text-2xl h-full left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              className="h-12 md:h-14 w-full pl-10 rounded-md xs:rounded-r-none bg-white text-sm md:text-base"
              placeholder={placeholder}
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
            />
          </div>
          <button
            className=" w-auto h-12 md:h-14 bg-[#1DBF73] text-white px-4 md:px-10 text-sm md:text-lg font-semibold rounded-md xs:rounded-l-none cursor-pointer hover:bg-[#19a564] transition-colors"
            onClick={() => router.push(`/publicGigs?search=${searchData}`)}
          >
            Search
          </button>
        </div>

        {/* Popular Tags */}
        <div className="text-white flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-xs md:text-sm mt-2 md:mt-4">
          <span className="whitespace-nowrap">Popular:</span>
          <ul className="flex flex-wrap gap-2 md:gap-3">
            {["website design", "wordpress", "logo design", "ai services"].map(
              (term) => (
                <li
                  key={term}
                  className="py-1 px-2 md:px-3 border rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer text-xs md:text-sm"
                  onClick={() => router.push(`/publicGigs?search=${term}`)}
                >
                  {term.charAt(0).toUpperCase() + term.slice(1)}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomeBanner;
