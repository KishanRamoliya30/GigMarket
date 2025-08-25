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
  DialogContent,
  Dialog,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { styled, SxProps, Theme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import Link from "next/link";
import FiverrLogo from "@/components/logo";
import { apiRequest } from "@/app/lib/apiCall";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import ClearIcon from "@mui/icons-material/Clear";
import NotificationModal from "@/components/notification/NotificationModal";
import { CreditCard, Repeat, User, Wallet } from "lucide-react";
import { notifySocket } from "../../../../utils/socket";

const HeaderWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 24px",
  backgroundColor: "#1f4b3f",
  flexWrap: "wrap",
  position: "fixed",
  width: "100%",
  zIndex: 1111,
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",

  "& .logoGroup": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  "& .searchInput": {
    padding: "8px 12px",
    flex: 1,
    fontSize: "14px",
    color: "#fff",
  },

  "& .searchButton": {
    backgroundColor: "#ffff",
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
    color: "#ffff",
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

    "& .rightIcons": {
      justifyContent: "flex-end",
      width: "100%",
      order: 3,
    },
  },
  [theme.breakpoints.down("md")]: {
    "& .menuIcon": {
      display: "flex",
      position: "absolute",
      right: "0px",
      color: "#fff",
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, setRole, resetUser } = useUser();
  const role = user?.role;
  const _id = user?._id;
  const isAllCompleted = user?.subscriptionCompleted && user.profileCompleted;
  const [searchPopupOpen, setSearchPopupOpen] = useState(false);

  // toggle function
  const toggleSearchPopup = () => {
    setSearchPopupOpen(!searchPopupOpen);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const response = await apiRequest("logout", { method: "POST" });
    if (response.ok) {
      notifySocket.emit("unregister", user?._id);
      notifySocket.disconnect();
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

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/publicGigs" },
    { name: "Providers", path: "/providers" },
  ];

  return (
    <>
      <HeaderWrapper>
        <IconButton className="menuIcon" onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
        <Box className="logoGroup">
          <Link href="/">
            <FiverrLogo textColor="#ffff" />
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
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 text-[#5bbb7b] bg-[#eef8f2] hover:text-white hover:bg-[#5bbb7b] rounded-full transition-all duration-300 font-semibold"
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              // <>{renderUserAvatar()}</>
              <></>
            )}
          </Box>
        </Box>

        <Box className="rightIcons flex items-center">
          <div className="hidden md:flex items-center space-x-8  hideOnMobile">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="font-medium hover:text-[#5bbb7b] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <Box sx={{ display: "flex" }}>
            <IconButton onClick={toggleSearchPopup}>
              <SearchIcon sx={{ color: "#fff", marginTop: "4px" }} />
            </IconButton>
          </Box>

          {_id && <NotificationModal />}
          {_id && <MailOutlineIcon className="cursor-pointer" />}
          {/* <FavoriteBorderIcon /> */}
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
            <Box className="hideOnMobile  rightIcons flex items-center space-x-4">
              <Link href="/login">
                <Typography sx={{ fontWeight: 600, cursor: "pointer" }}>
                  Sign in
                </Typography>
              </Link>
              <Link href="/signup">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 text-[#5bbb7b] bg-[#eef8f2] hover:text-white hover:bg-[#5bbb7b] rounded-full transition-all duration-300 font-semibold"
                >
                  Sign Up
                </button>
              </Link>
            </Box>
          ) : (
            <Box className="mr-0 md:mr-5">{renderUserAvatar()}</Box>
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
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="font-medium hover:text-[#5bbb7b] transition-colors"
            >
              {item.name}
            </Link>
          ))}

          {_id && (
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              sx={{ cursor: "pointer", padding: 0 }}
            >
              <NotificationModal title="Notifications" />
            </Box>
          )}
          <Box display="flex" alignItems="center" gap={2}>
            <Typography>Messages</Typography>
          </Box>

          {!_id && (
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    color: "rgb(29, 191, 115)",
                    borderColor: "rgb(29, 191, 115)",
                  }}
                  component={Link}
                  href="/login"
                >
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    color: "rgb(29, 191, 115)",
                    borderColor: "rgb(29, 191, 115)",
                  }}
                  component={Link}
                  href="/register"
                >
                  <ListItemText primary="Register" />
                </ListItemButton>
              </ListItem>
            </List>
          )}
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
          <Box sx={{ p: 1, minWidth: 220 }}>
            {(user.subscription?.planType ?? 0) > 1 && (
              <MenuItem
                onClick={handleRoleSwitch}
                sx={{
                  borderRadius: "10px",
                  mb: 0.5,
                  py: 1,
                  "&:hover": { backgroundColor: "#f5f7f9", color: "#1DBF73" },
                }}
              >
                <ListItemIcon>
                  <Repeat size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={`Switch to ${role === "User" ? "Provider" : "User"}`}
                />
              </MenuItem>
            )}

            <MenuItem
              onClick={handleProfileSection}
              sx={{
                borderRadius: "10px",
                mb: 0.5,
                py: 1,
                "&:hover": { backgroundColor: "#f5f7f9", color: "#1DBF73" },
              }}
            >
              <ListItemIcon>
                <User size={20} />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </MenuItem>

            <MenuItem
              onClick={handleSubscriptions}
              sx={{
                borderRadius: "10px",
                mb: 0.5,
                py: 1,
                "&:hover": { backgroundColor: "#f5f7f9", color: "#1DBF73" },
              }}
            >
              <ListItemIcon>
                <CreditCard size={20} />
              </ListItemIcon>
              <ListItemText primary="Subscriptions" />
            </MenuItem>

            <MenuItem
              onClick={handleLogout}
              sx={{
                borderRadius: "10px",
                py: 1,
                color: "red",
                "&:hover": { backgroundColor: "#fff5f5", color: "#d32f2f" },
              }}
            >
              <ListItemIcon>
                <Wallet size={20} color="red" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
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
              Sign Up
            </MenuItem>
          </Box>
        )}
      </Menu>

      <Dialog
        open={searchPopupOpen}
        onClose={toggleSearchPopup}
        maxWidth="md"
        PaperProps={{
          className: "shadow-none w-full flex justify-center items-start mt-40",
        }}
        sx={{
          "& .MuiDialog-container": {
            alignItems: "flex-start",
            marginTop: "80px",
            "& .MuiPaper-root": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          },
        }}
      >
        <DialogContent
          sx={{ paddingTop: "40px" }}
          className="relative w-full max-w-3xl "
        >
          <IconButton
            onClick={toggleSearchPopup}
            sx={{
              position: "absolute",
              top: -10,
              right: 15,
              color: "white",
              "&:hover": {
                color: "#e5e7eb",
              },
            }}
          >
            <CloseIcon className="w-6 h-6" />
          </IconButton>

          <div className="flex items-center bg-white rounded-md shadow-lg overflow-hidden ">
            {" "}
            <SearchIcon className="ml-4 text-gray-500 w-5 h-5" />
            <InputBase
              className="flex-1 px-4 py-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none h-[80px] "
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
            <button
              onClick={() => searchGigs()}
              className="mr-3 cursor-pointer bg-[#1DBF73] text-white font-semibold px-8 py-4 rounded-md 
             border-2 border-transparent hover:border-[#1DBF73] hover:bg-[#ffff] hover:text-[#1DBF73] transition-all"
            >
              Search
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
