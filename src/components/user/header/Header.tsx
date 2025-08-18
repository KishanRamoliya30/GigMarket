"use client";

import {
  Box,
  Avatar,
  Typography,
  Badge,
  InputBase,
  IconButton,
  Drawer,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import { styled, SxProps, Theme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { requestNotificationPermission } from "../../../app/utils/notificationPermission";
import FiverrLogo from "@/components/logo";
import { apiRequest } from "@/app/lib/apiCall";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import ClearIcon from "@mui/icons-material/Clear";
import NotificationModal from "@/components/user/NotificationModal";
import Cookies from "js-cookie";

const HeaderWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 24px",
  backgroundColor: "#fff",
  flexWrap: "wrap",
  position: "fixed",
  width: "100%",
  zIndex: 1111,

  "& .logoGroup": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
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
    height: "45px",
    "& svg": {
      color: "#fff",
    },
    "&:hover": {
      backgroundColor: "#444",
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("search") || ""
  );
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const notificationRef = useRef<HTMLButtonElement>(null);
  const { user, setRole, resetUser } = useUser();
  const role = user?.role;
  const _id = user?._id;
  const isAllCompleted = user?.subscriptionCompleted && user.profileCompleted;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    let isSubscribed = true;

    const initializeHeader = async () => {
      if (user?._id && isSubscribed) {
        const token = Cookies.get("token");
        if (token) {
          await requestNotificationPermission(token);
        }
      }
    };

    initializeHeader();

    const handleNewNotification = () => {
      setNotificationCount((prev) => prev + 1);
    };

    window.addEventListener("new-notification", handleNewNotification);

    return () => {
      isSubscribed = false;
      window.removeEventListener("new-notification", handleNewNotification);
    };
  }, [user?._id]);

  const handleLogout = async () => {
    const response = await apiRequest("logout", { method: "POST" });

    if (response.ok) {
      resetUser();
      router.push("/");
    } else {
      console.error("Logout failed:", response.error);
    }

    handleCloseMenu();
  };

  const handleRoleSwitch = async () => {
    try {
      const newRole = role == "User" ? "Provider" : "User";
      const response = await apiRequest("switch-user", { method: "POST" });

      if (response.ok && response.data?.message) {
        setRole(newRole);
        window.location.reload();
      } else {
        console.error("Switch failed:", response.error);
      }
    } catch (error) {
      console.error("Switch error:", error);
    }
  };

  const handleProfileSection = async () => {
    router.push("/myProfile");
    handleCloseMenu();
  };

  const handleSubscriptions = async () => {
    router.push("/subscription");
    handleCloseMenu();
  };

  const searchGigs = (isClear: boolean = false) => {
    let searchParameter = encodeURIComponent(searchTerm.trim());
    if (isClear) {
      setSearchTerm("");
      searchParameter = "";
    }
    if (pathname === "/publicGigs") {
      router.replace(`/publicGigs?search=${searchParameter}`);
      return;
    }
    router.push(`/publicGigs?search=${searchParameter}`);
  };

  const renderUserAvatar = (avatarStyles?: SxProps<Theme>) => {
    const profilePic = user?.profile?.profilePicture;
    const fullName =
      user?.profile?.fullName || `${user?.firstName} ${user?.lastName}`.trim();
    const initial = user?.firstName?.charAt(0)?.toUpperCase() || "?";

    return (
      <Badge
        variant="dot"
        color="success"
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Avatar
          sx={{
            bgcolor: "#f66",
            cursor: "pointer",
            textTransform: "capitalize",
            ...avatarStyles,
          }}
          onClick={handleAvatarClick}
          src={profilePic}
          alt={fullName}
        >
          {!profilePic && initial}
        </Avatar>
      </Badge>
    );
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

          {/* Mobile Auth Display */}
          <Box sx={{ display: { xs: "flex", sm: "none" }, gap: 2 }}>
            {!_id ? (
              <>
                <Link href="/login">
                  <Typography sx={{ fontWeight: 600, cursor: "pointer" }}>
                    Sign in
                  </Typography>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="outlined"
                    sx={{
                      color: "rgb(29, 191, 115)",
                      borderColor: "rgb(29, 191, 115)",
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 1,
                    }}
                  >
                    Join
                  </Button>
                </Link>
              </>
            ) : (
              <>{renderUserAvatar()}</>
            )}
          </Box>
        </Box>

        <Box className="searchContainer">
          <InputBase
            className="searchInput"
            placeholder="What service are you looking for today?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.trimStart())}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                searchGigs();
              }
            }}
            endAdornment={
              searchTerm && (
                <IconButton
                  size="small"
                  onClick={() => searchGigs(true)}
                  sx={{ visibility: searchTerm ? "visible" : "hidden" }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )
            }
          />
          <IconButton className="searchButton" onClick={() => searchGigs()}>
            <SearchIcon />
          </IconButton>
        </Box>

        <Box className="rightIcons hideOnMobile">
          {_id && (
            <IconButton
              size="large"
              aria-label="show notifications"
              color="inherit"
              onClick={() => {
                setNotificationOpen(true);
                setNotificationCount(0);
              }}
              ref={notificationRef}
            >
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>
          )}
          <MailOutlineIcon />
          <FavoriteBorderIcon />
          {_id && role === "Provider" && isAllCompleted && (
            <Typography
              sx={{
                fontWeight: 600,
                cursor: "pointer",
                color: "rgb(29, 191, 115)",
              }}
            >
              <Link href="/gigs/create">Add Gig</Link>
            </Typography>
          )}

          {!_id ? (
            <>
              <Link href="/login">
                <Typography sx={{ fontWeight: 600, cursor: "pointer" }}>
                  Sign in
                </Typography>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outlined"
                  sx={{
                    color: "rgb(29, 191, 115)",
                    borderColor: "rgb(29, 191, 115)",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 1,
                  }}
                >
                  Join
                </Button>
              </Link>
            </>
          ) : (
            renderUserAvatar()
          )}
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

          {_id && (
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setNotificationOpen(true);
                setIsSidebarOpen(false);
              }}
              ref={notificationRef}
            >
              <Badge badgeContent={0} color="error">
                <NotificationsNoneIcon />
              </Badge>
              <Typography>Notifications</Typography>
            </Box>
          )}
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
          {_id && (
            <Box display="flex" alignItems="center" gap={2}>
              {renderUserAvatar({ width: 32, height: 32 })}
              <Typography>My Account</Typography>
            </Box>
          )}
        </Box>
      </Drawer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            minWidth: 200,
            px: 1.5,
            py: 1.2,
          },
        }}
      >
        {_id ? (
          <Box>
            {(user.subscription?.planType ?? 0) > 1 && (
              <Button
                fullWidth
                variant="outlined"
                onClick={handleRoleSwitch}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  border: "1.5px solid black",
                  color: "#333",
                  mb: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#bbb",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                Switch to {role === "User" ? "Provider" : "User"}
              </Button>
            )}
            {(user.subscriptionCompleted || user.profileCompleted) && (
              <MenuItem onClick={handleProfileSection}>My Profile</MenuItem>
            )}
            {user.subscriptionCompleted && (
              <MenuItem onClick={handleSubscriptions}>Subscriptions</MenuItem>
            )}
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Box>
        ) : (
          <Box>
            <MenuItem onClick={() => router.push("/login")}>Sign in</MenuItem>
            <MenuItem
              sx={{
                color: "rgb(29, 191, 115)",
                borderColor: "rgb(29, 191, 115)",
              }}
              onClick={() => router.push("/signup")}
            >
              Join
            </MenuItem>
          </Box>
        )}
      </Menu>

      <NotificationModal
        anchorEl={notificationRef.current}
        open={notificationOpen}
        onClose={() => {
          setNotificationOpen(false);
        }}
      />
    </>
  );
}
