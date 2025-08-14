"use client";
import React, { ReactNode } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CustomCarouselProps<T> {
  CardComponent: React.ComponentType<{ item: T }>;
  data: T[];
  heading?: string;
  subheading?: string;
  ViewAllButtonComponent?: () => ReactNode;
  sectionClassName?: string;
  total?: number | string;
}

function PrevArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute z-10 -left-3 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-full shadow-md  hover:scale-110 hover:shadow-lg cursor-pointer transition-all duration-300 ease-in-out sm:block"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}

function NextArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute z-10 -right-3 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:scale-110 hover:shadow-lg transition-all duration-300 ease-in-out block"
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
  total,
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

  if (!data?.length) {
    return null;
  }

  return (
    <section className={`relative ${sectionClassName}`}>
      <div className="flex flex-col justify-between items-center mb-1">
        {heading && (
          <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-2 text-[#404145] font-bold text-center">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-2">
            {subheading}
          </p>
        )}
      </div>

      {data.length <= 3 ? (
        <div>
          <div className="flex flex-row justify-center items-center flex-wrap">
            {data.map((obj, i) => (
              <div key={i} className="p-2 sm:p-3 w-[340px]">
                <CardComponent item={obj} />
              </div>
            ))}
          </div>
          {total && (
            <div className="absolute bottom-8 right-4 md:right-16 bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-gray-700">
                Total: {total}
              </span>
            </div>
          )}
        </div>
      ) : (
        <>
          <Slider {...settings}>
            {data.map((item, index) => (
              <div key={index} className="p-2 sm:p-3">
                <CardComponent item={item} />
              </div>
            ))}
          </Slider>

          {ViewAllButtonComponent && (
            <div className="flex justify-center mt-6">
              {ViewAllButtonComponent()}
            </div>
          )}
          {total && (
            <div className="absolute bottom-12 right-4 md:right-16 bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-gray-700">
                Total: {total}
              </span>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default CustomCarousel;
