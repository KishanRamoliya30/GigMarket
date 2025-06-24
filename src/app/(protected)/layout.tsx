import React from "react";
import Footer from "@/components/user/footer/Footer";
import Header from "@/components/user/header/Header";
const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default layout;
