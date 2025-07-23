"use client";
import {
  Briefcase,
  CheckCircle,
  ListChecks,
  Package,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const serviceTiers = [
  {
    title: "Tier 1",
    label: "Basic Tasks",
    icon: Package,
    description: "Laundry, delivery, and other simple services",
    price: "Starting at $10",
    examples: [
      "Campus delivery",
      "Laundry pickup",
      "Basic errands",
      "Simple tasks",
    ],
    tags: [
      "Campus delivery",
      "Laundry pickup",
      "Basic errands",
      "Simple tasks",
    ],
    image: "/tier1.jpg",
  },
  {
    title: "Tier 2",
    label: "Skilled Tasks",
    icon: ShoppingCart,
    description: "Tasks requiring moderate skills like tutoring or tech help",
    price: "Starting at $20",
    examples: ["Tutoring", "Tech support", "Event setup", "Presentation help"],
    tags: ["Tutoring", "Tech support", "Event setup", "Presentation help"],
    image: "/tier2.jpg",
  },
  {
    title: "Tier 3",
    label: "Expert Tasks",
    description:
      "Specialized services requiring advanced knowledge or certifications",
    price: "Starting at $40",
    icon: Briefcase,
    examples: [
      "Photography",
      "Video editing",
      "Software development",
      "Resume review",
    ],
    tags: [
      "Photography",
      "Video editing",
      "Software development",
      "Resume review",
    ],
    image: "/tier3.jpg",
  },
];

export default function ServiceTiers() {
  const [selectedTier, setSelectedTier] = useState(0);
  const tier = serviceTiers[selectedTier];

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col justify-between text-center mb-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-2 text-[#404145] font-bold">
          Service Tiers Explained
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our tiered system ensures quality and fair pricing based on skill and
          service complexity.
        </p>
      </div>

      {/* Tier Tabs */}
<div className="flex justify-center gap-4 mb-4">
  {serviceTiers.map((tierItem, idx) => (
    <button
      key={tierItem.title}
      onClick={() => setSelectedTier(idx)}
      className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm
        ${
          selectedTier === idx
            ? "bg-emerald-600 text-white shadow-md"
            : "bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-700 hover:shadow"
        }`}
    >
      {tierItem.title}
    </button>
  ))}
</div>


   {/* Tags */}
<div className="flex flex-wrap justify-center gap-2 mb-4">
  {tier.tags.map((tag, idx) => (
    <span
      key={idx}
      className="bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full shadow hover:bg-emerald-200 hover:scale-105 transition-transform duration-200"
    >
      {tag}
    </span>
  ))}
</div>

{/* Tier Card */}
<div className="rounded-3xl bg-white border border-gray-100 p-4 sm:p-6 flex flex-col md:flex-row items-center gap-4 sm:gap-8 shadow-md hover:shadow-lg transition-shadow duration-300">
  <Image
    src={tier.image}
    alt={tier.title}
    width={500}
    height={300}
    className="w-full md:w-1/2 h-[260px] sm:h-[310px] lg:h-[360px] object-cover rounded-2xl hover:scale-[1.015] transition-transform duration-300"
  />
  <div className="flex-1 space-y-4 sm:space-y-3 bg-gray-50 p-6 rounded-2xl shadow-inner hover:scale-[1.01] transition-transform duration-300">
    {/* Header */}
    <div className="space-y-2">
      <div className="flex items-center gap-2 sm:gap-3">
        <tier.icon className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
        <h3 className="text-xl sm:text-2xl font-bold text-emerald-600 bg-clip-text ">
          {tier.title}
        </h3>
      </div>
      <h4 className="text-lg sm:text-xl font-semibold text-gray-700 pl-3">
        {tier.label}
      </h4>
    </div>

    {/* Description */}
    <div className="pl-3">
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        {tier.description}
      </p>
    </div>

    {/* Examples */}
    <div className="pl-3 space-y-2 sm:space-y-3">
      <div className="flex items-center gap-2">
        <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
        <span className="font-medium text-gray-800 text-sm sm:text-base">
          Examples:
        </span>
      </div>
      <ul className="space-y-1.5 sm:space-y-2 pl-5 sm:pl-7">
        {tier.examples.map((ex, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="text-sm sm:text-base text-gray-700">
              {ex}
            </span>
          </li>
        ))}
      </ul>
    </div>

    {/* Price */}
    <div className="pl-7 sm:pl-9 flex items-center gap-2">
      <p className="text-base sm:text-lg font-semibold text-emerald-600">
        {tier.price}
      </p>
    </div>
  </div>
</div>

    </section>
  );
}
