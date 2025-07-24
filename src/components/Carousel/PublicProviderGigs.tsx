"use client";
import React, { useEffect, useState } from "react";
import CustomCarousel from "./CustomCarousel";
import { ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/apiCall";
import { Gig } from "@/app/utils/interfaces";

const PublicProviderGigs = () => {
  const [data, setData] = useState<{
    data: Gig[];
    pagination: { total: number };
  }>({ data: [], pagination: { total: 0 } });
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  useEffect(() => {
    async function getOpenGigs() {
      try {
        const res = await apiRequest("gigs/list", {
          method: "GET",
          params: {
            limit: 10,
            page: 1,
            userId: userId,
            createdByRole: "Provider",
          },
        });
        if (res.ok) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Error fetching gigs:", error);
      }
    }
    if (userId) {
      getOpenGigs();
    }
  }, [userId]);

  const GigCard = ({ item }: { item: Gig }) => {
    const router = useRouter();
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-[280px] w-full max-w-sm mx-auto">
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight flex-1">
              {item.title}
            </h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 whitespace-nowrap">
              {item.tier}
            </span>
          </div>

          <p className="mt-4 text-gray-600 line-clamp-3 text-sm leading-relaxed flex-1">
            {item.description}
          </p>

          <div className="mt-auto pt-6 flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Starting from</span>
              <span className="text-2xl font-bold text-gray-900">
                $
                {typeof item.price === "number"
                  ? item.price.toFixed(2)
                  : item.price}
              </span>
            </div>

            <button
              onClick={() => router.push(`/gigs/${item._id}`)}
              className="w-fit text-sm inline-flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 font-medium hover:bg-green-100 transition-colors duration-200"
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ViewAllButton = () => {
    return (
      <button
        onClick={() => router.push(`publicGigs/provider/${userId}`)}
        className="text-sm font-semibold hover:underline flex items-center gap-1 cursor-pointer"
      >
        View All Open Gigs <ArrowRight className="w-4 h-4" />
      </button>
    );
  };
  return (
    <div>
      <CustomCarousel
        data={data.data}
        CardComponent={GigCard}
        ViewAllButtonComponent={() => ViewAllButton()}
        heading="Open Gigs"
        total={data.pagination.total}
      />
    </div>
  );
};

export default PublicProviderGigs;
