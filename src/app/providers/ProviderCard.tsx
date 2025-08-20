import React, { useState } from "react";
import { Profile } from "../utils/interfaces";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Box, Skeleton } from "@mui/material";

const ProviderCard = ({
  item,
  loading = false,
}: {
  item: Profile;
  loading?: boolean;
}) => {
  const {
    fullName,
    profilePicture,
    averageRating,
    skills,
    rate,
    reviews,
    userId,
    degreeType,
    major,
  } = item;
  const [showMoreSkills, setShowMoreSkills] = useState<boolean>(false);

  if (loading) {
    return (
      <Box className="border border-gray-200 bg-white w-full max-w-[320px] mx-auto p-5 flex flex-col justify-between min-h-[480px] rounded-xl">
        <Skeleton
          variant="circular"
          width={96}
          height={96}
          sx={{ margin: "16px auto" }}
        />

        <Skeleton
          variant="text"
          width="60%"
          height={24}
          sx={{ margin: "0 auto" }}
        />
        <Skeleton
          variant="text"
          width="40%"
          height={20}
          sx={{ margin: "8px auto" }}
        />

        <Skeleton
          variant="text"
          width="50%"
          height={20}
          sx={{ margin: "12px auto" }}
        />

        <Box className="flex justify-center gap-2 mt-3">
          <Skeleton variant="rounded" width={50} height={24} />
          <Skeleton variant="rounded" width={70} height={24} />
          <Skeleton variant="rounded" width={40} height={24} />
        </Box>

        <Box className="flex justify-between items-center mt-4 border-t border-gray-100 pt-3">
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="text" width="20%" height={20} />
        </Box>

        <Skeleton
          variant="rounded"
          width="100%"
          height={40}
          sx={{ marginTop: "16px" }}
        />
      </Box>
    );
  }

  const visibleSkills = skills?.slice(0, 2);
  const hiddenSkills = skills?.slice(2);
  return (
    <div className="border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 overflow-hidden w-full max-w-[320px] mx-auto p-5 flex flex-col justify-between min-h-[480px]">
      <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5-1.74 0-3.25 1.002-4 2.455A4.493 4.493 0 009 3.75C6.515 3.75 4.5 5.765 4.5 8.25c0 7.22 7.5 11.25 7.5 11.25s7.5-4.03 7.5-11.25z"
          />
        </svg>
      </div>

      <div className="relative w-24 h-24 flex items-center justify-center mx-auto mt-4 mb-3">
        {" "}
        <Image
          src={profilePicture || "/noImageFound.png"}
          alt={fullName}
          className="w-full h-full object-cover rounded-full"
          width={96}
          height={96}
        />{" "}
      </div>

      {/* Name & Role */}
      <div className="text-center mt-4">
        <h3 className="text-lg font-semibold text-gray-800">{fullName}</h3>
        <p className="text-sm text-gray-500">Designer</p>
      </div>

      {/* Rating */}
      <div className="flex justify-center items-center gap-1 mt-2 text-yellow-500">
        <Star className="w-4 h-4 fill-current" />
        <span className="text-sm font-medium">{averageRating || 0}</span>
        <span className="text-xs text-gray-400">
          ({reviews || 0} Review{(reviews || 0) > 1 ? "s" : ""})
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 justify-center mt-3">
        {visibleSkills.map((skill, index) => (
          <span
            key={index}
            className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full"
          >
            {skill}
          </span>
        ))}
        {showMoreSkills &&
          hiddenSkills.map((skill, index) => (
            <span
              key={index + 2}
              className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        {hiddenSkills.length > 0 && (
          <span
            className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full cursor-pointer"
            onClick={() => setShowMoreSkills(!showMoreSkills)}
          >
            +{hiddenSkills.length}
          </span>
        )}
      </div>

      {/* Education & Rate */}
      <div className="flex justify-between items-center mt-4 border-t border-gray-100 pt-3 text-sm text-gray-600">
        <p>
          <span className="font-medium">Education:</span>{" "}
          {degreeType && major ? `${degreeType} in ${major}` : "Not Available"}
        </p>
        <p>
          <span className="font-medium">Rate:</span> {rate || "N/A"}
        </p>
      </div>

      <Link href={`/publicProfile/${userId}`} className="mt-4 block">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 text-[#5bbb7b] bg-[#eef8f2] hover:text-white hover:bg-[#5bbb7b] rounded-full transition-all duration-300 font-semibold"
        >
          <span className="text-sm">View Profile</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </Link>
    </div>
  );
};

export default ProviderCard;
