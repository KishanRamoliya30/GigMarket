"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  WorkOutline,
  TaskAlt,
  HourglassEmpty,
  RateReview,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import moment from "moment";
import { JSX, useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/apiCall";
import { DashboardResponse, Notification } from "@/app/utils/interfaces";
import { useUser } from "@/context/UserContext";
import { Skeleton } from "@mui/material";
import { useRouter } from "next/navigation";

export interface RecentProject {
  _id?: string;
  title: string;
  description?: string;
  createdAt: string;
  status: string;
  cost?: number;
}

const COLORS: Record<string, string> = {
  Open: "#60A5FA",
  Assigned: "#FBBF24",
  Approved: "#34D399",
  Completed: "#10B981",
  "In-Progress": "#6366F1",
  Denied: "#F87171",
  Pending: "#FACC15",
};

// 🔹 config to map BE stats keys → title + icon
const statsConfig: Record<string, { title: string; icon: JSX.Element }> = {
  postedServices: {
    title: "Posted Services",
    icon: <WorkOutline className="text-3xl text-[#1DBF73]" />,
  },
  completedServices: {
    title: "Completed Services",
    icon: <TaskAlt className="text-3xl text-green-500" />,
  },
  inQueueServices: {
    title: "In Queue Services",
    icon: <HourglassEmpty className="text-3xl text-blue-500" />,
  },
  reviews: {
    title: "Reviews",
    icon: <RateReview className="text-3xl text-yellow-500" />,
  },
};

const DashboardHome = () => {
  const [dashboardData, setDashboardData] = useState<DashboardResponse>();
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();

  const fetchDashboard = async () => {
    try {
      const res = await apiRequest(`dashboard?role=${user?.role}`, {
        method: "GET",
      });
      if (res.success) {
        setDashboardData(res.data.data);
        console.log("test data", res.data.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#f0efec] p-5 md:p-10 min-h-screen space-y-8">
        {/* Title */}
        <Skeleton variant="text" width={250} height={40} />

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white p-6 shadow rounded-lg flex justify-between items-center"
            >
              <div>
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="text" width={60} height={30} />
              </div>
              <Skeleton variant="circular" width={40} height={40} />
            </div>
          ))}
        </div>

        {/* Charts + Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 shadow h-[400px] flex justify-center items-center">
            <Skeleton variant="circular" width={200} height={200} />
          </div>
          <div className="bg-white h-[400px] shadow p-6 space-y-4">
            <Skeleton variant="text" width={150} height={30} />
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} variant="rectangular" height={60} />
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white p-6 shadow rounded-lg">
          <Skeleton variant="text" width={200} height={30} className="mb-4" />
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-4 py-3">
              <Skeleton variant="text" width={100} />
              <Skeleton variant="text" width={60} />
              <Skeleton variant="rectangular" width={80} height={30} />
              <Skeleton variant="rectangular" width={100} height={30} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load dashboard
      </div>
    );
  }

  const { stats, gigStatusData, recentProjects, notifications } = dashboardData;

  return (
    <div className="bg-[#f0efec] p-5 md:p-10 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-gray-800 mb-8"
      >
        Dashboard Overview
      </motion.h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {Object.entries(stats).map(([key, value], index) => {
          const config = statsConfig[key];
          if (!config) return null;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 shadow hover:shadow-md transition-all duration-300 flex justify-between items-center"
            >
              <div>
                <p className="text-gray-500 text-sm">{config.title}</p>
                <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
              </div>
              <div className="bg-green-50 p-3 rounded-full">{config.icon}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 bg-white p-6 shadow-md h-[400px] mb-10"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Gig Status Breakdown
          </h3>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gigStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {gigStatusData.map((entry: { name: string }, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name] || "#9CA3AF"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Notifications */}
        <div className="bg-white h-[400px] shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-200">
            {notifications.length > 0 ? (
              notifications.map((notif: Notification) => (
                <div key={notif._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {notif.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {moment(notif.createdAt).format("MMM DD, YYYY hh:mm A")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No notifications</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-6 rounded-xl shadow-md mb-10"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Recent Service Orders
        </h3>

        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 px-2 py-3 text-sm font-semibold text-gray-600 border-b">
          <span>Title</span>
          <span>Cost/Hrs</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-200">
          {recentProjects.map((project: RecentProject, index: number) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 items-center px-2 py-4 text-sm"
            >
              {/* Title & Date */}
              <div>
                <p className="font-medium text-gray-800">{project.title}</p>
                <p className="text-gray-500 flex items-center text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 mr-1 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 
                     00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {moment(project.createdAt).format("MMMM D, YYYY")}
                </p>
              </div>

              {/* Cost */}
              <div className="text-gray-700 font-medium">
                {project.cost ? `$${project.cost}` : "--"}
              </div>

              {/* Status */}
              <div>
                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium ${
                    project.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : project.status === "In-Progress"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              {/* Actions */}
              <div>
                <button
                  onClick={() => router.push(`/gigs/${project._id}`)}
                  className="px-3 py-1 text-green-700 bg-green-100 hover:bg-green-200 rounded-md text-xs font-medium"
                >
                  View History
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
