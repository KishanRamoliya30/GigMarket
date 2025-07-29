"use client";

import { useEffect, useState } from "react";
import { Box, Pagination, Typography } from "@mui/material";
import {
  AccessTime,
  CheckCircle,
  Close,
  Info,
  InsertChart,
  CalendarMonth,
  AttachMoney,
} from "@mui/icons-material";
import GigStatusDialog from "./GigHistoryDailog";
import { tabs } from "../../../../utils/constants";
import { apiRequest } from "@/app/lib/apiCall";
import { GigData } from "@/app/utils/interfaces";
import Loader from "@/components/Loader";

const statusIcons = {
  Open: <InsertChart className="text-blue-500 mb-1" fontSize="medium" />,
  Requested: <AccessTime className="text-indigo-500 mb-1" fontSize="medium" />,
  "In Progress": <Info className="text-yellow-500 mb-1" fontSize="medium" />,
  Assigned: <CheckCircle className="text-purple-500 mb-1" fontSize="medium" />,
  "Not-Assigned": <Close className="text-gray-500 mb-1" fontSize="medium" />,
  Completed: <CheckCircle className="text-green-500 mb-1" fontSize="medium" />,
  Approved: <CheckCircle className="text-teal-500 mb-1" fontSize="medium" />,
  Rejected: <Close className="text-red-500 mb-1" fontSize="medium" />,
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-blue-100 text-blue-700";
    case "Requested":
      return "bg-indigo-100 text-indigo-700";
    case "In Progress":
      return "bg-yellow-100 text-yellow-700";
    case "Assigned":
      return "bg-purple-100 text-purple-700";
    case "Not-Assigned":
      return "bg-gray-100 text-gray-700";
    case "Completed":
      return "bg-green-100 text-green-700";
    case "Approved":
      return "bg-teal-100 text-teal-700";
    case "Rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("All");
  const [gigData, setGigData] = useState<GigData[]>([]);
  const [selectedGig, setSelectedGig] = useState<GigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;

  const fetchBidPlacedGigs = async (page = 1) => {
    try {
      setLoading(true);
      const res = await apiRequest(
        `gigs/bid-placed?page=${page}&limit=${limit}`,
        {
          method: "GET",
        }
      );

      if (res?.data) {
        setGigData(res.data.data.gigs);
        setTotalPages(res.data.data.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch bid-placed gigs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBidPlacedGigs(page);
  }, [page]);

  const getStatusCount = (status: string) =>
    gigData?.filter((gig) => gig.status === status).length;

  const filteredGigs =
    activeTab === "All"
      ? gigData
      : gigData.filter((gig) => gig.status === activeTab);

  if (loading) {
    return <Loader loading={loading} />;
  }

  return (
    <Box className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h4" className="font-bold text-gray-800 mb-1">
          Gig Management
        </Typography>
        <Typography className="text-gray-600">
          Manage your gigs and track their progress
        </Typography>
      </div>

      {/* Status Summary Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-8">
        {tabs.slice(1).map((status) => (
          <div
            key={status}
            className="bg-white p-5 rounded-xl shadow-sm flex flex-col items-center text-center border border-gray-200 hover:shadow-md transition"
          >
            {statusIcons[status as keyof typeof statusIcons]}
            <p className="text-sm font-medium text-gray-500">{status}</p>
            <p className="text-xl font-semibold text-gray-800">
              {getStatusCount(status)} gig
              {getStatusCount(status) !== 1 ? "s" : ""}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs Container */}
      <div className="bg-[#f6f9fc] rounded-lg flex gap-1 px-2 py-1 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
              activeTab === tab
                ? "bg-white text-black shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab} ({tab === "All" ? gigData?.length : getStatusCount(tab)})
          </button>
        ))}
      </div>

      {/* Gig List */}
      <div className="space-y-6">
        {filteredGigs && filteredGigs.length > 0 ? (
          filteredGigs.map((gig, idx) => (
            <div
              key={idx}
              className="bg-white border border-blue-100 rounded-xl px-6 py-5 shadow-sm hover:shadow-md transition"
            >
              <div
                className="cursor-pointer flex justify-between items-start"
                onClick={() => {
                  setSelectedGig(gig);
                  setOpen(true);
                }}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {gig.title}
                </h3>
               <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${getStatusColor(gig.status)}`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                {gig.status}
              </span>

              </div>

              <p className="text-sm text-gray-600 my-2">{gig.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 pt-2">
                <div className="flex items-center gap-1">
                  <AttachMoney fontSize="small" />
                  <span className="font-semibold">{gig.price}</span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <CalendarMonth fontSize="small" />
                  {new Date(gig.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">No gigs found.</div>
        )}

        {/* Pagination */}
        {filteredGigs && filteredGigs.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </div>
        )}
      </div>

      {/* Dialog for Single Gig */}
      {selectedGig && (
        <GigStatusDialog
          data={selectedGig}
          open={open}
          onClose={() => {
            setOpen(false);
            setSelectedGig(null);
          }}
        />
      )}
    </Box>
  );
}
