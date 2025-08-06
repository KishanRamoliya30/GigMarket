"use client";

import React, { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/apiCall";
import { useUser } from "@/context/UserContext";

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

const DisputeManagement: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

 const {user} = useUser();
  const userId = user?._id;

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await apiRequest(`disputes?userId=${userId}`, {
          method: "GET",
        });
        if (res.success) {
          console.log("Disputes fetched successfully:", res.data);
          setDisputes(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch disputes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Dispute Management</h2>

      {loading ? (
        <p>Loading...</p>
      ) : disputes.length === 0 ? (
        <p>No disputes found.</p>
      ) : (
        <div className="space-y-4">
          {disputes?.map((dispute) => (
            <div
              key={dispute._id}
              className="border p-4 rounded-lg shadow bg-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Gig ID:</strong> {dispute.gigId}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Submitted:</strong>{" "}
                    {new Date(dispute.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
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

              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Rating:</strong> {dispute.rating} ⭐
                </p>
                <p>
                  <strong>Review:</strong> {dispute.review}
                </p>
                <p>
                  <strong>Issue:</strong> {dispute.complaint.issue}
                </p>
                <p>
                  <strong>Suggested Improvement:</strong>{" "}
                  {dispute.complaint.improvementSuggestion}
                </p>
                <p>
                  <strong>Sincerity Agreement:</strong>{" "}
                  {dispute.complaint.sincerityAgreement ? "✔️ Yes" : "❌ No"}
                </p>
                {dispute.complaint.providerResponse && (
                  <p>
                    <strong>Provider Response:</strong>{" "}
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

export default DisputeManagement;
