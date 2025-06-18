"use client";
import { Box } from "@mui/material";
import {  styled } from "@mui/material/styles";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Wrapper>
      <Box className="leftPart" />
      <Box className="rightPart">
        {children}
      </Box>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",

  "& .leftPart": {
    flex: 1,
    backgroundImage: "url('https://picsum.photos/200/300')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  "& .rightPart": {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    flexDirection:"column"
  },

  [theme.breakpoints.down("sm")]: {
    "& .leftPart": {
      display: "none",
    },
  },
}));
