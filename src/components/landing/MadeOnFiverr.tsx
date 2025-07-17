"use client";

import Image from "next/image";
import { FavoriteBorderOutlined, MoreHoriz } from "@mui/icons-material";
import { useState } from "react";
import { portfolioItems } from "../../../utils/constants";

const MadeOnFiverr = () => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const toggleMenu = (id: number) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-16 px-4 md:px-10 bg-white">
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-10">
        Made on Fiverr
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {portfolioItems.map((gig) => (
          <div
            key={gig.id}
            className="relative group rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105"
          >
            {/* Image */}
            <Image
              src={gig.image}
              alt={gig.title}
              width={400}
              height={250}
              className="object-cover w-full h-[230px]"
            />

            {/* Hover overlay with text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm font-semibold">
                  Featured in: {gig.title}
                </p>
                <p className="text-sm">by: {gig.subtitle}</p>
              </div>
            </div>

            {/* Like icon (top-left) */}
            <div className="absolute top-3 left-3 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 z-10">
              <FavoriteBorderOutlined
                fontSize="small"
                className="text-gray-700"
              />
            </div>

            {/* 3 Dots icon (top-right) */}
            <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 z-10">
              <button onClick={() => toggleMenu(gig.id)}>
                <MoreHoriz fontSize="small" />
              </button>

              {openMenuId === gig.id && (
                <div className="absolute top-8 right-0 bg-white shadow-md rounded-md px-4 py-2 text-sm text-gray-800 whitespace-nowrap">
                  See Gig
                </div>
              )}

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MadeOnFiverr;
