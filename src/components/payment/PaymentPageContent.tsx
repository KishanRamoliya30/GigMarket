"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Box, Dialog, DialogTitle, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import PaymentForm from "./PaymentForm";
import { useUser } from "@/context/UserContext";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export interface PaymentPageProps {
  asModal?: boolean;
  open?: boolean;
  onClose?: () => void;
}

export default function PaymentPageContent({
  asModal = false,
  open = false,
  onClose,
}: PaymentPageProps) {
  // get user id from context
  const { user, paymentInfo } = useUser();
  const { gigId, gigTitle, gigDescription, amount, refId } = paymentInfo;

  const content = (
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
  );

  if (asModal) {
    return (
      <Dialog open={open} fullWidth maxWidth="sm">
        <DialogTitle className="!mb-[-70px] flex justify-end items-center">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <StyledWrapper>{content}</StyledWrapper>
      </Dialog>
    );
  }

  return <StyledWrapper>{content}</StyledWrapper>;
}

const StyledWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  // paddingTop: "100px !important",
  [theme.breakpoints.up("md")]: { padding: theme.spacing(4) },
}));
