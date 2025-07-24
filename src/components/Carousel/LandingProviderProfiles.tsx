"use client";
import { apiRequest } from "@/app/lib/apiCall";
import { Profile } from "@/app/utils/interfaces";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CustomCarousel from "./CustomCarousel";
import { ArrowRight } from "lucide-react";
import { renderProfileCard } from "@/app/providers/ProviderCardList";

const LandingProviderProfiles = () => {
  const [data, setData] = useState<{
    profiles: Profile[];
    pagination: { total: number };
  }>({ profiles: [], pagination: { total: 0 } });
  const router = useRouter();
  useEffect(() => {
    async function getOpenGigs() {
      try {
        const res = await apiRequest(
          `profile/allProfile?limit=${10}&page=${1}`,
          {
            method: "GET",
          }
        );
        if (res.ok) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching gigs:", error);
      }
    }
    getOpenGigs();
  }, []);

  const ViewAllButton = () => {
    return (
      <button
        onClick={() => router.push(`/providers`)}
        className="text-sm font-semibold hover:underline flex items-center gap-1 cursor-pointer"
      >
        Browse All <ArrowRight className="w-4 h-4" />
      </button>
    );
  };

  return (
    <div>
      <CustomCarousel
        data={data.profiles}
        CardComponent={renderProfileCard}
        ViewAllButtonComponent={() => ViewAllButton()}
        heading="Top Providers"
        subheading="Most viewed and all-time top-rated providers"
        total={data.pagination.total}
      />
    </div>
  );
};

export default LandingProviderProfiles;
