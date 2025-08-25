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
import { Rating } from "@mui/material";
import { Star } from "@mui/icons-material";

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

  const renderRatings = () => {
    if (!gigDetails) return null;

    return (
      <div className="mt-10">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          {gigDetails.reviews} Review{gigDetails.reviews !== 1 && "s"}
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-amber-50 p-6 rounded-xl flex flex-col items-center w-full md:w-1/3">
            <p className="text-4xl font-bold text-yellow-500">
              {gigDetails.rating.toFixed(1)}
            </p>
            <Rating
              name="read-only"
              value={gigDetails.rating}
              precision={0.5}
              readOnly
            />           
          </div>

          <div className="flex-1 space-y-2">
            {gigDetails.breakdown.map((b) => (
              <div key={b.star} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-10">
                  {b.star} Star
                </span>
                <div className="flex-1 bg-gray-100 h-2 rounded-full">
                  <div
                    className={`h-2 rounded-full ${
                      b.percentage > 0 ? "bg-yellow-500" : "bg-transparent"
                    }`}
                    style={{ width: `${b.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">
                  {b.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {gigDetails.ratings.length === 0 && (
            <p className="text-gray-500">No reviews yet.</p>
          )}

          {gigDetails.ratings.map((review) => (
            <div key={review._id} className="border-t pt-6 border-gray-200">
              <div className="flex items-center gap-4 mb-3">
                <Image
                  className="w-12 h-12 rounded-full object-cover bg-gray-200"
                  width={60}
                  height={60}
                  alt="profile image"
                  src={review.createdBy.profile?.profilePicture || "/avtar.png"}
                />

                <div>
                  <p className="font-medium text-gray-800">
                    {review.createdBy.profile?.fullName || "Anonymous"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{review.rating.toFixed(1)}</span>
                    <span>•</span>
                    <span>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
           
              <p className="text-gray-700 leading-relaxed">{review.review}</p>
             
              {review.complaint && (
                <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Issue:</span>{" "}
                    {review.complaint.issue}
                  </p>
                  <p>
                    <span className="font-medium">Suggestion:</span>{" "}
                    {review.complaint.improvementSuggestion}
                  </p>
                  {review.complaint.providerResponse && (
                    <p className="mt-2">
                      <span className="font-medium">Provider Response:</span>{" "}
                      {review.complaint.providerResponse}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
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
      {!isUserMatch && renderRatings()}
    </div>
  );
};
