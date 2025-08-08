"use client";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

const StyledEarningsWrapper = styled("div")({
  backgroundColor: "#F4FBF9",
  padding: "24px",
  borderRadius: "12px",
  fontFamily: "inherit",
  maxWidth: "900px",
  margin: "0 auto",

  ".section": {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  ".sectionTitle": {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1B5E20",
    marginBottom: "12px",
  },
  ".label": {
    fontWeight: 500,
    color: "#4B4B4B",
    marginRight: "8px",
  },
  ".value": {
    color: "#1B5E20",
    fontWeight: 600,
  },
  ".statsGrid": {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
  },
  ".statCard": {
    border: "1px solid #D0F0E5",
    borderRadius: "8px",
    padding: "12px",
    textAlign: "center",
    backgroundColor: "#E6F4F1",
  },
  ".statLabel": {
    fontSize: "14px",
    color: "#4B4B4B",
  },
  ".statValue": {
    fontSize: "18px",
    fontWeight: 700,
    color: "#1B5E20",
  },
});

export default function EarningPage() {
  return (
    <StyledEarningsWrapper>
      {/* Gig Detail Section */}
      <Box className="section">
        <Typography className="sectionTitle">Gig Details</Typography>
        <Typography>
          <span className="label">Title:</span>
          <span className="value">Full Website Design</span>
        </Typography>
        <Typography>
          <span className="label">Category:</span>
          <span className="value">UI/UX</span>
        </Typography>
        <Typography>
          <span className="label">Duration:</span>
          <span className="value">15 Days</span>
        </Typography>
      </Box>

      {/* Usage Stats Section */}
      <Box className="section">
        <Typography className="sectionTitle">Gig Usage</Typography>
        <Box className="statsGrid">
          <Box className="statCard">
            <Typography className="statLabel">Views</Typography>
            <Typography className="statValue">1240</Typography>
          </Box>
          <Box className="statCard">
            <Typography className="statLabel">Bids Received</Typography>
            <Typography className="statValue">37</Typography>
          </Box>
          <Box className="statCard">
            <Typography className="statLabel">Approved</Typography>
            <Typography className="statValue">12</Typography>
          </Box>
          <Box className="statCard">
            <Typography className="statLabel">Rejected</Typography>
            <Typography className="statValue">5</Typography>
          </Box>
        </Box>
      </Box>

      {/* Payment Section */}
      <Box className="section">
        <Typography className="sectionTitle">Payments</Typography>
        <Typography>
          <span className="label">Total Earned:</span>
          <span className="value">₹ 75,000</span>
        </Typography>
        <Typography>
          <span className="label">Last Payment:</span>
          <span className="value">₹ 15,000 on 3rd Aug 2025</span>
        </Typography>
        <Typography>
          <span className="label">Pending:</span>
          <span className="value">₹ 10,000</span>
        </Typography>
      </Box>
    </StyledEarningsWrapper>
  );
}
