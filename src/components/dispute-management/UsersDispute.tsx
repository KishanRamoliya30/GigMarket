"use client";

import React, { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/apiCall";
import { useUser } from "@/context/UserContext";
import Loader from "@/components/Loader";

type Complaint = {
  issue: string;
  improvementSuggestion: string;
  sincerityAgreement: boolean;
  providerResponse?: string;
};

type Dispute = {
  _id: string;
  gigId: string;
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
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-5 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Gig ID:</span>{" "}
                    {dispute.gigId}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(dispute.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
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

              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-bold">Ratings:</span> {dispute.rating} ⭐
                </p>
                <p>
                  <span className="font-bold">Review:</span> {dispute.review}
                </p>
                <p>
                  <span className="font-bold">Issue:</span>{" "}
                  {dispute.complaint.issue}
                </p>
                <p>
                  <span className="font-bold">Suggested Improvement:</span>{" "}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersDispute;
