
"use client";

import { Box, Typography } from "@mui/material";
import AdminSidebar from "@/components/AdminSidebar";
import { ReactNode } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9f9f9" }}>
    
      <AdminSidebar />

      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "#fff",
          minHeight: "100vh",
          borderLeft: "1px solid #eee",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: "gray" }}>
            Welcome, Admin
          </Typography>
        </Box>

        {children}
      </Box>
    </Box>
  );
}