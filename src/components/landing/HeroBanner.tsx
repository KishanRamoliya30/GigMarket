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
    const interval = setInterval(() => setImage(image >= 6 ? 1 : image + 1), 10000);
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
      <div className="z-10 relative w-full max-w-[650px] flex justify-center flex-col h-full gap-5 ml-5 sm:ml-10 md:ml-20 px-4 sm:px-0">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl leading-snug">
          Find the perfect&nbsp;
          <i>freelance</i>
          <br />
          services for your business
        </h1>

        {/* Search Bar - joined input and button */}
        <div className="flex w-full">
          <div className="relative flex-grow">
            <IoSearchOutline className="absolute text-gray-500 text-2xl h-full left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              className="h-14 w-full pl-10 rounded-md rounded-r-none bg-white"
              placeholder={placeholder}
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
            />
          </div>
          <button
            className="h-14 bg-[#1DBF73] text-white px-6 sm:px-10 text-base sm:text-lg font-semibold rounded-r-md"
            onClick={() => router.push(`/search?q=${searchData}`)}
          >
            Search
          </button>
        </div>

        {/* Popular Tags */}
        <div className="text-white flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm mt-4">
          <span>Popular:</span>
          <ul className="flex flex-wrap gap-3">
            {["website design", "wordpress", "logo design", "ai services"].map((term) => (
              <li
                key={term}
                className="py-1 px-3 border rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
                onClick={() => router.push(`/search?q=${term}`)}
              >
                {term.charAt(0).toUpperCase() + term.slice(1)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomeBanner;
