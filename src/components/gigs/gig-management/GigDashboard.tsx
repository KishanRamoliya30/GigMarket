"use client";

import { JSX, useCallback, useEffect, useState } from "react";
import { Box, Pagination, Typography, MenuItem } from "@mui/material";
import {
  AccessTime,
  Info,
  InsertChart,
  AssignmentInd,
  Cancel,
  TaskAlt,
  ThumbUp,
  ThumbDown,
} from "@mui/icons-material";
import GigStatusDialog from "./GigHistoryDailog";
import { getStatusColor } from "../../../../utils/constants";
import { apiRequest } from "@/app/lib/apiCall";
import { GigData } from "@/app/utils/interfaces";
import Loader from "@/components/Loader";
import { useUser } from "@/context/UserContext";
import { GigStatus } from "@/app/models/gig";
import CustomTextField from "@/components/customUi/CustomTextField";
import { Eye } from "lucide-react";

const userStatuses = [
  "Open",
  "Assigned",
  "Not-Assigned",
  "Approved",
  "Rejected",
  "Completed",
];
const providerStatuses = ["Requested", "In-Progress", "Completed"];

export const statusIcons: Record<string, JSX.Element> = {
  Open: <InsertChart className="text-blue-500 mb-1" fontSize="medium" />,
  Requested: <AccessTime className="text-indigo-500 mb-1" fontSize="medium" />,
  "In-Progress": <Info className="text-yellow-500 mb-1" fontSize="medium" />,
  Assigned: (
    <AssignmentInd className="text-purple-500 mb-1" fontSize="medium" />
  ),
  "Not-Assigned": <Cancel className="text-gray-500 mb-1" fontSize="medium" />,
  Completed: <TaskAlt className="text-green-500 mb-1" fontSize="medium" />,
  Approved: <ThumbUp className="text-teal-500 mb-1" fontSize="medium" />,
  Rejected: <ThumbDown className="text-red-500 mb-1" fontSize="medium" />,
};

export default function Dashboard() {
  const [gigData, setGigData] = useState<GigData[]>([]);
  const [selectedGig, setSelectedGig] = useState<GigData | null>(null);
  const [gigStatusCounts, setGigStatusCounts] = useState({
    All: 0,
    Open: 0,
    Requested: 0,
    Assigned: 0,
    "Not-Assigned": 0,
    "In-Progress": 0,
    Completed: 0,
    Approved: 0,
    Rejected: 0,
  });

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const limit = 5;
  const { user } = useUser();
  const role = user?.role;

  const roleTabs = [
    "All",
    ...(role === "User" ? userStatuses : providerStatuses),
  ];

  const fetchBidPlacedGigs = useCallback(async () => {
    try {
      setLoading(true);
      const statusParam =
        statusFilter !== "All" ? `&status=${statusFilter}` : "";

      const res = await apiRequest(
        `gigs/bid-placed?page=${page}&limit=${limit}&sortOrder=${sortOrder}${statusParam}`,
        {
          method: "GET",
        }
      );

      if (res?.data) {
        setGigData(res.data.data.gigs);
        setTotalPages(res.data.data.totalPages);

        const allStatusCounts = {
          ...res.data.data.statusCounts,
          All: res.data.data.totalCount,
        };
        setGigStatusCounts(allStatusCounts);
      }
    } catch (err) {
      console.error("Failed to fetch bid-placed gigs", err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, sortOrder]);

  useEffect(() => {
    fetchBidPlacedGigs();
  }, [fetchBidPlacedGigs]);

  const updateGigData = (newGig: GigData) => {
    setSelectedGig(newGig);

    setGigData((prev) =>
      prev.map((gig) => (gig._id === newGig._id ? newGig : gig))
    );
  };

  if (loading) {
    return <Loader loading={loading} />;
  }

  return (
    <Box className="min-h-screen p-6">
      <div className="mb-8">
        <Typography variant="h4" className="font-bold text-gray-800 mb-1">
          Gig Management
        </Typography>
        <Typography className="text-gray-600">
          Manage your gigs and track their progress
        </Typography>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-8">
        {roleTabs.slice(1).map((status) => (
          <div
            key={status}
            className="bg-white p-5 rounded-xl shadow-sm flex flex-col items-center text-center border border-gray-200 hover:shadow-md transition"
          >
            {statusIcons[status as keyof typeof statusIcons]}
            <p className="text-sm font-medium text-gray-500">{status}</p>
            <p className="text-xl font-semibold text-gray-800">
              {gigStatusCounts[status as GigStatus | "All"]} gig
              {gigStatusCounts[status as GigStatus | "All"] > 1 ? "s" : ""}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-end flex-wrap gap-4 mb-6">
        <CustomTextField
          select
          fullWidth
          sx={{ width: "200px" }}
          value={statusFilter}
          label="Status"
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <MenuItem value="All">All</MenuItem>
          {roleTabs.slice(1).map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </CustomTextField>

        <CustomTextField
          select
          fullWidth
          sx={{ width: "200px" }}
          value={sortOrder}
          label="Order"
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </CustomTextField>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {gigData && gigData.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-fixed border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 w-1/6">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 w-2/6">
                      Description
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 w-1/6">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 w-1/12">
                      Price
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 w-1/6">
                      Created At
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 w-1/12">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gigData.map((gig, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 border-t">
                      {/* Title */}
                      <td
                        className="px-4 py-3 text-sm font-medium text-gray-900 cursor-pointer truncate max-w-[150px] whitespace-nowrap"
                        onClick={() => {
                          setSelectedGig(gig);
                          setOpen(true);
                        }}
                        title={gig.title} // tooltip for full text
                      >
                        {gig.title}
                      </td>

                      {/* Description */}
                      <td
                        className="px-4 py-3 text-sm text-gray-700 cursor-pointer truncate max-w-[250px] whitespace-nowrap"
                        onClick={() => {
                          setSelectedGig(gig);
                          setOpen(true);
                        }}
                        title={gig.description}
                      >
                        {gig.description}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1 ${getStatusColor(
                            gig.status
                          )}`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current" />
                          {gig.status}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 text-center text-sm text-gray-800 font-semibold">
                        ${gig.price}
                      </td>

                      {/* Created At */}
                      <td className="px-4 py-3 text-center text-sm text-gray-600">
                        {new Date(gig.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedGig(gig);
                            setOpen(true);
                          }}
                          className="cursor-pointer px-3 py-1 text-sm font-medium text-green-600 hover:text-green-800 hover:underline"
                        >
                          <Eye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center py-4">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 py-8">No gigs found.</div>
        )}
      </div>

      {selectedGig && (
        <GigStatusDialog
          data={selectedGig}
          open={open}
          onClose={() => {
            setOpen(false);
            setSelectedGig(null);
          }}
          updateGigData={updateGigData}
        />
      )}
    </Box>
  );
}
