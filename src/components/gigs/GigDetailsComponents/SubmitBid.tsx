import { apiRequest } from "@/app/lib/apiCall";
import { Bid, Gig } from "@/app/utils/interfaces";
import CustomTextField from "@/components/customUi/CustomTextField";
import { useUser } from "@/context/UserContext";
import { Circle, DollarSign, FileText, Gavel, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getStatusColor } from "../../../../utils/constants";

const SubmitBid = ({
  gigDetails,
  setGigDetails,
}: {
  gigDetails: Gig | null;
  setGigDetails: (gig: Gig) => void;
}) => {
  const [showPlaceBid, setShowPlaceBid] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidComment, setBidComment] = useState("");
  const [bidAmountType, setBidAmountType] = useState("hourly");
  const [submitting, setSubmitting] = useState(false);
  const { user, setRedirectUrl } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [error, setError] = useState({ bidAmount: "", bidComment: "" });

  useEffect(() => {
    setError((prev) => ({
      ...prev,
      bidAmount: "",
    }));
  }, [bidAmount]);

  useEffect(() => {
    setError((prev) => ({
      ...prev,
      bidComment: "",
    }));
  }, [bidComment]);

  function showPlacedBid() {
    return (
      <div className="">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {gigDetails?.createdByRole === "Provider" ? (
              <>
                <FileText className="h-6 w-6 text-emerald-600" />
                Your Request
              </>
            ) : (
              <>
                <Gavel className="h-6 w-6 text-emerald-600" />
                Your Bid
              </>
            )}
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span
              className={`px-3 py-2 text-sm font-semibold rounded-full flex items-center gap-2 ${getStatusColor(
                gigDetails?.status ?? "Open"
              )}`}
            >
              <Circle className="h-2 w-2 fill-current" />
              {gigDetails?.status}
            </span>
            <span className="text-xl font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {gigDetails?.bid?.bidAmount}
              {gigDetails?.bid?.bidAmountType === "hourly" && (
                <span className="text-sm font-medium ml-1">/ hour</span>
              )}
            </span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
            {gigDetails?.bid?.description}
          </p>
        </div>
      </div>
    );
  }

  function placebid() {
    if ((user?._id ?? "") === "") {
      setRedirectUrl(pathname);
      router.push("/login");
      return;
    }
    setShowPlaceBid(true);
  }

  function getBidBox() {
    return gigDetails?.bid ? (
      showPlacedBid()
    ) : !showPlaceBid ? (
      <button
        onClick={placebid}
        className="w-fit bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer"
      >
        {gigDetails?.createdByRole === "Provider" ? "Request" : "Place Bid"}
      </button>
    ) : (
      <div className="w-full md:w-[72%] flex flex-col">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {gigDetails?.createdByRole === "Provider"
            ? "Place Your Request"
            : "Place Your Bid"}
        </h2>

        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center">
            <input
              type="radio"
              id="hourly"
              name="bidAmountType"
              value="hourly"
              className="mr-2 accent-emerald-600"
              checked={bidAmountType === "hourly"}
              onChange={(e) => setBidAmountType(e.target.value)}
            />
            <label htmlFor="hourly" className="text-gray-700">
              Hourly Rate
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="fixed"
              name="bidAmountType"
              value="fixed"
              className="mr-2 accent-emerald-600"
              checked={bidAmountType === "fixed"}
              onChange={(e) => setBidAmountType(e.target.value)}
            />
            <label htmlFor="fixed" className="text-gray-700">
              Fixed Price
            </label>
          </div>
        </div>

        <div className="w-full flex items-center gap-2 mb-5">
          <CustomTextField
            placeholder={
              gigDetails?.createdByRole === "Provider"
                ? "Enter your request amount"
                : "Enter your bid amount"
            }
            type="number"
            style={{ width: "300px" }}
            slotProps={{ input: { startAdornment: "$" } }}
            fullWidth={true}
            isWithoutMargin
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            disabled={submitting}
            error={error.bidAmount !== ""}
            helperText={error.bidAmount}
          />
          {bidAmountType === "hourly" && (
            <h6 className="text-gray-600 font-semibold">/ hour</h6>
          )}
        </div>

        <CustomTextField
          fullWidth
          multiline
          minRows={4}
          placeholder={
            gigDetails?.createdByRole === "Provider"
              ? "Enter your request description for this gig"
              : "Why are you the best fit for this gig?"
          }
          className="bidComment"
          value={bidComment}
          onChange={(e) => setBidComment(e.target.value)}
          disabled={submitting}
          error={error.bidComment !== ""}
          helperText={error.bidComment}
        />

        <button
          onClick={handleBidSubmit}
          disabled={submitting}
          className="w-full max-w-[200px] ml-auto mt-1 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 px-6 cursor-pointer rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </span>
          ) : gigDetails?.createdByRole === "Provider" ? (
            "Submit Request"
          ) : (
            "Submit Bid"
          )}
        </button>
      </div>
    );
  }

  function handleBidSubmit() {
    let hasError = false;
    const bidError = {
      bidAmount: "",
      bidComment: "",
    };
    if (!bidAmount) {
      hasError = true;
      bidError.bidAmount = "Bid amount is required";
    } else if (isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
      bidError.bidAmount = "Invalid Amount";
    }
    if (!bidComment) {
      hasError = true;
      bidError.bidComment = "Bid Comment is required";
    }

    if (hasError) {
      setError(bidError);
      return;
    }
    const data = {
      gigId: gigDetails?._id,
      bidAmount: Number(bidAmount),
      description: bidComment,
      bidAmountType: bidAmountType,
    };
    setSubmitting(true);

    apiRequest(`gigs/${gigDetails?._id}/placeBid`, {
      method: "POST",
      data: data,
    }).then((res) => {
      setSubmitting(false);
      if (res.ok) {
        const bid = res.data.data as Bid;
        if (gigDetails) setGigDetails({ ...gigDetails, bid: bid });
      } else {
        setError({ ...error, bidComment: res.message ?? "Error placing bid" });
      }
    });
  }

  return <div>{getBidBox()}</div>;
};

export default SubmitBid;
