"use client";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { apiRequest } from "@/app/lib/apiCall";
import { JSX, useEffect, useState } from "react";
import { Gig } from "@/app/utils/interfaces";
import { Details } from "./GigDetailsComponents/Details";
import BackButton from "../customUi/BackButton";
import Skeleton from "./GigDetailsComponents/Skeleton";
import BidListing from "./GigDetailsComponents/BidListing";
import SubmitBid from "./GigDetailsComponents/SubmitBid";

export default function GigDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const { gigId } = params;
  const [gigDetails, setGigDetails] = useState<Gig | null>(null);

  const [loading, setLoading] = useState(true);
  const [isUserMatch, setIsUserMatch] = useState(false);

  useEffect(() => {
    gigDetail();
  }, []);

  const gigDetail = async () => {
    const apiPath = `gigs/${gigId}`;
    const res = await apiRequest(apiPath, {
      method: "GET",
    });
    if (res.ok) {
      setLoading(false);
      setGigDetails(res.data.data);
      setIsUserMatch(
        Boolean(user && user._id === res.data.data.createdBy.userId)
      );
    }
  };

  const renderDynamicContent = () => {
    return isUserMatch ? (
      <BidListing createdByRole={gigDetails?.createdByRole ?? "User"} />
    ) : (
      <SubmitBid gigDetails={gigDetails} setGigDetails={setGigDetails} />
    );
  };

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8">
      <BackButton
        title="Back to Gigs"
        onClick={() => {
          router.back();
        }}
      />
      {loading || !gigDetails ? (
        <Skeleton />
      ) : (
        <div>
          <Details gigDetails={gigDetails} />
          <div className="bg-white mt-5 rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 space-y-4 sm:space-y-4 w-full">
            {renderDynamicContent() as JSX.Element}
          </div>
        </div>
      )}
    </div>
  );
}
