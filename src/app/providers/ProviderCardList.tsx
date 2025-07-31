"use client";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Pagination, Profile } from "../utils/interfaces";
import { apiRequest } from "../lib/apiCall";
import CardList from "@/components/cardList/CardList";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ITEMS_PER_PAGE = 8;

export const renderProfileCard = ({ item }: { item: Profile }) => {
  const { fullName, profilePicture, averageRating, degreeType } = item;
  return (
    <div className="bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative group w-full">
      <div className="relative h-48 sm:h-64 md:h-72">
        <img
          src={profilePicture || "/noImageFound.png"}
          alt={fullName}
          className="w-full h-full object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-3 sm:p-4 relative z-10">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div className="flex-1 min-w-[150px]">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
              {fullName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span className="line-clamp-1">{degreeType}</span>
            </p>
          </div>
          <div className="flex items-center gap-1 bg-gray-900/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-white text-xs sm:text-sm font-medium">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
            <span>{averageRating || 0}</span>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 flex justify-between items-center">
          <Link href={`/publicProfile/${item.userId}`}>
            <button className="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer">
              View Profile
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </Link>
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-emerald-50 flex items-center justify-center">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProviderCardList = () => {
  const router = useRouter();
  const [providers, setProviders] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    totalPages: 0,
    nextPage: 1,
    prevPage: 0,
    limit: ITEMS_PER_PAGE,
    page: 1,
  });

  useEffect(() => {
    getProfiles(1);
  }, []);

  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      await getProfiles(newPage);
    }
  };

  const getProfiles = async (page: number) => {
    setIsLoading(true);
    try {
      const { limit } = pagination;
      const res = await apiRequest(
        `profile/allProfile?page=${page}&limit=${limit}`,
        {
          method: "GET",
        },
        true
      );

      if (res.success && res.data.data) {
        setProviders(res.data.data.profiles);
        setPagination(res.data.data.pagination);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative w-14 h-14">
        <div className="absolute top-0 left-0 w-full h-full border-6 border-emerald-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full border-6 border-emerald-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30 px-4 sm:px-6 lg:px-8 py-6 pt-[100px]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="cursor-pointer flex items-center justify-center w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-emerald-200/50 transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-gray-800 font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">
                All Providers
              </span>
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Online Professionals
          </div>
        </div>

        <div className="relative">
          {isLoading ? (
            renderLoader()
          ) : (
            <div className="w-full bg-white/30  p-4 sm:p-6">
              <CardList
                data={providers}
                CardComponent={renderProfileCard}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderCardList;
