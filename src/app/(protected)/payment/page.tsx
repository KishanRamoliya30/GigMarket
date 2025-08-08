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
    const { user } = useUser();
    
  return (
    <StyledWrapper>
      <Elements stripe={stripePromise}>
        <PaymentForm amount={125.25} gigId={"6893153df91c9998340e8c1b"} userId={user?._id ?? ""} refId={"6878eac0e9071cc473f1c91f"} gigTitle={"Test"} gigDescription={"Test"}/>
      </Elements>
    </StyledWrapper>
  );
}


const StyledWrapper = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    // paddingTop: "100px !important",
    [theme.breakpoints.up("md")]: { padding: theme.spacing(4) },
  }));
