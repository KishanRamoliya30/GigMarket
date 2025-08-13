"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/payment/PaymentForm";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { useUser } from "@/context/UserContext";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function PaymentPage() {
  //get user id from context
  const { user, paymentInfo } = useUser();
  const { gigId, gigTitle, gigDescription, amount, refId } = paymentInfo;
  return (
    <StyledWrapper>
      <Elements stripe={stripePromise}>
        <PaymentForm
          amount={amount}
          gigId={gigId}
          userId={user?._id ?? ""}
          refId={refId}
          gigTitle={gigTitle}
          gigDescription={gigDescription}
        />
      </Elements>
    </StyledWrapper>
  );
}

const StyledWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  // paddingTop: "100px !important",
  [theme.breakpoints.up("md")]: { padding: theme.spacing(4) },
}));
