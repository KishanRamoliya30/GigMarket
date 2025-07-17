"use client";
import Image from "next/image";

function Companies() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center text-gray-400 text-lg sm:text-xl md:text-2xl font-bold min-h-[11vh] px-4 text-center">
      <span className="mb-4 sm:mb-0 sm:mr-4">Trusted by:</span>
      <ul className="flex flex-wrap justify-center sm:justify-start gap-6 sm:gap-10">
        {[1, 2, 3, 4, 5].map((num) => (
          <li key={num} className="relative h-16 w-16 sm:h-20 sm:w-20">
            <Image
              src={`/trusted${num}.png`}
              alt={`trusted brand ${num}`}
              fill
              className="object-contain"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Companies;
