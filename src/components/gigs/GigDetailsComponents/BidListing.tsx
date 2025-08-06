import { apiRequest } from "@/app/lib/apiCall";
import { Bid } from "@/app/utils/interfaces";
import CustomeTable from "@/components/customUi/CustomeTable";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { bidColumns, PRICE_RANGES, RATING_MAP, sortOptions } from "./constant";
import FilterDropDown from "./FilterDropDown";
import { RefreshCw, X } from "lucide-react";
import CustomPagination from "@/components/cardList/Pagination";
import CustomNotFound from "@/components/notFoundModals/CustomNotFound";
import { TableSkeleton } from "./Skeleton";
import TagList, { TagItem } from "./Taglist";

const BidListing = () => {
  const [gigBids, setGigBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
  });
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("Recently Added");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");
  const params = useParams();
  const { gigId } = params;

  useEffect(() => {
    getGigBids();
  }, [page, sortBy, selectedRating, selectedBudget, customMin, customMax]);

  const getGigBids = async () => {
    setIsLoading(true);
    try {
      const priceParams =
        selectedBudget === "custom" && customMin && customMax
          ? {
              minPrice: Number(customMin),
              maxPrice: Number(customMax),
            }
          : PRICE_RANGES[selectedBudget as keyof typeof PRICE_RANGES] || {};

      const minRating = RATING_MAP[selectedRating as keyof typeof RATING_MAP];

      const res = await apiRequest<{
        data: Bid[];
        pagination: typeof pagination;
      }>(`mygigs/${gigId}/bids`, {
        method: "GET",
        params: {
          limit: pagination.limit,
          page,
          ...priceParams,
          minRating,
          sort: sortBy,
        },
      });

      if (res.ok) {
        const { pagination } = res.data;
        setPagination(pagination);
        setGigBids(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBidStatusChange = async (
    bidId: string,
    status: "Assigned" | "Not-Assigned"
  ) => {
    const res = await apiRequest(
      `gigs/${gigId}/changeStatus`,
      {
        method: "PATCH",
        data: { status, bidId },
      },
      true
    );

    if (res.success) {
      getGigBids();
    }
  };

  const resetFilters = () => {
    setSelectedRating("");
    setSelectedBudget("");
    setCustomMin("");
    setCustomMax("");
    setPage(1);
  };

  const renderFilterSection = () => {
    return (
      <div className="flex flex-raw items-center gap-3 mb-4">
        <FilterDropDown
          title="Rating"
          selectedOption={selectedRating}
          options={Object.keys(RATING_MAP)}
          onOptionChange={setSelectedRating}
        />
        <FilterDropDown
          title="Budget"
          selectedOption={selectedBudget}
          options={Object.keys(PRICE_RANGES)}
          onOptionChange={setSelectedBudget}
          rangeOption="custom"
          customMin={customMin}
          customMax={customMax}
          setCustomMin={setCustomMin}
          setCustomMax={setCustomMax}
        />

        <div className="flex flex-raw items-center ml-auto">
          <p className="mr-2 font-semibold text-gray-800">Sort by:</p>
          <FilterDropDown
            title="Sort by:"
            selectedOption={sortBy}
            options={sortOptions}
            onOptionChange={setSortBy}
            isSelectTitle={true}
            wrappedStyle={{ right: 0 }}
          />
        </div>
      </div>
    );
  };
  return (
    <div>
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex-1 mb-4">
        All Bids
      </h1>
      {renderFilterSection()}
      <TagList
        tags={
          [
            {
              condition: selectedBudget && selectedBudget !== "custom",
              tag: {
                label: selectedBudget,
                onRemove: () => setSelectedBudget(""),
              },
            },
            {
              condition: selectedBudget === "custom" && customMin && customMax,
              tag: {
                label: `₹${customMin} - ₹${customMax}`,
                onRemove: () => {
                  setCustomMin("");
                  setCustomMax("");
                  setSelectedBudget("");
                },
              },
            },
            {
              condition: selectedRating,
              tag: {
                label: selectedRating,
                onRemove: () => setSelectedRating(""),
              },
            },
          ]
            .filter(({ condition }) => condition)
            .map(({ tag }) => tag) as TagItem[]
        }
      />

      {isLoading ? (
        <TableSkeleton />
      ) : gigBids.length > 0 ? (
        <CustomeTable
          raws={gigBids}
          columns={bidColumns}
          handleBidStatusChange={handleBidStatusChange}
        />
      ) : (
        <CustomNotFound
          title=""
          icon={<X className="h-6 w-6 text-red-500" />}
          buttonX={
            <button
              className="flex items-center p-2 rounded-md gap-2 text-[#003322] font-semibold shadow cursor-pointer bg-emerald-50 transition-colors duration-200"
              onClick={() => resetFilters()}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="font-medium">Refresh</span>
            </button>
          }
          desc={
            !selectedBudget && !selectedRating
              ? "No bids have been placed for this gig yet."
              : "No bids found matching the selected filters."
          }
        />
      )}
      {pagination?.totalPages > 1 && (
        <div className="flex justify-center my-4">
          <CustomPagination
            totalPages={pagination.total}
            page={pagination.page}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default BidListing;
