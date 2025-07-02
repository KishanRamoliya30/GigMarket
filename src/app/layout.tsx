import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { UserProvider } from "./context/UserContext";
import { LoginUser } from "./utils/interfaces";

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET);

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
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value; 

  let userData: LoginUser = {
    _id: "",
    email: "",
    isAdmin: false,
    role: "",
  };

  if (token) {
    try {
      const { payload } = await jwtVerify(token, getSecret());
      userData = {
        _id: payload.userId as string,
        email: payload.email as string,
        isAdmin: payload.role == "Admin",
        role: payload.role?.toString() ?? "",
      };
    } catch (err) {
      console.error("Invalid JWT");
    }
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider initialUser={userData}>
          <ToastContainer />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
