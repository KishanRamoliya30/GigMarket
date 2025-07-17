export const Trusted = [
  { image: "/trusted1.png" },
  { image: "/trusted2.png" },
  { image: "/trusted3.png" },
  { image: "/trusted4.png" },
  { image: "/trusted5.png" },
];
export const categories = [
  "website development",
  "architecture & interior design",
  "UGC videos",
  "video editing",
];
export const portfolioItems = [
  {
    id: 1,
    title: "Ember Esport Logo",
    subtitle: "gefenbd",
    image: "/service2.jpeg",
  },
  {
    id: 2,
    title: "Packaging & Label Design",
    subtitle: "gefenbd",
    image: "/service3.jpeg",
  },
  {
    id: 3,
    title: "Luxury Interior Design",
     subtitle: "gefenbd",
    image: "/service4.jpeg",
  },
  {
    id: 4,
    title: "Lucas Dourado Branding",
     subtitle: "gefenbd",
    image: "/service5.jpeg",
  },
  {
    id: 5,
    title: "Poolside Architecture",
     subtitle: "gefenbd",
    image: "/service6.jpeg",
  },
  {
    id: 6,
    title: "Tattoo Art Illustration",
     subtitle: "gefenbd",
    image: "/service7.jpeg",
  },
  {
    id: 7,
    title: "Anime Style Portrait",
     subtitle: "gefenbd",
    image: "/service2.jpeg",
  },
  {
    id: 8,
    title: "Modern Living Room",
     subtitle: "gefenbd",
    image: "/service8.jpeg",
  },
];
  export const popularServicesData = [
    { name: "Ai Artists", label: "Add talent to AI", image: "/service1.png" },
    { name: "Logo Design", label: "Build your brand", image: "/service2.jpeg" },
    {
      name: "Wordpress",
      label: "Customize your site",
      image: "/service3.jpeg",
    },
    {
      name: "Voice Over",
      label: "Share your message",
      image: "/service4.jpeg",
    },
    {
      name: "Social Media",
      label: "Reach more customers",
      image: "/service5.jpeg",
    },
    { name: "SEO", label: "Unlock growth online", image: "/service6.jpeg" },
    {
      name: "Illustration",
      label: "Color your dreams",
      image: "/service7.jpeg",
    },
    { name: "Translation", label: "Go global", image: "/service8.jpeg" },
  ];
 export const everythingData = [
    {
      title: "Stick to your budget",
      subtitle:
        "Find the right service for every price point. No hourly rates, just project-based pricing.",
    },
    {
      title: "Get quality work done quickly",
      subtitle:
        "Hand your project over to a talented freelancer in minutes, get long-lasting results.",
    },
    {
      title: "Pay when you're happy",
      subtitle:
        "Upfront quotes mean no surprises. Payments only get released when you approve.",
    },
    {
      title: "Count on 24/7 support",
      subtitle:
        "Our round-the-clock support team is available to help anytime, anywhere.",
    },
  ];
export const Categories = [
  { name: "Graphic Design", logo: "/service-1.svg" },
  { name: "Digital Marketing", logo: "/service-2.svg" },
  { name: "Writing & Translation", logo: "/service-3.svg" },
  { name: "Video & Animation", logo: "/service-4.svg" },
  { name: "Music & Audio", logo: "/service-5.svg" },
  { name: "Programming & Tech", logo: "/service-6.svg" },
  { name: "Business", logo: "/service-7.svg" },
  { name: "Lifestyle", logo: "/service-8.svg" },
  { name: "Data", logo: "/service-9.svg" },
  { name: "Photography", logo: "/service-10.svg" },
];

export const services = [
  { name: "Ai Artists", label: "Add talent to AI", image: "/service1.png" },
  { name: "Logo Design", label: "Build your brand", image: "/service2.jpeg" },
  {
    name: "Wordpress",
    label: "Customize your site",
    image: "/service3.jpeg",
  },
  {
    name: "Voice Over",
    label: "Share your message",
    image: "/service4.jpeg",
  },
  {
    name: "Social Media",
    label: "Reach more customers",
    image: "/service5.jpeg",
  },
  { name: "SEO", label: "Unlock growth online", image: "/service6.jpeg" },
  {
    name: "Illustration",
    label: "Color your dreams",
    image: "/service7.jpeg",
  },
  { name: "Translation", label: "Go global", image: "/service8.jpeg" },
];

export const expiryTime = 60 * 60 * 24 * 7 ; // 7 days
export const profileData = {
  fullName: "Jane Doe",
  profilePicture: "https://i.pravatar.cc/150?img=47",
  professionalSummary:
    "A highly motivated computer science graduate with a passion for AI and startups. Experienced in building web applications with React and Node.js.",
  extracurricularActivities:
    "Volunteer at WomenWhoCode, Hackathon Winner 2023, Soccer Team Captain.",
  interests: ["Startups", "AI", "Mentoring"],
  certifications: [
    { name: "AWS Certified Developer.pdf" },
    { name: "Google UX Certificate.pdf" },
  ],
  skills: ["React", "Node.js", "TypeScript", "GraphQL"],
  currentSchool: "MIT",
  degreeType: "Bachelor’s",
  major: "Computer Science",
  minor: "Mathematics",
  graduationYear: "2025",
  pastEducation: [
    {
      school: "High School ABC",
      degree: "High School Diploma",
      year: "2021",
    },
  ],
};


// constants/enums.ts

export enum ServiceTier {
  BASIC = "Basic",
  ADVANCED = "Advanced",
  EXPERT = "Expert",
}

export const TierDescriptions: Record<ServiceTier, string> = {
  [ServiceTier.BASIC]: "Menial tasks - laundry, food pick up, move in/out, etc.",
  [ServiceTier.ADVANCED]: "Advice - classes, major/minor, grad school, recruiting, etc.",
  [ServiceTier.EXPERT]: "Hands-on - tutoring, homework help, schedule design, interview prep, etc.",
};

export const getTierDescription = (tier: ServiceTier): string => {
  return TierDescriptions[tier];
};

export const TierList: ServiceTier[] = Object.values(ServiceTier);

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};