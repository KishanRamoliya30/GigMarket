"use client";

import {
  Box,
  Avatar,
  Typography,
  Badge,
  InputBase,
  IconButton,
  Drawer,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import Link from "next/link";
import FiverrLogo from "@/components/logo";

const HeaderWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 24px",
  borderBottom: "1px solid #eee",
  backgroundColor: "#fff",
  flexWrap: "wrap",
  gap: "12px",

  "& .logoGroup": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  "& .logo": {
    fontWeight: 700,
    fontSize: 24,
  },

  "& .searchContainer": {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "6px",
    overflow: "hidden",
    flex: 1,
    minWidth: 250,
    maxWidth: 600,
  },

  "& .searchInput": {
    padding: "8px 12px",
    flex: 1,
    fontSize: "14px",
    color: "#333",
  },

  "& .searchButton": {
    backgroundColor: "#222325",
    borderRadius: 0,
    padding: "10px 14px",
    "& svg": {
      color: "#fff",
    },
  },

  "& .rightIcons": {
    display: "flex",
    alignItems: "center",
    gap: "26px",
    color: "#555",
  },

  "& .menuIcon": {
    display: "none",
  },

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: "8px",

    "& .logoGroup": {
      width: "100%",
      justifyContent: "space-between",
    },

    "& .searchContainer": {
      width: "100%",
      order: 2,
    },

    "& .rightIcons": {
      justifyContent: "flex-end",
      width: "100%",
      order: 3,
    },
  },
  [theme.breakpoints.down("md")]: {
    "& .menuIcon": {
      display: "inline-flex",
    },
    "& .hideOnMobile": {
      display: "none",
    },
  },
}));

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <HeaderWrapper>
        <Box className="logoGroup">
          <IconButton className="menuIcon" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>

            <Link href="/">
              <FiverrLogo />
            </Link>


          <Box sx={{ display: { sm: "none" } }}>
            <Badge
              variant="dot"
              color="success"
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Avatar sx={{ bgcolor: "#f66" }}>M</Avatar>
            </Badge>
          </Box>
        </Box>

        <Box className="searchContainer">
          <InputBase
            className="searchInput"
            placeholder="What service are you looking for today?"
          />
          <IconButton className="searchButton">
            <SearchIcon />
          </IconButton>
        </Box>

        <Box className="rightIcons hideOnMobile">
          <NotificationsNoneIcon />
          <MailOutlineIcon />
          <FavoriteBorderIcon />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Orders
          </Typography>
          <Badge
            variant="dot"
            color="success"
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Avatar sx={{ bgcolor: "#f66" }}>M</Avatar>
          </Badge>
        </Box>
      </HeaderWrapper>

      <Drawer anchor="left" open={isSidebarOpen} onClose={toggleSidebar}>
        <Box
          sx={{
            width: 260,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            px: 2,
            py: 3,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight={700} fontSize={20}>
              Menu
            </Typography>
            <IconButton onClick={toggleSidebar}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <NotificationsNoneIcon />
            <Typography>Notifications</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <MailOutlineIcon />
            <Typography>Messages</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <FavoriteBorderIcon />
            <Typography>Wishlist</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography>Orders</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: "#f66", width: 32, height: 32 }}>M</Avatar>
            <Typography>My Account</Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
