"use client";

import { useState } from "react";
import {
  Dashboard,
  ChatBubbleOutline,
  ListAlt,
  WorkOutline,
  AttachMoney,
  BarChart,
  NotificationsNone,
  Settings,
  Logout,
  Menu,
  Close,
  PersonOutline,
} from "@mui/icons-material";
import CreditCardIcon from "@mui/icons-material/CreditCard";

const menuItems = [
  { icon: <Dashboard />, label: "Dashboard" },
  { icon: <ChatBubbleOutline />, label: "Messages" },
  { icon: <ListAlt />, label: "Orders" },
  { icon: <WorkOutline />, label: "My Gigs" },
  { icon: <AttachMoney />, label: "Earnings" },
  { icon: <BarChart />, label: "Analytics" },
  { icon: <NotificationsNone />, label: "Notifications" },
  { icon: <PersonOutline />, label: "Profile" },
  { icon: <CreditCardIcon />, label: "Subscriptions" },
  { icon: <Settings />, label: "Settings" },
  { icon: <Logout />, label: "Logout", danger: true },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");

  const handleToggle = () => setOpen(!open);

  return (
    <>
      {/* Hamburger Button (Mobile Only) */}
      <button
        className="lg:hidden fixed top-20 left-4 z-[1100] bg-white p-2 rounded-md shadow "
        onClick={handleToggle}
      >
        {open ? <Close /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 bg-white shadow-lg z-[1100] transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}
      >

        <ul className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-128px)]">
          {menuItems.map(({ icon, label, danger }) => (
            <li
              key={label}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium cursor-pointer transition-all duration-200
              ${
                active === label
                  ? "bg-green-100 text-green-600"
                  : danger
                  ? "text-red-600 hover:bg-red-50"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => !danger && setActive(label)}
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
