import { apiRequest } from "@/app/lib/apiCall";
import { Bid } from "@/app/utils/interfaces";
import CustomeTable from "@/components/customUi/CustomeTable";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PRICE_RANGES, RATING_MAP, sortOptions } from "./constant";
import FilterDropDown from "./FilterDropDown";
import CustomPagination from "@/components/cardList/Pagination";

const BidListing = () => {
  const [gigBids, setGigBids] = useState<Bid[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 3,
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
      setPagination(res.data.pagination);
      setGigBids(res.data.data);
    }
  };

  return (
    <div>
      <div className="flex flex-raw items-center gap-3">
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
          <p className="mr-2 font-semibold text-gray-800">Sort By:</p>
          <FilterDropDown
            title="Sort by:"
            selectedOption={sortBy}
            options={sortOptions}
            onOptionChange={setSortBy}
            isSelectTitle={true}
          />
        </div>
      </div>
      {gigBids && <CustomeTable raws={gigBids} columns={[]} />}
      {pagination.totalPages > 1 && (
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
