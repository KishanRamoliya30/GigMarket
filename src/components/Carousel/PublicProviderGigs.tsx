"use client";
import React from "react";
import CustomCarousel from "./CustomCarousel";
import { ArrowRight, Star } from "@mui/icons-material";
import Image from "next/image";
import { BsHeart } from "react-icons/bs";

type Freelancer = {
  userName: string;
  gigName: string;
  rating: number;
  image: string;
  category: string;
  reviews: number;
  price: number;
  featured?: boolean;
};

const GigCard = ({ item }: { item: Freelancer }) => {
  return (
    <div className="p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700 relative group">
        {/* Featured Badge */}
        {item.featured && (
          <span className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium px-3 py-1.5 rounded-full z-10 shadow-sm">
            Featured
          </span>
        )}

        {/* Save Icon */}
        <button className="absolute top-4 right-4 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-10 group">
          <BsHeart className="w-5 h-5 text-gray-500 dark:text-gray-300 group-hover:text-red-500 transition-colors" />
        </button>

        {/* Image Container with Overlay */}
        <div className="relative w-full h-48 xs:h-52 sm:h-56 md:h-64 lg:h-72 overflow-hidden group">
          <Image
            src={item.image}
            alt={item.userName}
            width={800}
            height={600}
            className="w-full h-full object-cover rounded-t-2xl transform group-hover:scale-110 transition-transform duration-500"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
              {item.category}
            </span>
          </div>

          <h3 className="font-bold text-gray-800 dark:text-gray-100 hover:cursor-pointer text-base sm:text-lg leading-snug line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            {item.gigName}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1.5 font-medium text-gray-700 dark:text-gray-300">
                {item.rating}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              ({item.reviews} Review
              {item.reviews > 1 ? "s" : ""})
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-3 sm:pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden ring-2 ring-emerald-500 ring-offset-2">
                  <Image
                    src={item.image}
                    alt={item.userName}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200">
                  {item.userName}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Starting at
                </p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">
                  ${item.price}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const dummyData: Freelancer[] = [
  {
    userName: "Agent Pakulla",
    gigName: "Web development, with HTML, CSS, JavaScript and PHP",
    rating: 4.5,
    image: "/providers/p4.jpg",
    category: "Development & IT",
    reviews: 2,
    price: 69,
    featured: true,
  },
  {
    userName: "John Powell",
    gigName: "Developers drop the framework folder into a new parent",
    rating: 4.5,
    image: "/providers/p2.jpg",
    category: "Design & Creative",
    reviews: 2,
    price: 128,
    featured: true,
  },
  {
    userName: "Thomas Powell",
    gigName: "Flexibility & Customization with CMS vs PHP Framework",
    rating: 5.0,
    image: "/providers/p6.jpg",
    category: "Development & IT",
    reviews: 1,
    price: 69,
  },
  {
    userName: "Ali Tufan",
    gigName: "PHP framework that you can use to create your own custom",
    rating: 4.0,
    image: "/providers/p3.jpg",
    category: "Design & Creative",
    reviews: 1,
    price: 158,
  },
];

export const ViewAllButton = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="text-sm font-semibold hover:underline flex items-center gap-1"
  >
    All Categories <ArrowRight className="w-4 h-4" />
  </button>
);

const PublicProviderGigs = () => {
  return (
    <div>
      <CustomCarousel
        data={dummyData}
        CardComponent={GigCard}
        ViewAllButtonComponent={ViewAllButton}
      />
    </div>
  );
};

export default PublicProviderGigs;
