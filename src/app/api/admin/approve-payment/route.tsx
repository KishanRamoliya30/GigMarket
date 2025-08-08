import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import { successResponse ,withApiHandler} from "@/app/lib/commonHandlers";
import { verifyToken } from "@/app/utils/jwt";
import User from "@/app/models/user";
import { stripe } from "@/app/lib/strip";
import { ApiError } from "@/app/lib/commonError";
import Gigs from "@/app/models/gig";
import paymentLogs from "@/app/models/paymentlog";
import Transfer from "@/app/models/transfer";

export const POST = withApiHandler(async (req: NextRequest): Promise<NextResponse> => {

  await dbConnect();
    const userDetails = await verifyToken(req);
    if (!userDetails) {
      throw new ApiError('Unauthorized request', 401);
    }
    const user= await User.findById(userDetails?.userId);
    if (!user) {
        throw new ApiError("User not found", 404);
    }
    if(!user.isAdmin){
        throw new ApiError("Only admin can transfer payments", 403);
    }

    const { gigId,providerId } = await req.json();

    const gig = await Gigs.findById(gigId);
    if (!gig) { 
        throw new ApiError("Gig not found", 404);
    }

    const logs = await paymentLogs.find({ gigId, status: "Success" });
    if (logs.length === 0) {
        throw new ApiError("No successful payments found for this gig", 404);
    }
    const amount = logs.reduce((acc, log) => acc + log.amount, 0);
    if (amount <= 0) {  
        throw new ApiError("No payments to transfer for this gig", 400);
    }
    const gigUser = await User.findById(gig.createdBy);
    if (!gigUser) {
        throw new ApiError("Gig creator not found", 404);
    }
    const provider = await User.findById(providerId);
    if (!provider) {
        throw new ApiError("Provider not found", 404);
    }
    if (!provider.stripeConnectAccountId) {
        throw new ApiError("Provider does not have a stripe connect account", 400);
    }
   
    const transfer = await stripe.transfers.create({
      amount: amount*100,
      currency: "usd",
      destination: provider.stripeConnectAccountId,
      description: `Payment for gig ${gig.title} by ${gigUser.firstName} ${gigUser.lastName}`,
      metadata: { gigId, providerId },
    });
    const transferObj = await Transfer.create({
        amount,
        currency: "usd",
        providerId,
        gigId,
        transferId: transfer.id,
        accountId: provider.stripeConnectAccountId,
        status: "Pending",
        createdBy: user._id,
      });
    return successResponse(
      { transferObj, transferId: transfer.id, accountId: provider.stripeConnectAccountId },
      "Payment transferred to stripe connect account successfully",
      201
    );
})
