"use client";

import { useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import CustomButton from "@/components/customUi/CustomButton";
import GigMarketLogo from "@/components/logo";
import { apiRequest } from "@/app/lib/apiCall";

const EmailVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const router = useRouter();

  const handleVerification = async () => {
    if (!token) {
      toast.error("error");
      return;
    }

    const response = await apiRequest("verify-email", {
      method: "GET",
      params: { token },
    });

    if (response.status === 200) {
      toast.success("Email verified successfully!");
      router.push("/login");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Verification token is missing.");
    }
  }, [token]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "linear-gradient(to right, #e3f2fd, #fce4ec)",
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: "500px",
          p: 5,
          borderRadius: "16px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-50px",
            left: "-50px",
            width: "150px",
            height: "150px",
            backgroundColor: "#1976d2",
            borderRadius: "50%",
            opacity: 0.1,
            zIndex: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />

        <Box position="relative" zIndex={1}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={2}
          >
            <GigMarketLogo />
          </Box>
          <Typography variant="h6" color="text.secondary" mb={3}>
            Email Verification
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={4}>
            Please verify your email to access all features of GigMarket.
          </Typography>

          <CustomButton
            label="Verify Email"
            fullWidth
            onClick={handleVerification}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default EmailVerificationForm;
