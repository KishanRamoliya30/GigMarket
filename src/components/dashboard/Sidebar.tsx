"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

import {
  Dashboard,
  ChatBubbleOutline,
  ListAlt,
  WorkOutline,
  AttachMoney,
  BarChart,
  NotificationsNone,
  Settings,
  Menu,
  Close,
  PersonOutline,
  Gavel
} from "@mui/icons-material";
import CreditCardIcon from "@mui/icons-material/CreditCard";

let menuItems = [
  { icon: <Dashboard />, label: "Dashboard", path: "/dashboard" },
  { icon: <PersonOutline />, label: "Profile", path: "/myProfile" },
  { icon: <CreditCardIcon />, label: "Subscriptions", path: "/subscription" },
  { icon: <WorkOutline />, label: "My Gigs", path: "/myGigs" },
  { icon: <BarChart />, label: "Gig Management", path: "/gig-management" },
  { icon: <Gavel />, label: "Dispute Management", path: "/dispute-management" },
  { icon: <ChatBubbleOutline />, label: "Messages", path: "/dashboard" },
  { icon: <ListAlt />, label: "Orders", path: "/dashboard" },
  { icon: <AttachMoney />, label: "Earnings", path: "/dashboard" },
  { icon: <AttachMoney />, label: "Payment History", path: "/paymentHistory" },
  { icon: <NotificationsNone />, label: "Notifications", path: "/dashboard" },
  { icon: <Settings />, label: "Settings", path: "/dashboard" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const router = useRouter();
  const { user } = useUser();

  menuItems = menuItems.filter((item) =>
    user?.role === "User"
      ? item.label !== "Earnings"
      : item.label !== "Payment History"
  );
  const handleToggle = () => setOpen(!open);

  const handleItemClick = (label: string, path: string, danger?: boolean) => {
    if (!danger) setActive(label);
    router.push(path);
    setOpen(false);
  };

  return (
    <>
      {/* Hamburger Button (Mobile Only) */}
      <button
        className="lg:hidden fixed top-20 left-4 z-[1100] bg-white p-2 rounded-md shadow"
        onClick={handleToggle}
      >
        {open ? <Close /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-[64px] left-0 w-64 bg-white  z-[1100] transition-transform duration-300 ease-in-out
  ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static  flex flex-col`}
      >
        <ul className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-128px)]">
          {menuItems.map(({ icon, label, path }) => (
            <li
              key={label}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium cursor-pointer transition-all duration-200
              ${
                active === label
                  ? "bg-green-100 text-green-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleItemClick(label, path)}
            >
              {icon}
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Transparent Overlay for Mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-white/20 backdrop-blur-sm z-[1000] lg:hidden"
          onClick={handleToggle}
        />
      )}
    </>
  );
};

export default Sidebar;
