"use client";

import { Box, Typography, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Image from "next/image";
import PopularServicesSlider from "@/components/dashboard/PopularServiceSlider";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { categories, Trusted } from "../../../utils/constants";
import HeroLanding from "./HeroLanding";
import { apiRequest } from "@/app/lib/apiCall";

const Dashboard = () => {
  const [id, setId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const storedId = Cookies.get("id");
    setId(storedId);

    const fetchContent = async () => {
      try {
        const data = await apiRequest("switch-user"); 
      } catch (error) {
        console.error("Failed to load", error);
      }
    };

    fetchContent();
  }, []);
  return (
    <>
      {/* Hero Section */}
      {id ? (
        <HeroLanding />
      ) : (
        <Box
          sx={{
            position: "relative",
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            color: "#fff",
            overflow: "hidden",
          }}
        >
          <Image
            src={"/bg-hero1.webp"}
            alt="business"
            fill
            priority
            style={{ objectFit: "cover", zIndex: -1 }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              zIndex: -1,
            }}
          />
          {/* Hero Content */}
          <Box
            sx={{
              px: { xs: 3, sm: 4, md: 6 },
              py: { xs: 6, sm: 8 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
              maxWidth: "1400px",
              zIndex: 1,
            }}
          >
            <Typography
              variant="h3"
              fontWeight={600}
              mb={4}
              sx={{
                fontSize: { xs: "28px", sm: "36px", md: "48px" },
                maxWidth: "90%",
              }}
            >
              Find the perfect freelance services for your business{" "}
            </Typography>

            {/* Search bar */}
            {!id && (
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: "10px",
                  px: 2,
                  py: 0.5,
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: 700,
                  mb: 4,
                  boxShadow: 1,
                  position: "relative",
                  flexWrap: "nowrap",
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search for any service..."
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      pl: 1,
                      pr: 6,
                      fontSize: "16px",
                    },
                  }}
                />
                <Button
                  sx={{
                    borderRadius: "10px",
                    minWidth: "48px",
                    height: "40px",
                    position: "absolute",
                    right: 0,
                    top: 0,
                    color: "#fff",
                    backgroundColor: "#222325",
                    "&:hover": {
                      bgcolor: "#333",
                    },
                  }}
                >
                  <SearchIcon />
                </Button>
              </Box>
            )}
            {/* Categories */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                mb: 6,
              }}
            >
              {categories.map((label) => (
                <Button
                  key={label}
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    color: "#fff",
                    borderColor: "#fff",
                    borderRadius: "24px",
                    textTransform: "none",
                    px: 2,
                    py: 1,
                    fontSize: "14px",
                    mb: 2,
                    mr: 2,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "#fff",
                    },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
            {!id && (
              <Box
                mt={4}
                sx={{
                  position: "relative",
                  bottom: { xs: "unset", md: "-100px" },
                  left: { xs: "0", md: "0px" },
                  width: "100%",
                  maxWidth: "700px",
                }}
              >
                <Typography
                  variant="subtitle1"
                  color="rgba(255,255,255,0.7)"
                  mb={2}
                  sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                >
                  Trusted by:
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  {Trusted.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: { xs: 70, sm: 80 },
                        height: 40,
                        position: "relative",
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={`Trusted logo ${index + 1}`}
                        fill
                        style={{ objectFit: "fill" }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Popular Services Section */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: 6, bgcolor: "#fff" }}>
        <Typography
          variant="h4"
          fontWeight={600}
          mb={4}
          sx={{ fontSize: { xs: "28px", md: "36px" } }}
        >
          Popular services
        </Typography>
        <PopularServicesSlider />
      </Box>

      {/* Highlight Section */}
      {!id && (
        <Box sx={{ px: { xs: 2, md: 4 }, py: 6, bgcolor: "#fff" }}>
          <Box
            sx={{
              background: "#013914",
              borderRadius: "20px",
              color: "#fff",
              textAlign: "center",
              py: { xs: 6, md: 10 },
              px: 3,
              mt: 6,
              mb: 6,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "28px", md: "48px" },
                mb: 2,
                lineHeight: 1.3,
              }}
            >
              Freelance services at your
              <Box
                component="span"
                sx={{ color: "#b5b6ba", fontStyle: "italic" }}
              >
                fingertips
              </Box>
            </Typography>

            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 4,
                backgroundColor: "#1dbf73",
                color: "#fff",
                textTransform: "none",
                px: 5,
                py: 1.5,
                borderRadius: "12px",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#19a463",
                },
              }}
              href="/signup"
            >
              Join GigMarket
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Dashboard;
