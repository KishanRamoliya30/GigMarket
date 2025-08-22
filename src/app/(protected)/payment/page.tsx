"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/payment/PaymentForm";
import { Box, Dialog, DialogTitle, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import { useUser } from "@/context/UserContext";
import CloseIcon from "@mui/icons-material/Close";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface PaymentPageProps {
  asModal?: boolean;
  open?: boolean;
  onClose?: () => void;
}

export default function PaymentPage({
  asModal = false,
  open = false,
  onClose,
}: PaymentPageProps) {
  //get user id from context
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
