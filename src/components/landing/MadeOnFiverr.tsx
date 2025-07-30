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
      <section className="py-12 px-10 md:px-18 lg:px-26">
        <div className="mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-2 text-[#404145] font-bold text-center">
            Made on Gig Market
          </h2>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {data.data.map((gig, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:cursor-pointer"
                onClick={() => {
                  router.push(`gigs/${gig._id}`);
                }}
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={gig.gigImage?.url || "/noImageFound.png"}
                    alt={gig.title}
                    width={400}
                    height={300}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Hover overlay with text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent  transition-opacity duration-300">
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-base font-semibold text-white mb-2">
                      Featured in:{" "}
                      {gig.title.length > 30
                        ? `${gig.title.substring(0, 30)}...`
                        : gig.title}
                    </p>
                    {gig.createdBy.fullName && (
                      <p className="text-sm text-gray-200 flex items-center gap-2">
                        <span className="p-1 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                          {gig.createdBy.fullName.charAt(0)}
                        </span>
                        {gig.createdBy.fullName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Like icon */}
                <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg hover:bg-white transition-colors z-10 group-hover:scale-110">
                  <FavoriteBorderOutlined className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push(`/publicGigs`)}
            className="text-sm mt-10 ml-auto mr-auto font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            Browse All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    )
  );
};

export default MadeOnFiverr;
