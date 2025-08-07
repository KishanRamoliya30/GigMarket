import React, { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/apiCall";
import Loader from "@/components/Loader";
import CustomButton from "../customUi/CustomButton";

type Complaint = {
  issue: string;
  improvementSuggestion: string;
  sincerityAgreement: boolean;
};

type Rating = {
  _id: string;
  rating: number;
  review: string;
  complaint: Complaint;
  paymentWithheld: boolean;
  status: string;
  createdAt: string;
  userName?: string; // <-- Make sure you include this in the backend response
};

type Gig = {
  _id: string;
  title: string;
  gigImage?: {
    url: string;
  };
  createdAt: string;
  ratings: Rating[];
};

const ProvidersDispute = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviderDisputes = async () => {
      try {
        const res = await apiRequest("listing", { method: "GET" });
        if (res.success) {
          setGigs(res.data.data.gigs);
        }
      } catch (err) {
        console.error("Error fetching disputes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderDisputes();
  }, []);


  if (loading) return <Loader loading={true} />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Disputed Gigs</h2>

      {gigs.length === 0 ? (
        <div className="text-center text-gray-500">No disputed gigs found.</div>
      ) : (
        gigs.map((gig) => (
          <div
            key={gig._id}
            className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200"
          >
            <div className="flex items-center gap-4 mb-4">
              {gig.gigImage?.url && (
                <img
                  src={gig.gigImage.url}
                  alt={gig.title}
                  className="w-20 h-20 object-cover rounded-md"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {gig.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(gig.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {gig.ratings
              .filter((r) => r.complaint)
              .map((rating) => (
                <div
                  key={rating._id}
                  className="bg-gray-50 p-4 rounded-md border border-gray-100 mb-4"
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      <strong>Rating:</strong> {rating.rating} ⭐
                    </span>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        rating.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : rating.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {rating.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-800 mb-1">
                    <strong>Given By:</strong> {rating.userName || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-800 mb-1">
                    <strong>Review:</strong> {rating.review}
                  </p>
                  <p className="text-sm text-gray-800 mb-1">
                    <strong>Complaint Issue:</strong> {rating.complaint.issue}
                  </p>
                  <p className="text-sm text-gray-800 mb-1">
                    <strong>Improvement Suggestion:</strong>{" "}
                    {rating.complaint.improvementSuggestion}
                  </p>
                  <p className="text-sm text-gray-800 mb-2">
                    <strong>Sincerity Agreement:</strong>{" "}
                    {rating.complaint.sincerityAgreement ? "✔️ Yes" : "❌ No"}
                  </p>

                  {/* Challenge Button */}
                  <CustomButton label="Challenge" />
                </div>
              ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ProvidersDispute;
