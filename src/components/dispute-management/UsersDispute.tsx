"use client";

import React, { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/apiCall";
import { useUser } from "@/context/UserContext";
import Loader from "@/components/Loader";
import { Tooltip } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";

type Complaint = {
  issue: string;
  improvementSuggestion: string;
  sincerityAgreement: boolean;
  providerResponse?: string;
};

type Dispute = {
  _id: string;
  gigId: {
    _id: string;
    title: string;
    gigImage?: {
      url: string;
    };
  };
  createdBy: string;
  rating: number;
  review: string;
  complaint: Complaint;
  paymentWithheld: boolean;
  status: "Pending" | "Approved" | "Rejected" | string;
  createdAt: string;
};

const UsersDispute: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const userId = user?._id;

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await apiRequest(`disputes?userId=${userId}`, {
          method: "GET",
        });
        if (res.success) {
          setDisputes(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch disputes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, [userId]);
  console.log("Disputes Data:", disputes); // Debugging line to check disputes data
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Dispute Management
      </h2>

      {loading ? (
        <Loader loading={loading} />
      ) : disputes.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-10">
          No disputes found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {disputes.map((dispute) => (
            <div
              key={dispute._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="p-5 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 leading-tight">
                    {dispute.gigId?.title?.length > 40 ? (
                      <Tooltip
                        title={dispute.gigId.title}
                        placement="top"
                        arrow
                      >
                        <span>{dispute.gigId.title.slice(0, 40) + "..."}</span>
                      </Tooltip>
                    ) : (
                      dispute.gigId?.title
                    )}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                      dispute.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : dispute.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {dispute.status}
                  </span>
                </div>

                {/* Date */}
                <p className="text-xs text-gray-400 mb-3">
                  {new Date(dispute.createdAt).toLocaleString()}
                </p>

                {/* Ratings */}
                <div className="flex items-center gap-1 mb-3">
                  <span className="font-semibold text-gray-700">Rating:</span>
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < dispute.rating ? (
                        <Star className="text-yellow-500" fontSize="small" />
                      ) : (
                        <StarBorder
                          className="text-yellow-500"
                          fontSize="small"
                        />
                      )}
                    </span>
                  ))}
                </div>

                {/* Review Info */}
                <div className="space-y-1 text-sm text-gray-700 flex-1">
                  <p>
                    <span className="font-bold">Review:</span> {dispute.review}
                  </p>
                  <p>
                    <span className="font-bold">Issue:</span>{" "}
                    {dispute.complaint.issue}
                  </p>
                  <p>
                    <span className="font-bold">Improvement:</span>{" "}
                    {dispute.complaint.improvementSuggestion}
                  </p>
                  <p>
                    <span className="font-bold">Sincerity Agreement:</span>{" "}
                    {dispute.complaint.sincerityAgreement ? "✔️ Yes" : "❌ No"}
                  </p>
                  {dispute.complaint.providerResponse && (
                    <p>
                      <span className="font-bold">Provider Response:</span>{" "}
                      {dispute.complaint.providerResponse}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersDispute;
