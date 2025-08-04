import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import paymentLogs from "@/app/models/paymentlog";
import { successResponse ,withApiHandler} from "@/app/lib/commonHandlers";
import { verifyToken } from "@/app/utils/jwt";
export const POST = withApiHandler(async (req: NextRequest): Promise<NextResponse> => {

  await dbConnect();
    const body = await req.json();
    const { stripePaymentIntentId, gigId, refId, amount, status } = body;
    const userDetails = await verifyToken(req);

    const data = {
      stripeIntentId: stripePaymentIntentId,
      gigId: gigId,
      createdBy: userDetails?.userId,
      providerId: refId,
      amount: Number(amount),
      status: status,
    };
    
    const paymentLog = await paymentLogs.create(data);

    return successResponse(paymentLog, "Payment log saved succesfully", 201);
  
})
