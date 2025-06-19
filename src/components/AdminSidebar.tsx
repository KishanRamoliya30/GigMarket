"use client";

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PostAddIcon from "@mui/icons-material/PostAdd";
import BlockIcon from "@mui/icons-material/Block";
import GroupIcon from "@mui/icons-material/Group";
import PaymentIcon from "@mui/icons-material/Payment";
import GavelIcon from "@mui/icons-material/Gavel";
import { usePathname, useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";

const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
  { label: "Manage Posts", icon: <PostAddIcon />, path: "/admin/manage-posts" },
  { label: "User Ban", icon: <BlockIcon />, path: "/admin/user-ban" },
  {
    label: "User Management",
    icon: <GroupIcon />,
    path: "/admin/user-management",
  },
  {
    label: "Subscriptions",
    icon: <PaymentIcon />,
    path: "/admin/subscriptions",
  },
  { label: "Terms & Services", icon: <GavelIcon />, path: "/admin/terms" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Wrapper>
      <List>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              onClick={() => router.push(item.path)}
              sx={{
                backgroundColor: isActive ? "#f0f0f0" : "transparent",
                borderLeft: isActive
                  ? "4px solid #555"
                  : "4px solid transparent",
                fontWeight: isActive ? "bold" : "normal",
                "&:hover": {
                  backgroundColor: "#f9f9f9",
                },
              }}
            >
              <ListItemIcon className="listIcon">{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: 14 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Wrapper>
  );
}
const Wrapper = styled(Box)(({ theme }) => ({
  width: 240,
  height: "100vh",
  borderRight: "1px solid #eee",
  backgroundColor: "#fff",
  paddingTop: 2,
  "& .listIcon": {
    color: "#555",
    minWidth: 36,
  },
}));
