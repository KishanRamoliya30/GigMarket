"use client";
import { apiRequest } from "@/app/lib/apiCall";
import { Profile } from "@/app/utils/interfaces";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import CustomCarousel from "./CustomCarousel";
import ProviderCard from "@/app/providers/ProviderCard";

const LandingProviderProfiles = () => {
  const [data, setData] = useState<{
    profiles: Profile[];
    pagination: { total: number };
  }>({ profiles: [], pagination: { total: 0 } });
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
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
        setLoading(false);
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
        className="mt-10 mx-auto flex items-center gap-2 rounded-full bg-green-100 px-6 py-2 text-green-600 font-semibold hover:bg-green-200 transition-colors cursor-pointer"
      >
        All Providers <ArrowRight className="w-4 h-4" />
      </button>
    );
  };

  return (
    <div className="py-12 px-10">
      <CustomCarousel
        loading={loading}
        data={data.profiles}
        CardComponent={ProviderCard}
        ViewAllButtonComponent={() => ViewAllButton()}
        heading="Top Providers"
        subheading="Most viewed and all-time top-rated providers"
      />
    </div>
  );
};

export default LandingProviderProfiles;
