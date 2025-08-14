"use client";

import {
  WorkOutline,
  PersonOutline,
  CreditCardOutlined,
  HeadsetMicOutlined,
} from "@mui/icons-material";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const FreelancerBenefits = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const features = [
    {
      icon: <WorkOutline className="text-green-900 text-4xl" />,
      title: "Post a job",
      desc: "It’s free and easy to post a job. Simply fill in a title, description.",
    },
    {
      icon: <PersonOutline className="text-green-900 text-4xl" />,
      title: "Choose freelancers",
      desc: "It’s free and easy to post a job. Simply fill in a title, description.",
    },
    {
      icon: <CreditCardOutlined className="text-green-900 text-4xl" />,
      title: "Pay safely",
      desc: "It’s free and easy to post a job. Simply fill in a title, description.",
    },
    {
      icon: <HeadsetMicOutlined className="text-green-900 text-4xl" />,
      title: "We’re here to help",
      desc: "It’s free and easy to post a job. Simply fill in a title, description.",
    },
  ];

  return (
    <div className="bg-green-900 ">
    <section className="bg-white py-16 px-10 text-center rounded-t-[5rem] mb-10">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        Need something done?
      </h2>
      <p className="text-gray-600 mb-20">
        Most viewed and all-time top-selling services
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center"
            data-aos="fade-up"
            data-aos-delay={index * 150}
          >
            <div className="mb-4 w-20">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {feature.title}
      </h3>
      <p className="text-base text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
};

export default FreelancerBenefits;
