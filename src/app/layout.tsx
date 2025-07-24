import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import { UserProvider } from "@/context/UserContext";
import { getLoggedInUser } from "./lib/getLoggedUser";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
  },
  title: "GigMarket | Freelance Services Marketplace",
  description:
    "GigMarket is a modern freelance marketplace connecting clients with skilled professionals across design, development, writing, marketing, and more. Hire or get hired with ease.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getLoggedInUser();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer />
        <UserProvider currentUser={user}>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
