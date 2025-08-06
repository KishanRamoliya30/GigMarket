"use client";
import { Gig } from "@/app/utils/interfaces";
import React from "react";
import {
  Clock,
  Tag,
  FileText,
  DollarSign,
  Award,
  AwardIcon,
} from "lucide-react";
import { formatTimeAgo } from "../../../../utils/common";
import Image from "next/image";
import UserCard from "./UserCard";
import { useUser } from "@/context/UserContext";

export const Details = ({ gigDetails }: { gigDetails: Gig }) => {
  const timeStamp = formatTimeAgo(gigDetails.createdAt);
  const { user } = useUser();
  const isUserMatch = user && user?._id == gigDetails.createdBy.userId;

  const renderTitleSection = () => {
    return (
      <div className="flex flex-col gap-3 sm:gap-4 w-full">
        <div className="flex flex-row items-start gap-2">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex-1">
            {gigDetails.title}
          </h1>
          <div className="flex items-center text-lg sm:text-xl md:text-2xl font-bold text-emerald-600">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span>{gigDetails.price}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <span className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 rounded-full flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-300">
            <Award className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
            {gigDetails.tier}
          </span>
          <div className="flex items-center gap-1 text-gray-700 text-xs sm:text-sm bg-gray-50 px-3 sm:px-4 py-1.5 rounded-full shadow-sm flex-wrap">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-500" />
            <span className="font-medium">Posted {timeStamp} &nbsp;</span>
            <span className="text-emerald-600 w-fit font-semibold">
              {gigDetails.bids}{" "}
              {gigDetails.createdByRole === "Provider" ? "requested" : "bids"}
            </span>
          </div>
        </div>

        <div className={`bg-white rounded-lg mt-3 transition-all duration-300`}>
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <Tag className="w-4 h-4" />
            <h2 className="text-base sm:text-lg font-semibold">Keywords</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {gigDetails.keywords.map((word: string) => (
              <span
                key={word}
                className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-full flex items-center gap-2 shadow-sm hover:shadow-md hover:scale-102 transition-all duration-300"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <div className={`bg-white rounded-lg mt-3 transition-all duration-300`}>
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <AwardIcon className="w-[18px] h-[18px]" />
            <h2 className="text-base sm:text-lg font-semibold">
              Relevent Skills
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {gigDetails.releventSkills.map((word: string) => (
              <span
                key={word}
                className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-full flex items-center gap-2 shadow-sm hover:shadow-md hover:scale-102 transition-all duration-300"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDescription = () => {
    return (
      <div
        className={`bg-white w-fit min-w-[500px] rounded-lg p-4 sm:p-6 transition-all duration-300 border border-gray-200`}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <FileText className="w-4 h-4" />
          <h2 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Description
          </h2>
        </div>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-[15px] whitespace-pre-wrap">
          {gigDetails.description}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full">
      <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-6">
        <div className="flex flex-col items-start gap-4 sm:gap-6">
          <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-6 w-full">
            <div className="w-full md:w-auto">
              <Image
                width={500}
                height={280}
                src={gigDetails?.gigImage?.url}
                alt={gigDetails.title}
                className="object-cover rounded-lg shadow w-full md:w-[500px] h-[220px] sm:h-[320px]"
                priority
              />
            </div>
            {renderTitleSection()}
          </div>
          {renderDescription()}
        </div>
        {!isUserMatch && <UserCard gigDetails={gigDetails} />}
      </div>
    </div>
  );
};
