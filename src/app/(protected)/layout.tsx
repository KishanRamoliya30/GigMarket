"use client"
import React from "react";
import Footer from "@/components/user/footer/Footer";
import Header from "@/components/user/header/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import { useUser } from "@/context/UserContext";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
     const { user } = useUser();
    const userId = user?._id;
  return (
    <>
      <Header />

      {/* Full page layout */}
      <div className="relative pt-[64px] min-h-screen flex flex-row flex-wrap">
        {userId && 
        <div className="shadow-[4px_0_10px_rgba(0,0,0,0.1)] z-[1100]">
          <Sidebar />
        </div>
        }
        <main className="flex-1">{children}</main>
      </div>
      {/* Footer always below */}
      <Footer />
    </>
  );
};

export default Layout;
