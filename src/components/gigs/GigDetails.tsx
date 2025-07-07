"use client";

import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
  Grid,
  Rating,
  Paper,
} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";
import { useRouter,useParams } from "next/navigation";
import { styled } from "@mui/system";
import { allGigs } from "./GigList";

const StyledWrapper = styled(Box)(({ theme }) => ({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: theme.spacing(2, 2, 2, 2),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4),
  },

  ".backBtn": {
    marginBottom: 2,
    textTransform: "none",
    fontWeight: 600,
    color: "#003322",
    "&:hover": {
      backgroundColor: "#E8F5E9",
    },
  },
  ".gigTitle": {
    fontWeight: 700,
    marginBottom: theme.spacing(2),
  },

  ".gigHeader": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  ".gigChip": {
    backgroundColor: "#E8F5E9",
    color: "#388E3C",
  },

  ".keywords": {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },

  ".providerCard": {
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1.5),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    position: "sticky",
    top: 100,
  },

  ".providerHeader": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },

  ".chipContainer": {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },

  ".bookBtn": {
    backgroundColor: "#003322",
    color: "#fff",
    textTransform: "none",
    fontWeight: 600,
    marginTop: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#004d33",
    },
  },
}));


export default function GigDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { gigId } = params; 
  const gig = allGigs.find((g) => g.id === gigId);
  if (!gig) {
    return <Typography variant="h6">Gig not found</Typography>;
  }
  return (
    <StyledWrapper>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.push("/gigs")}
        className="backBtn"
      >
        Back to Gigs
      </Button>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h4" className="gigTitle">
            {gig.title}
          </Typography>

          <Box className="gigHeader">
            <Chip label={gig.tier} className="gigChip" />
            <Typography variant="h6" fontWeight={600}>
              {gig.price}
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Rating
                value={gig.rating}
                precision={0.5}
                readOnly
                size="small"
              />
              <Typography variant="body2">({gig.reviews})</Typography>
            </Box>
          </Box>

          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Description
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {gig.description}
          </Typography>

          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Keywords
          </Typography>
          <Box className="keywords">
            {gig.keywords.map((word) => (
              <Chip key={word} label={word} size="small" className="gigChip" />
            ))}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={3} className="providerCard">
            <Box className="providerHeader">
              <Avatar
                src={gig.provider.avatar}
                alt={gig.provider.name}
                sx={{ width: 60, height: 60, cursor: "pointer" }}
                onClick={() =>
                  router.push("/profile/" + gig.provider.name.toLowerCase())
                }
              />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {gig.provider.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Rating
                    value={gig.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                  <Typography variant="body2">({gig.reviews})</Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Skills
              </Typography>
              <Box className="chipContainer">
                {gig.provider.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    size="small"
                    className="gigChip"
                  />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Certifications
              </Typography>
              <Box className="chipContainer">
                {gig.provider.certifications.map((cert) => (
                  <Chip
                    key={cert}
                    label={cert}
                    size="small"
                    className="gigChip"
                  />
                ))}
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              className="bookBtn"
              onClick={() => router.push("/chat")}
            >
              Contact / Book Now
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </StyledWrapper>
  );
}
