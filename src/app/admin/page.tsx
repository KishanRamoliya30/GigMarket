"use client";

import { Box, Typography, Grid, Paper, Avatar, Stack } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GavelIcon from "@mui/icons-material/Gavel";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const dashboardStats = [
  {
    title: "Total Users",
    value: 1423,
    icon: <GroupIcon />,
    color: "#1976d2",
  },
  {
    title: "Total Posts",
    value: 389,
    icon: <AssignmentIcon />,
    color: "#9c27b0",
  },
  {
    title: "Active Bans",
    value: 24,
    icon: <GavelIcon />,
    color: "#f44336",
  },
  {
    title: "Subscriptions",
    value: "$2,340",
    icon: <MonetizationOnIcon />,
    color: "#4caf50",
  },
];

export default function AdminDashboardPage() {
  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Admin Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {dashboardStats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Paper
              elevation={3}
              sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}
            >
              <Avatar sx={{ bgcolor: stat.color }}>{stat.icon}</Avatar>
              <Stack>
                <Typography variant="subtitle2" color="text.secondary">
                  {stat.title}
                </Typography>
                <Typography variant="h6">{stat.value}</Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
