"use client";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import GigMarketLogo from "@/components/logo";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <Wrapper>
      <Box className="logoContainer" onClick={() => router.push("/")}>
        <GigMarketLogo textColor="#ffff" />
      </Box>

      <Box className="overlay" />

      <Box className="formContainer">{children}</Box>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  width: "100%",
  backgroundImage: "url('/auth.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",

  "& .logoContainer": {
    position: "absolute",
    top: "20px",
    left: "30px",
    cursor: "pointer",
    zIndex: 3,
  },

  "& .overlay": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.45)",
    zIndex: 1,
  },

  "& .formContainer": {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: 700,
  },

  [theme.breakpoints.down("sm")]: {
    "& .formContainer": {
      maxWidth: "90%",
      padding: "1.5rem",
    },
  },
}));
