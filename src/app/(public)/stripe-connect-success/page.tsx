"use client";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import BackButton from "@/components/customUi/BackButton";
const StyledWrapper = styled(Box)(() => ({
  backgroundColor: "#FAFDFD",
  borderRadius: 16,
  padding: "40px 24px",
  maxWidth: 600,
  margin: "60px auto",
  textAlign: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  ".icon": {
    fontSize: "64px",
    color: "#2E7D32",
    marginBottom: "16px",
  },
  ".heading": {
    fontSize: "24px",
    fontWeight: 700,
    marginBottom: "8px",
    color: "#2E7D32",
  },
  ".desc": {
    fontSize: "16px",
    color: "#555",
    marginBottom: "24px",
  },
  ".backBtn": {
    backgroundColor: "#2E7D32",
    color: "#fff",
    padding: "10px 26px",
    borderRadius: "8px",
    fontWeight: 600,
    textTransform: "none",
    fontSize: "15px",
    "&:hover": {
      backgroundColor: "#27692b",
    },
  },
}));

export default function PaymentSuccess() {

  return (
    <StyledWrapper>
      <Typography className="heading">Stripe Connect Account</Typography>
      <Typography className="desc">
        We will update the status of your Stripe Connect account once it is verified.
      </Typography>
      <Box display={"flex"} justifyContent="center">
        <BackButton
          title="Close the window"
          onClick={() => {
            window.close();
          }}
        />
      </Box>
    </StyledWrapper>
  );
}
