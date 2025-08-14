"use client";

import Image from "next/image";
import { FavoriteBorderOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/apiCall";
import { Gig } from "@/app/utils/interfaces";

const MadeOnFiverr = () => {
  const router = useRouter();
  const [data, setData] = useState<{
    data: Gig[];
    pagination: { total: number };
  }>({ data: [], pagination: { total: 0 } });

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
        }
      } catch (error) {
        console.error("Error fetching gigs:", error);
      }
    }
    getOpenGigs();
  }, []);

  return (
    data.data.length > 0 && (
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
                onClick={() => router.push(`gigs/${gig._id}`)}
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
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    Design & Creative
                  </p>

                  <p className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
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
                      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={gig.createdBy?.profilePicture || "/avatar.png"}
                          alt={gig.createdBy?.fullName || "User"}
                          width={28}
                          height={28}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm text-gray-700">
                        {gig.createdBy?.fullName}
                      </span>
                    </div>

                    <div className="text-sm text-gray-700">
                      Starting at:{" "}
                      <span className="font-bold">${gig.price}</span>
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
    )
  );
};

export default MadeOnFiverr;
