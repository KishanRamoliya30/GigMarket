"use client";

import { Typography } from "@mui/material";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const sections = [
  {
    title: "About",
    links: [
      "Careers",
      "Press & News",
      "Partnerships",
      "Privacy Policy",
      "Terms of Service",
    ],
  },
  {
    title: "Categories",
    links: [
      "Graphics & Design",
      "Digital Marketing",
      "Writing & Translation",
      "Video & Animation",
      "Programming & Tech",
    ],
  },
  {
    title: "Support",
    links: [
      "Help & Support",
      "Trust & Safety",
      "Selling on GigMarket",
      "Buying on GigMarket",
    ],
  },
  {
    title: "Community",
    links: ["Events", "Forum", "Blog", "Influencers", "Affiliates"],
  },
  {
    title: "More From GigMarket",
    links: [
      "GigMarket Pro",
      "GigMarket Studios",
      "Logo Maker",
      "Learn",
      "Mobile App",
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1f4b3f] text-white px-6 py-12 rounded-t-[3rem]">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-gray-400 gap-4 mb-10">
        <div className="flex items-center gap-4">
          <Link href="/terms-of-service">
            <Typography className="text-gray-300 hover:text-white">
              Terms of Service
            </Typography>
          </Link>

          <Link href="/privacy-policy">
            <Typography className="text-gray-300 hover:text-white">
              Privacy Policy
            </Typography>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-300 hover:text-white">Follow Us</span>
          <a href="#" className="text-gray-300 hover:text-white">
            <FaFacebookF />
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            <FaTwitter />
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            <FaInstagram />
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            <FaLinkedinIn />
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 mt-10 pt-6"></div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
            <ul className="space-y-3">
              {section.links.map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 mt-10 pt-6"></div>

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 gap-4 mt-6">
        <p>© {new Date().getFullYear()} GigMarket. All rights reserved.</p>
      </div>
    </footer>
  );
}
