import React from "react";

export const TableSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-12 bg-gray-200 rounded-t-lg mb-1"></div>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-16 bg-gray-100 mb-1"></div>
    ))}
  </div>
);
const Skeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full">
      <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-6">
        <div className="flex flex-col items-start gap-4 sm:gap-6">
          <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-6 w-full">
            {/* Image Skeleton */}
            <div className="w-full md:w-auto">
              <div className="bg-gray-200 animate-pulse rounded-lg shadow w-full md:w-[500px] h-[220px] sm:h-[320px]"></div>
            </div>

            {/* Title Section Skeleton */}
            <div className="flex flex-col gap-3 sm:gap-4 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div className="h-6 sm:h-8 bg-gray-200 animate-pulse rounded w-3/4 sm:w-2/3"></div>
                <div className="h-6 sm:h-8 bg-gray-200 animate-pulse rounded w-20 sm:w-24"></div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="h-7 sm:h-8 bg-gray-200 animate-pulse rounded-full w-24 sm:w-28"></div>
                <div className="h-7 sm:h-8 bg-gray-200 animate-pulse rounded-full w-36 sm:w-48"></div>
              </div>

              <div className="bg-white rounded-lg mt-3">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 sm:h-5 bg-gray-200 animate-pulse rounded w-16 sm:w-20"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 bg-gray-200 animate-pulse rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 animate-pulse rounded-full w-20"></div>
                  <div className="h-6 bg-gray-200 animate-pulse rounded-full w-14"></div>
                  <div className="h-6 bg-gray-200 animate-pulse rounded-full w-18"></div>
                </div>
              </div>

              <div className="bg-white rounded-lg mt-3">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-[18px] h-[18px] bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 sm:h-5 bg-gray-200 animate-pulse rounded w-24 sm:w-32"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 bg-gray-200 animate-pulse rounded-full w-14"></div>
                  <div className="h-6 bg-gray-200 animate-pulse rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 animate-pulse rounded-full w-12"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="bg-white w-full md:w-fit min-w-[500px] rounded-lg p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 sm:h-5 bg-gray-200 animate-pulse rounded w-20 sm:w-24"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-3 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-3 bg-gray-200 animate-pulse rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 animate-pulse rounded w-4/6"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 w-full animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-gray-100 p-6 rounded-xl flex flex-col items-center w-full md:w-1/3">
              <div className="h-10 w-16 bg-gray-200 rounded mb-3"></div>
              <div className="flex space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 w-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>

            <div className="flex-1 space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-10"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Single review */}
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-11/12"></div>
              <div className="h-3 bg-gray-200 rounded w-10/12"></div>
              <div className="h-3 bg-gray-200 rounded w-8/12"></div>
            </div>
          </div>
        </div>

        {/* UserCard Skeleton */}
        <div className="bg-white rounded-md shadow-sm p-6 max-w-sm min-w-[340px] w-full mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 animate-pulse rounded w-32"></div>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-3 h-3 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded w-24"></div>
              </div>
              <div className="flex items-center mt-2 space-x-2">
                <div className="w-3 h-3 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded w-8"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded w-16"></div>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200 my-4"></div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-gray-200 animate-pulse rounded mr-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-12"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="h-6 bg-gray-200 animate-pulse rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded-full w-14"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded-full w-18"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-gray-200 animate-pulse rounded mr-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-20"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="h-6 bg-gray-200 animate-pulse rounded-full w-24"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded-full w-28"></div>
              </div>
            </div>

            <div className="h-10 bg-gray-200 animate-pulse rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
