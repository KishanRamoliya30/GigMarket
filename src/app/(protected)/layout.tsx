import React from "react";
import Footer from "@/components/user/footer/Footer";
import Header from "@/components/user/header/Header";
import Sidebar from "@/components/dashboard/Sidebar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header />

      {/* Full page layout */}
      <div className="relative pt-[64px] min-h-screen flex flex-row flex-wrap">
        <div className="shadow-[4px_0_10px_rgba(0,0,0,0.1)] z-[1100]">
          <Sidebar />
        </div>
        <main className="flex-1">{children}</main>
      </div>
      {/* Footer always below */}
      <Footer />
    </>
  );
};

export default Layout;
