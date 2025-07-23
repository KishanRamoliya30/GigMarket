"use client";

import Slider from "react-slick";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { freelancers } from "../../../utils/constants";
import { useRouter } from "next/navigation";

function PrevArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute z-10 -left-3 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-full shadow-md transition hidden sm:block"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}

function NextArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute z-10 -right-3 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-full shadow-md transition hidden sm:block"
    >
      <ArrowRight className="w-5 h-5" />
    </button>
  );
}

export default function TopProvidersSection() {
  const router = useRouter();
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
    <section className=" py-12 md:px-16 relative bg-green-50 dark:bg-transparent">
      <div className="flex flex-col justify-between mb-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-2 text-[#404145] font-bold text-center">
          Top Providers
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-center">
          Most viewed and all-time top-rated providers
        </p>
      </div>

      <Slider {...settings}>
        {freelancers.map((freelancer, index) => (
          <div key={index} className="px-2 py-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative group">
              <div className="relative h-80 sm:h-72">
                <Image
                  src={freelancer.image}
                  alt={freelancer.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6 relative z-10 ">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">
                      {freelancer.name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      {freelancer.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-900/90 px-3 py-1.5 rounded-full text-white text-sm font-medium">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>{freelancer.rating}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                    View Profile
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Star className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <button
        onClick={() => router.push("/providers")}
        className="cursor-pointer text-sm font-semibold mt-6 ml-auto mr-auto hover:underline flex items-center gap-1"
      >
        Browse All <ArrowRight className="w-4 h-4" />
      </button>
    </section>
  );
}
