"use client";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Wrapper>
      <Box className="leftPart">
        <Box className="overlayContent">
          <Typography variant="h4" className="heading">
            Success starts here
          </Typography>

          {[
            "Over 700 categories",
            "Quality work done faster",
            "Access to talent and businesses across the globe",
            "Get your tasks completed by professionals in record time.",
            "Work with trusted freelancers and clients across the globe.",
            "Pay only when you're satisfied — protected by our escrow system.",
          ].map((text, index) => (
            <Box className="feature" key={index}>
              <CheckIcon fontSize="small" className="icon" />
              <Typography className="featureText">{text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box className="rightPart">{children}</Box>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  flexDirection: "row",
  "& .leftPart": {
    flex: 0.8,
    background: " linear-gradient(to bottom, #a74257, #6f2333)",
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "6rem 0rem",
  },

  "& .overlayContent": {
    maxWidth: 400,
    width: "100%",
    color: "#fff",
  },

  "& .heading": {
    fontWeight: 700,
    color: "#fff",
    marginBottom: theme.spacing(2),
    fontSize: "2rem",

    [theme.breakpoints.down("md")]: {
      fontSize: "1.8rem",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.5rem",
    },
  },

  "& .feature": {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },

  "& .icon": {
    color: "#fff",
    marginRight: theme.spacing(1),
  },

  "& .featureText": {
    color: "#fff",
    fontSize: "1rem",

    [theme.breakpoints.down("sm")]: {
      fontSize: "0.9rem",
    },
  },

  "& .rightPart": {
    flex: 1.2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: " linear-gradient(to bottom, #a74257, #6f2333)",
  },

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    "& .leftPart": {
      display: "none",
    },
    "& .rightPart": {
      width: "100%",
      padding: "1rem",
    },
  },
}));
