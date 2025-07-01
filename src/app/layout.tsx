import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import { cookies } from "next/headers";
import { getUserFromSession } from "@/lib/getCurrentUser";
import { UserProvider } from "@/context/UserContext";
import { serializeDoc } from "@/utils/serialize";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GigMarket | Freelance Services Marketplace",
  description:
    "GigMarket is a modern freelance marketplace connecting clients with skilled professionals across design, development, writing, marketing, and more. Hire or get hired with ease.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const user = await getUserFromSession(cookieStore);
  const plainUser = user ? serializeDoc(user) : null;
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer />
        <UserProvider user={plainUser}>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
