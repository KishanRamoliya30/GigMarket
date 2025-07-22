"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  AccessTime,
  CheckCircle,
  Close,
  Info,
  InsertChart,
  CalendarMonth,
  Person,
  AttachMoney,
} from "@mui/icons-material";
import GigStatusDialog from "./GigHistoryDailog";
import { gigData, tabs } from "../../../../utils/constants";

const statusIcons = {
  Open: <InsertChart className="text-blue-500 mb-1" fontSize="medium" />,
  Requested: <AccessTime className="text-indigo-500 mb-1" fontSize="medium" />,
  "In Progress": <Info className="text-yellow-500 mb-1" fontSize="medium" />,
  Completed: <CheckCircle className="text-green-500 mb-1" fontSize="medium" />,
  Rejected: <Close className="text-red-500 mb-1" fontSize="medium" />,
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("All");
  const [open, setOpen] = useState(false);


  const getStatusCount = (status: string) =>
    gigData.filter((gig) => gig.status === status).length;

  const filteredGigs =
    activeTab === "All"
      ? gigData
      : gigData.filter((gig) => gig.status === activeTab);

  return (
    <Box className=" min-h-screen">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
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
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200
        ${
          activeTab === tab
            ? "bg-white text-black shadow-sm"
            : "text-gray-700 hover:bg-gray-100"
        }`}
          >
            {tab} ({tab === "All" ? gigData.length : getStatusCount(tab)})
          </button>
        ))}
      </div>

      {/* Gig List */}
      <div className="space-y-6">
        {filteredGigs.map((gig, idx) => (
          <div
            key={idx}
            onClick={() => setOpen(true)}
            className="cursor-pointer bg-white border border-blue-100 rounded-xl px-6 py-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900">
                {gig.title}
              </h3>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
                  gig.status === "In Progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : gig.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : gig.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                }`}
              >
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
                <CalendarMonth fontSize="small" /> {gig.date}
              </div>
              <div className="flex items-center gap-1">
                <Person fontSize="small" />
                <span className="text-gray-600">Client: {gig.client}</span>
              </div>
              <div className="flex items-center gap-1 justify-end">
                <Person fontSize="small" />
                <span className="text-gray-600">Provider: {gig.provider}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog for Status History */}
      <GigStatusDialog open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}
