
"use client";

import { Box} from "@mui/material";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { ReactNode } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
    <AdminHeader/>
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
        {children}
      </Box>
    </Box>
    </>
  );
}