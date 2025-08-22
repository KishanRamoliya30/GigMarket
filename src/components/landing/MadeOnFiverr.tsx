"use client";

import Image from "next/image";
import { FavoriteBorderOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/apiCall";
import { Gig } from "@/app/utils/interfaces";
import { Skeleton } from "@mui/material";

const MadeOnFiverr = () => {
  const router = useRouter();
  const [data, setData] = useState<{
    data: Gig[];
    pagination: { total: number };
  }>({ data: [], pagination: { total: 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getOpenGigs() {
      try {
        const res = await apiRequest("gigs/list", {
          method: "GET",
          params: {
            limit: 8,
            page: 1,
          },
        });
        if (res.ok) {
          setData(res.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching gigs:", error);
      }
    }
    getOpenGigs();
  }, []);

  const GigsSkeleton = () => {
    return (
      <section className="py-12 px-10">
        <div className="mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-2 text-[#404145] font-bold text-center">
            Made on Gig Market
          </h2>

          {/* Skeleton Grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from(new Array(8)).map((_, idx) => (
              <div
                key={idx}
                className="group relative bg-white shadow-md rounded-md overflow-hidden"
              >
                {/* Image skeleton */}
                <div className="w-full aspect-[4/3] relative">
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                </div>

                {/* Heart button skeleton */}
                <div className="absolute top-4 right-4">
                  <Skeleton
                    variant="circular"
                    width={32}
                    height={32}
                    className="shadow-md"
                  />
                </div>

                <div className="p-4">
                  {/* Category */}
                  <Skeleton variant="text" width="40%" height={16} />

                  {/* Title */}
                  <Skeleton
                    variant="text"
                    width="90%"
                    height={24}
                    className="mt-2"
                  />
                  <Skeleton variant="text" width="75%" height={24} />

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-3">
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton variant="text" width="30%" height={16} />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-4">
                    <div className="flex items-center gap-2">
                      <Skeleton variant="circular" width={28} height={28} />
                      <Skeleton variant="text" width={60} height={18} />
                    </div>
                    <Skeleton variant="text" width={80} height={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Button Skeleton */}
          <div className="flex justify-center mt-10">
            <Skeleton
              variant="rectangular"
              width={160}
              height={40}
              className="rounded-full"
            />
          </div>
        </div>
      </section>
    );
  };

  if (loading) {
    return <GigsSkeleton />;
  }

  if (data.data.length === 0) {
    return <p className="text-center text-gray-500 py-20">No gigs found.</p>;
  }

  return data?.data?.length > 0 ? (
    <section className="py-12 px-10">
      <div className="mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-2 text-[#404145] font-bold text-center">
          Made on Gig Market
        </h2>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data.data.map((gig, index) => (
            <div
              key={index}
              className="group relative bg-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden"
            >
              <div className="w-full aspect-[4/3] relative">
                <Image
                  src={gig.gigImage?.url || "/noImageFound.png"}
                  alt={gig.title}
                  fill
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <button className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md hover:scale-110 transition z-10">
                <FavoriteBorderOutlined className="w-5 h-5 text-gray-700" />
              </button>
              <div className="p-4">
                {/* <p className="text-xs text-gray-500 font-medium mb-1">
                  Design & Creative
                </p> */}

                <p
                  className="inline-block text-base font-semibold text-gray-900 mb-2 line-clamp-2 
                       hover:text-[#5BBB7B] hover:underline cursor-pointer transition-colors duration-200"
                  onClick={() => router.push(`gigs/${gig._id}`)}
                >
                  {gig.title}
                </p>

                <div className="flex items-center text-sm text-gray-600 gap-1 mb-4">
                  <span className="text-yellow-500 text-base">★</span>
                  <span className="font-semibold">
                    {gig.rating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({gig.reviews || 0} Reviews)
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={gig.createdBy?.profilePicture || "/avatar.png"}
                        alt={gig.createdBy?.fullName || "User"}
                        fill
                        className="object-cover"
                        sizes="28px"
                      />
                    </div>
                    <span className="text-sm text-gray-700">
                      {gig.createdBy?.fullName}
                    </span>
                  </div>

                  <div className="text-sm text-gray-700">
                    Starting at: <span className="font-bold">${gig.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push(`/publicGigs`)}
          className="mt-10 mx-auto flex items-center gap-2 rounded-full bg-green-100 px-6 py-2 text-green-600 font-semibold hover:bg-green-200 transition-colors cursor-pointer"
        >
          All Services <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  ) : (
    <p className="text-center text-gray-500 py-20">No gigs found.</p>
  );
};

export default MadeOnFiverr;
