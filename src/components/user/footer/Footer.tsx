"use client";

import {
  Box,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";

const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "#f7f7f7",
  padding: "40px 24px 20px",
  color: "#444",

  "& .footerGrid": {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "24px",
    marginBottom: "30px",

    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  "& .footerCol h4": {
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "12px",
  },

  "& .footerCol p": {
    fontSize: "14px",
    marginBottom: "8px",
    cursor: "pointer",
    transition: "0.3s",
    "&:hover": {
      color: "#1dbf73",
    },
  },

  "& .footerAccordion": {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },

  "& .footerBottom": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    paddingTop: "20px",
    borderTop: "1px solid #ddd",
  },

  "& .socialIcons": {
    display: "flex",
    gap: "10px",
  },
}));

const sections = [
  {
    title: "About",
    links: ["Careers", "Press & News", "Partnerships", "Privacy Policy", "Terms of Service"],
  },
  {
    title: "Categories",
    links: ["Graphics & Design", "Digital Marketing", "Writing & Translation", "Video & Animation", "Programming & Tech"],
  },
  {
    title: "Support",
    links: ["Help & Support", "Trust & Safety", "Selling on GigMarket", "Buying on GigMarket"],
  },
  {
    title: "Community",
    links: ["Events", "Forum", "Blog", "Influencers", "Affiliates"],
  },
  {
    title: "More From GigMarket",
    links: ["GigMarket Pro", "GigMarket Studios", "Logo Maker", "Learn", "Mobile App"],
  },
];

export default function Footer() {
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <FooterWrapper>
      <Box className="footerGrid">
        {sections.map((section, idx) => (
          <Box key={idx} className="footerCol">
            <Typography variant="h4">{section.title}</Typography>
            {section.links.map((link, i) => (
              <Typography key={i}>{link}</Typography>
            ))}
          </Box>
        ))}
      </Box>

      <Box className="footerAccordion">
        {sections.map((section, idx) => (
          <Accordion key={idx}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>{section.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {section.links.map((link, i) => (
                <Typography key={i} sx={{ mb: 1 }}>
                  {link}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Box className="footerBottom">
        <Typography variant="body2">
          © {new Date().getFullYear()} GigMarket. All rights reserved.
        </Typography>
        <Box className="socialIcons">
          <IconButton size="small"><FacebookIcon fontSize="small" /></IconButton>
          <IconButton size="small"><TwitterIcon fontSize="small" /></IconButton>
          <IconButton size="small"><InstagramIcon fontSize="small" /></IconButton>
          <IconButton size="small"><LinkedInIcon fontSize="small" /></IconButton>
          <IconButton size="small"><YouTubeIcon fontSize="small" /></IconButton>
        </Box>
      </Box>
    </FooterWrapper>
  );
}
