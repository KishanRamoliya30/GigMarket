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