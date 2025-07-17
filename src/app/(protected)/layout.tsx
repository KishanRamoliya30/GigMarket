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
      <div className="pt-[64px] min-h-screen flex flex-col">
        {/* Sidebar + Content */}
        <div className="flex flex-1">
          <div className="sticky top-[64px] h-[calc(100vh-64px)]">
            <Sidebar />
          </div>
          <main className="flex-1 px-4 py-6">{children}</main>
        </div>

        {/* Footer always below */}
        <Footer />
      </div>
    </>
  );
};

export default Layout;
