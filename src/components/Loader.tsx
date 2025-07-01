"use client";

import React from "react";

interface LoaderProps {
  loading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="relative flex items-center justify-center w-24 h-24">
        <div className="absolute w-full h-full rounded-full bg-gradient-to-tr from-[#1DBF73] to-[#13aa60] animate-ping opacity-60" />
        <div className="absolute w-16 h-16 bg-[#1DBF73] rounded-full shadow-xl shadow-green-200 animate-bounce" />
      </div>

      <p className="mt-6 text-lg font-semibold text-gray-700 animate-pulse">
        Just a moment...
      </p>
    </div>
  );
};

export default Loader;
