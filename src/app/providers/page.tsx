"use client";

import Footer from "@/components/user/footer/Footer";
import Header from "@/components/user/header/Header";
import { Box } from "@mui/material";
import React, { useState } from "react";
import { freelancers } from "../../../utils/constants";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 8;

const TopProviders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFreelancers = freelancers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(freelancers.length / ITEMS_PER_PAGE);

  return (
    <>
      <Header />
      <Box className="px-4 py-6 pt-[100px]">
        <h2 className="flex items-center gap-3 text-2xl sm:text-3xl lg:text-4xl mb-6 text-[#404145] font-bold">
          <button
            onClick={() => router.back()}
            className="coursor-pointer flex items-center justify-center w-10 h-10 bg-emerald-600 text-white rounded-full shadow-md transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          Top Providers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentFreelancers.map((freelancer, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative group"
            >
              <div className="relative h-72">
                <Image
                  src={freelancer.image}
                  alt={freelancer.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-4 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">
                      {freelancer.name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      {freelancer.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-900/90 px-3 py-1.5 rounded-full text-white text-sm font-medium">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>{freelancer.rating}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                    View Profile
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Star className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {freelancers.length > ITEMS_PER_PAGE && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="cursor-pointer px-4 py-2 bg-emerald-600 text-white rounded disabled:bg-gray-300"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 rounded cursor-pointer ${
                  currentPage === i + 1
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="cursor-pointer px-4 py-2 bg-emerald-600 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default TopProviders;
