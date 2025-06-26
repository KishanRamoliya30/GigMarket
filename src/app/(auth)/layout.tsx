"use client";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import GigMarketLogo from "@/components/logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Wrapper>
      <Box className="leftPart">
        <Box className="logoContainer">
          <GigMarketLogo  textColor="#fff"/>
        </Box>
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
  background: "linear-gradient(270deg, #0f2027, #203a43, #2c5364, #1a1f2b)",
  backgroundSize: "800% 800%",
  animation: "gradientShift 20s ease infinite",
   "& .leftPart": {
    flex: 0.8,
    display: "flex",
    flexDirection: "column",
    padding: "2rem",
  },

  "& .rightPart": {
    flex: 1.2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  "& .logoContainer": {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "60px",
  },

  "& .logo": {
    width: "120px",
    height: "auto",
  },

  "& .overlayContent": {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 400,
    width: "100%",
    margin: "0 auto",
    color: "#fff",
  },
  
  "& .heading": {
  fontWeight: 700,
  color: "#fff",
  marginBottom: theme.spacing(2),
  fontSize: "2rem",

  [theme.breakpoints.down("md")]: {
    fontSize: "1.5rem",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.2rem",
  },
},

"& .featureText": {
  color: "#fff",
  fontSize: "1rem",

  [theme.breakpoints.down("md")]: {
    fontSize: "0.9rem",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.85rem",
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
[theme.breakpoints.down("md")]: {
  flexDirection: "column",

  "& .leftPart": {
    display: "none",
  },

  "& .rightPart": {
    width: "100%",
    padding: "1rem",
  },
},
 "@keyframes gradientShift": {
    "0%": {
      backgroundPosition: "0% 50%",
    },
    "50%": {
      backgroundPosition: "100% 50%",
    },
    "100%": {
      backgroundPosition: "0% 50%",
    },
  },
}));
