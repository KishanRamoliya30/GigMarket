"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";

const HeaderWrapper = styled(Box)(({ theme }) => ({
  width: "100%,",
  height: 64,
  backgroundColor: "#f7f7f7",
  color: "#333",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 24px",
  borderBottom: "1px solid #ddd",

  "& .left": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  "& .right": {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  [theme.breakpoints.down("sm")]: {
    padding: "0 16px",
    "& .hideOnMobile": {
      display: "none",
    },
  },
}));

export default function AdminHeader() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <HeaderWrapper>
      <Box className="left">
        <IconButton sx={{ color: "#333" }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={600}>
          Admin Panel
        </Typography>
      </Box>

      <Box className="right">
        <Typography variant="body2" className="hideOnMobile">
          Welcome, Admin
        </Typography>
        <IconButton onClick={handleOpen}>
          <Avatar sx={{ bgcolor: "#f44336" }}>A</Avatar>
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </Box>
    </HeaderWrapper>
  );
}