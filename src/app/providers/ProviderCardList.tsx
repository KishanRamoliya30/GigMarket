"use client";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Pagination, Profile } from "../utils/interfaces";
import { apiRequest } from "../lib/apiCall";
import CardList from "@/components/cardList/CardList";
import { useRouter } from "next/navigation";
import ProviderCard from "./ProviderCard";

const ITEMS_PER_PAGE = 8;
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
                CardComponent={ProviderCard}
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
