import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Gig from "@/app/models/gig";
import Bid from "@/app/models/bid";
import { ApiError } from "@/app/lib/commonError";
import { successResponse, withApiHandler } from "@/app/lib/commonHandlers";
import { verifyToken } from "@/app/utils/jwt";
import User from "@/app/models/user";
import "@/app/models/profile";

// When a client requests a provider's gig, the provider can either accept (assigned) or decline(not-assigned) the request
// If the provider accepts the request, a new gig is created from the client side and a corresponding bid is created and assigned to the provider

export const PATCH = withApiHandler(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ gigId: string }> }
  ): Promise<NextResponse> => {
    await dbConnect();

    const { gigId } = await params;
    const { status, bidId, clientId } = await req.json();

    // check authorization
    await validateUser(req);

    // check gig exist
    const providerGig = await validateProviderGig(gigId);

    // check client exists
    const { clientRequest, client } = await validateClientWithBid(
      bidId,
      clientId
    );

    // check status
    if (status === "Assigned") {
      const plan = client.subscription?.planName || "Free";
      const clientName = client?.profile?.fullName || "Client";
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      if (plan === "Free") {
        throw new ApiError(
          `You can't accept this request due to ${clientName} has no access to this feature with Free plan.`,
          403
        );
      }

      if (plan === "Basic") {
        const currentMonthGigCount = await Gig.countDocuments({
          createdBy: client._id,
          createdAt: { $gte: startOfMonth },
        });

        if (currentMonthGigCount >= 3) {
          throw new ApiError(
            `You can't accept this request due to ${clientName} has reached the monthly limit of 3 gigs for Basic plan`,
            403
          );
        }
      }

      // check bid description
      const desc = `Provider(${providerGig.createdBy.firstName + " " + providerGig.createdBy.lastName}): ${providerGig.description}\nClient(${clientName}): ${clientRequest.description}`;
      const title = `${providerGig.title} - ${clientName}`;

      // Create new providerGig from client side
      const clientGigData = {
        title: title,
        description: desc,
        tier: providerGig.tier,
        price: clientRequest.bidAmount,
        time: providerGig.time,
        keywords: providerGig.keywords,
        releventSkills: providerGig.releventSkills,
        certification: providerGig.certification,
        gigImage: providerGig.gigImage,
        createdByRole: "User",
        createdBy: client._id,
        status: "Assigned",
        isPublic: false,
        assignedToBid: bidId,
        statusHistory: [
          {
            previousStatus: "",
            currentStatus: "Assigned",
            changedBy: client._id,
            changedByName: clientName || "Client",
            changedByRole: "User",
            description: "Gig assigned to provider",
            changedAt: new Date(),
          },
        ],
      };

      const clientGig = await Gig.create(clientGigData);

      const providerBidData = {
        gigId: clientGig._id,
        createdBy: providerGig.createdBy, // Original gig creator (provider)
        bidAmount: clientRequest.bidAmount,
        description: clientRequest.description.trim(),
        status: "Assigned",
        bidAmountType: clientRequest.bidAmountType,
      };

      const providerBid = await Bid.create(providerBidData);

      if (clientGig && providerBid) {
        clientRequest.status = status;
        clientRequest.associatedOtherGig = clientGig._id;
        await clientRequest.save();
      }

      return successResponse(
        clientRequest,
        `Successfully accepted ${clientName}'s request and created a new gig with bid assigned to you`
      );
    }

    clientRequest.status = status;
    await clientRequest.save();

    return successResponse(null, `Request rejected`);
  }
);

interface UserDetails {
  userId: string;
  role: string;
}

const validateUser = async (req: NextRequest): Promise<void> => {
  const userDetails = (await verifyToken(req)) as UserDetails;
  if (!userDetails?.userId || !userDetails?.role) {
    throw new ApiError("Unauthorized request", 401);
  }
};

const validateProviderGig = async (gigId: string) => {
  if (!gigId?.trim()) {
    throw new ApiError("Gig id not found", 404);
  }

  const gig = await Gig.findById(gigId)
    .populate({
      path: "createdBy",
      model: "users",
    })
    .exec();

  if (!gig) {
    throw new ApiError("Gig not found", 404);
  }

  return gig;
};

const validateClientWithBid = async (bidId: string, clientId: string) => {
  if (!clientId?.trim()) {
    throw new ApiError("Client Id is required", 404);
  }
  if (!bidId?.trim()) {
    throw new ApiError("Bid Id is required", 404);
  }

  const [client, bid] = await Promise.all([
    User.findById(clientId)
      .populate({
        path: "profile",
        model: "profiles",
      })
      .exec(),
    Bid.findById(bidId).exec(),
  ]);

  if (!client) {
    throw new ApiError("User not found", 404);
  }
  if (!bid) {
    throw new ApiError("Bid not found", 404);
  }

  return { clientRequest: bid, client };
};
