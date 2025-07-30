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
export const getStatusColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-blue-100 text-blue-700"; // Client creates gig
    case "Requested":
      return "bg-indigo-100 text-indigo-700"; // Providers request
    case "Assigned":
      return "bg-purple-100 text-purple-700"; // Client selects one
    case "Not-Assigned":
      return "bg-gray-200 text-gray-700"; // Other providers not selected
    case "In-Progress":
      return "bg-yellow-100 text-yellow-700"; // Provider accepts
    case "Completed":
      return "bg-green-100 text-green-700"; // Provider submits work
    case "Approved":
      return "bg-teal-100 text-teal-700"; // Client approves
    case "Rejected":
      return "bg-red-100 text-red-700"; // Client rejects
    default:
      return "bg-gray-100 text-gray-600";
  }
};
export const getStatusDotColor = (status: string) => {
  switch (status) {
    case "Open":
      return "oklch(48.8% 0.243 264.376)";
    case "Requested":
      return "oklch(45.7% 0.24 277.023)"; 
    case "Assigned":
      return "oklch(49.6% 0.265 301.924)"; 
    case "Not-Assigned":
      return "oklch(37.3% 0.034 259.733)"; 
    case "In-Progress":
      return "oklch(0.554 0.135 66.442)"; 
    case "Completed":
      return "oklch(52.7% 0.154 150.069)"; 
    case "Approved":
      return "oklch(51.1% 0.096 186.391)"; 
    case "Rejected":
      return "oklch(50.5% 0.213 27.518)"; 
    default:
      return "oklch(44.6% 0.03 256.802)"; 
  }
};

export const TierList: ServiceTier[] = Object.values(ServiceTier);

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const tabs = [
  "All",
  "Open",
  "Requested",
  "Assigned",
  "Not-Assigned",
  "In Progress",
  "Completed",
  "Approved",
  "Rejected",
];

export const gigData = [
  {
    title: "React Developer for E-commerce Website",
    description:
      "Need an experienced React developer to build a modern e-commerce platform with payment integration and user authentication.",
    price: "$5,000",
    client: "John Smith",
    provider: "Sarah Wilson",
    date: "1/15/2024",
    status: "In Progress",
    progress: 75,
    history: [
      {
        status: "In Progress",
        from: "Requested",
        by: "John Smith",
        role: "client",
        timestamp: "Jan 17, 2024, 09:15 AM",
        note: "Proposal accepted. Looking forward to working together!",
      },
      {
        status: "Requested",
        from: "Open",
        by: "Sarah Wilson",
        role: "provider",
        timestamp: "Jan 16, 2024, 02:30 PM",
        note: "Submitted proposal with detailed timeline and portfolio",
      },
      {
        status: "Open",
        from: "",
        by: "John Smith",
        role: "client",
        timestamp: "Jan 15, 2024, 10:00 AM",
        note: "Initial gig posting",
      },
    ],
  },
  {
    title: "Logo Design for Tech Startup",
    description: "Design a modern logo for a new AI-based tech company.",
    price: "$700",
    client: "Emily Clark",
    provider: "David Ray",
    date: "2/20/2024",
    status: "Completed",
    progress: 100,
    history: [],
  },
  {
    title: "Landing Page Redesign",
    description: "Revamp an outdated landing page with modern design trends.",
    price: "$1,200",
    client: "Mike Taylor",
    provider: "Sarah Wilson",
    date: "3/5/2024",
    status: "Rejected",
    progress: 0,
    history: [],
  },
];

type Freelancer = {
  name: string;
  role: string;
  rating: number;
  image: string;
};

export const freelancers: Freelancer[] = [
  {
    name: "Tom Wilson",
    role: "Marketing Manager",
    rating: 4.5,
    image: "/providers/p1.jpg",
  },
  {
    name: "Robert Fox",
    role: "Nursing Assistant",
    rating: 4.5,
    image: "/providers/p2.jpg",
  },
  {
    name: "Ali Tufan",
    role: "UI/UX Designer",
    rating: 4.5,
    image: "/providers/p3.jpg",
  },
  {
    name: "Agent Pakulla",
    role: "Nursing Assistant",
    rating: 4.0,
    image: "/providers/p4.jpg",
  },
  {
    name: "Sarah Johnson",
    role: "Content Writer",
    rating: 4.8,
    image: "/providers/p5.jpg",
  },
  {
    name: "Michael Chen",
    role: "Full Stack Developer",
    rating: 4.7,
    image: "/providers/p6.jpg",
  },
  {
    name: "Emma Davis",
    role: "Graphic Designer",
    rating: 4.6,
    image: "/providers/p4.jpg",
  },
  {
    name: "Michael Chen",
    role: "Full Stack Developer",
    rating: 4.7,
    image: "/providers/p6.jpg",
  },
  {
    name: "Emma Davis",
    role: "Graphic Designer",
    rating: 4.6,
    image: "/providers/p5.jpg",
  },
  {
    name: "Emma Davis",
    role: "Graphic Designer",
    rating: 4.6,
    image: "/providers/p4.jpg",
  },
  {
    name: "Emma Davis",
    role: "Graphic Designer",
    rating: 4.6,
    image: "/providers/p1.jpg",
  },
  {
    name: "Emma Davis",
    role: "Graphic Designer",
    rating: 4.6,
    image: "/providers/p2.jpg",
  },
  {
    name: "Emma Davis",
    role: "Graphic Designer",
    rating: 4.6,
    image: "/providers/p3.jpg",
  },
  {
    name: "Emma Davis",
    role: "Graphic Designer",
    rating: 4.6,
    image: "/providers/p4.jpg",
  },
  {
    name: "Sarah Johnson",
    role: "Content Writer",
    rating: 4.8,
    image: "/providers/p5.jpg",
  },
  {
    name: "Michael Chen",
    role: "Full Stack Developer",
    rating: 4.7,
    image: "/providers/p6.jpg",
  },
];