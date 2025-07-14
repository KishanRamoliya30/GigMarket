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
import { styled } from "@mui/material/styles";
import { apiRequest } from "@/app/lib/apiCall";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
 const handleLogout = async () => {
  const response = await apiRequest('logout', { method: 'POST' });

  if (response.ok) {
   router.push("/admin/login")
  } else {
    console.error("Logout failed:", response.error);
  }

  handleClose();
};
  return (
    <HeaderWrapper>
      <Box className="left">
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
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </HeaderWrapper>
  );
}