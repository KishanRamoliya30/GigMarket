"use client";

import { Box, Typography} from "@mui/material";
import Image from "next/image";

const HeroLanding = () => {
  return (
    <>
      {/* Top Banner */}
      

      {/* Hero Section */}
      <Box sx={{ position: "relative", height: "100vh", width: "100%", overflow: "hidden", color: "#fff" }}>
        {/* Background Image */}
        <Image
          src="/Frame.png"
          alt="hero-bg"
          fill
          priority
          style={{ objectFit: "cover", zIndex: -2 }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: -1,
          }}
        />

        {/* Content */}
        <Box
          sx={{
            maxWidth: "800px",
            mx: "auto",
            px: 3,
            py: 10,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography variant="h3" fontWeight={700} mb={2}>
            In-Demand Skills,<br />On-Demand Courses
          </Typography>

          <Typography variant="h6" color="rgba(255,255,255,0.85)" mb={4}>
            Online professional courses, led by the world’s top experts.
          </Typography>



          {/* Popular Tags */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
            {["SEO", "Photoshop", "Freelancing", "eCommerce", "Social Media"].map((topic) => (
              <Box
                key={topic}
                sx={{
                  px: 2,
                  py: 0.8,
                  border: "1px solid rgba(255,255,255,0.4)",
                  borderRadius: "20px",
                  fontSize: "14px",
                  color: "#fff",
                }}
              >
                {topic}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default HeroLanding;
