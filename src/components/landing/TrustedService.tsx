"use client";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EmailIcon from "@mui/icons-material/Email";
import ArticleIcon from "@mui/icons-material/Article";
import BrushIcon from "@mui/icons-material/Brush";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const services = [
  {
    title: "3D Industrial Design",
    icon: <DesignServicesIcon fontSize="large" className="text-green-700" />,
  },
  {
    title: "E-commerce Website Development",
    icon: <ShoppingCartIcon fontSize="large" className="text-green-700" />,
  },
  {
    title: "Email Marketing",
    icon: <EmailIcon fontSize="large" className="text-green-700" />,
  },
  {
    title: "Press Releases",
    icon: <ArticleIcon fontSize="large" className="text-green-700" />,
  },
  {
    title: "Logo Design",
    icon: <BrushIcon fontSize="large" className="text-green-700" />,
  },
];

const TrustedServices = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);
  
  return (
    <section className="py-16 px-4 md:px-10 bg-white">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-10">
        Vontélle’s trusted services
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            data-aos="fade-up"
            className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm transition-transform duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
          >
            <div className="mb-4">{service.icon}</div>
            <p className="text-center font-semibold text-gray-900">
              {service.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustedServices;
