"use client";

import {
  AppsOutlined,
  LoopOutlined,
  FlashOnOutlined,
  EmojiEmotionsOutlined,
  AttachMoneyOutlined,
} from "@mui/icons-material";
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const FreelancerBenefits = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);
  const router = useRouter();
  const features = [
    {
      icon: <AppsOutlined className="text-gray-700 text-4xl" />,
      title: "Access a pool of top talent",
      desc: "across 700 categories",
    },
    {
      icon: <LoopOutlined className="text-gray-700 text-4xl" />,
      title: "Enjoy a simple, easy-to-use",
      desc: "matching experience",
    },
    {
      icon: <FlashOnOutlined className="text-gray-700 text-4xl" />,
      title: "Get quality work done quickly",
      desc: "and within budget",
    },
    {
      icon: (
        <div className="flex items-center gap-1">
          <EmojiEmotionsOutlined className="text-gray-700 text-3xl" />
          <AttachMoneyOutlined className="text-gray-700 text-3xl -ml-1" />
        </div>
      ),
      title: "Only pay when you’re happy",
      desc: "",
    },
  ];

  return (
    <section className="text-center  py-12 md:px-16 px-4 bg-white">
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-12 mx-auto">
        Make it all happen with freelancers
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
            data-aos="fade-right"
            data-aos-delay={index * 150}
          >
            <div className="mb-4">{feature.icon}</div>
            <p className="text-gray-800 font-semibold text-base">
              {feature.title}
            </p>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>

      <button
        className="mt-12 bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition cursor-pointer"
        onClick={() => router.push("/signup")}
      >
        Join now
      </button>
    </section>
  );
};

export default FreelancerBenefits;
