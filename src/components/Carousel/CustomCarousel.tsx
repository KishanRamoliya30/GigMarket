"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";

interface CustomCarouselProps<T> {
  CardComponent: React.ComponentType<{ item: T }>;
  data: T[];
  heading?: string;
  subheading?: string;
  ViewAllButtonComponent?: React.ComponentType<{ onClick?: () => void }>;
  sectionClassName?: string;
}

function PrevArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute z-10 -left-3 top-1/2 transform -translate-y-1/2 bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-green-500 transition hidden sm:block"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}

function NextArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute z-10 -right-3 top-1/2 transform -translate-y-1/2 bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-green-500 transition hidden sm:block"
    >
      <ArrowRight className="w-5 h-5" />
    </button>
  );
}

const CustomCarousel = <T,>({
  CardComponent,
  data,
  heading,
  subheading,
  ViewAllButtonComponent,
  sectionClassName = "",
}: CustomCarouselProps<T>) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className={`px-4 py-12 md:px-16 relative ${sectionClassName}`}>
      <div className="flex flex-col justify-between items-center mb-4">
        {heading && (
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">{heading}</h2>
        )}
        {subheading && (
          <p className="text-gray-600 max-w-2xl mx-auto text-center">
            {subheading}
          </p>
        )}
      </div>

      <Slider {...settings}>
        {data.map((item, index) => (
          <div key={index} className="p-3 sm:p-4">
            <CardComponent item={item} />
          </div>
        ))}
      </Slider>

      {ViewAllButtonComponent && (
        <div className="flex justify-center mt-6">
          <ViewAllButtonComponent />
        </div>
      )}
    </section>
  );
};

export default CustomCarousel;
