"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const BackButton = ({
  onClick,
  title,
}: {
  onClick?: () => void;
  title?: string;
}) => {
  const router = useRouter();
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };
  return (
    <button
      className="flex items-center p-2 px-3 rounded-2xl gap-2 text-[#003322] text-[14px] shadow border border-gray-100 bg-gradient-to-r from-emerald-50 to-emerald-100 font-semibold cursor-pointer mb-3 hover:shadow-md transition-colors duration-200 group"
      onClick={handleClick}
    >
      <ArrowLeft className="h-4 w-4 group-hover:scale-120 transition-transform duration-200" />
      {title ? title : "Back"}
    </button>
  );
};

export default BackButton;
