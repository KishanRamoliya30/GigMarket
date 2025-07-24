import React from "react";
import Footer from "@/components/user/footer/Footer";
import Header from "@/components/user/header/Header";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header />
      <div className="pt-[64px] min-h-screen flex flex-col">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
