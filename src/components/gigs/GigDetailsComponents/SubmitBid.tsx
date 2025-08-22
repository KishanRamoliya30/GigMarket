import { apiRequest } from "@/app/lib/apiCall";
import { Bid, Gig } from "@/app/utils/interfaces";
import CustomTextField from "@/components/customUi/CustomTextField";
import { useUser } from "@/context/UserContext";
import { Circle, DollarSign, FileText, Gavel, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getStatusColor } from "../../../../utils/constants";
import { IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import ChatModal from "@/app/(protected)/chatModal/page";
import { sendNotification } from "../../../../utils/socket";

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
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  const openChatModal = () => {
    setIsChatOpen(true);
  };

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
            <IconButton aria-label="chat" onClick={() => openChatModal()}>
              <ChatIcon />
            </IconButton>
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
      <div className="flex flex-col items-center gap-8 bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl">
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-emerald-100 rounded-full mb-4 animate-bounce-slow">
            <Gavel className="w-8 h-8 text-emerald-600" />
          </div>
          <h4 className="text-2xl font-bold text-gray-800 mb-2 animate-slideDown">
            {gigDetails?.createdByRole === "Provider"
              ? "Ready to Make Your Request?"
              : "Ready to Place Your Bid?"}
          </h4>
          <p className="text-gray-600 max-w-lg leading-relaxed animate-fadeIn">
            {gigDetails?.createdByRole === "Provider"
              ? "Share your requirements and budget to find the perfect provider for your requirements."
              : "Stand out from other providers by submitting a competitive bid and highlighting your expertise."}
          </p>
        </div>
        <button
          onClick={placebid}
          className="group relative w-fit flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] cursor-pointer ml-auto mr-auto"
        >
          <Gavel className="w-6 h-6 z-10 group-hover:animate-bounce" />
          <span className="relative z-10 text-md">
            {gigDetails?.createdByRole === "Provider" ? "Request" : "Place Bid"}
          </span>
        </button>
        <style jsx>{`
          @keyframes bounce-slow {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          @keyframes wiggle {
            0%,
            100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(-10deg);
            }
            75% {
              transform: rotate(10deg);
            }
          }
          @keyframes slideDown {
            from {
              transform: translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animate-bounce-slow {
            animation: bounce-slow 3s infinite;
          }
          .animate-wiggle {
            animation: wiggle 0.3s ease-in-out;
          }
          .animate-slideDown {
            animation: slideDown 0.5s ease-out;
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out;
          }
        `}</style>
      </div>
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
          className="group relative w-fit flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] before:absolute before:inset-0 before:bg-white/10 before:rounded-xl before:opacity-0 before:transition hover:before:opacity-100 overflow-hidden cursor-pointer disabled:cursor-not-allowed ml-auto"
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
    }).then(async (res) => {
      setSubmitting(false);
      if (res.ok) {
        const bid = res.data.data as Bid;
        if (gigDetails) setGigDetails({ ...gigDetails, bid: bid });
        if (user?._id && gigDetails?.createdBy) {
          const notification = {
            senderId: user?._id.toString(),
            receiverId: gigDetails?.createdBy._id.toString(),
            title: `New Bid: ${gigDetails?.title}`,
            isRead: false,
            message: `Bid received for $${bid.bidAmount} ${bid.bidAmountType}`,
            link: `/gigs/${gigDetails?._id}`,
          };
          await sendNotification(notification);
        }
      } else {
        setError({ ...error, bidComment: res.message ?? "Error placing bid" });
      }
    });
  }

  return (
    <div>
      {getBidBox()}
      <ChatModal
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        gigId={gigDetails?._id as string}
        user1Id={gigDetails?.createdBy?._id as string}
      />
    </div>
  );
};

export default SubmitBid;
