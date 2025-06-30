"use client";

import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";

const NotFoundWrapper = styled(Box)({
  minHeight: "100vh",
  backgroundColor: "#f4f4f4",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  textAlign: "center",

  "& .icon": {
    marginBottom: "32px",
  },

  "& .code": {
    fontWeight: 700,
    fontSize: "4rem",
    marginBottom: "8px",
  },

  "& .title": {
    fontWeight: 600,
    fontSize: "1.5rem",
    marginBottom: "8px",
  },

  "& .subtitle": {
    color: "#666",
    maxWidth: "400px",
    marginBottom: "32px",
  },

  "& .backBtn": {
    textTransform: "none",
    fontWeight: 600,
    padding: "12px 32px",
    fontSize: "1rem",
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#222",
    },
  },
});

export default function NotFound() {
  const router = useRouter();

  return (
    <NotFoundWrapper>
      <Box className="icon">
        <svg
          width="180"
          height="180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 9v6"></path>
          <path d="M15 9v6"></path>
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      </Box>

      <Typography className="code">404</Typography>
      <Typography className="title">Page Not Found</Typography>
      <Typography className="subtitle">
        The page you are looking for doesn't exist or has been moved.
      </Typography>

      <Button onClick={() => router.push("/")} className="backBtn">
        ← Go to Homepage
      </Button>
    </NotFoundWrapper>
  );
}
