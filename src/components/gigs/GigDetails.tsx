"use client";

import { Box, Typography, Chip, Button, Grid, Paper, Divider, Rating, Avatar, Skeleton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import { styled } from "@mui/system";
import { useUser } from "@/context/UserContext";
import { apiRequest } from "@/app/lib/apiCall";
import { useEffect, useState } from "react";
import { Gig } from "@/app/utils/interfaces";
import CustomTextField from "../customUi/CustomTextField";

export default function GigDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const isProvider = user?.role == "Provider";
  const { gigId } = params;
  const [gigDetails, setGigDetails] = useState<Gig|null>(null);
  const [showPlaceBid, setShowPlaceBid] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidComment, setBidComment] = useState("");
  const [loading,setLoading] = useState(true);

  const gig = {
    id: gigId,
    provider: {
      name: `Provider 1`,
      avatar: "/avatar1.png",
      skills: ["Adobe Illustrator", "Figma", "Creative Design"],
      certifications: ["Certified Graphic Designer"],
    },
    user: {
      name: `User 1`
    },
    keywords: ["logo", "branding", "startup", "vector"],
  };
  const gigDetail = async () => {
    const res = await apiRequest(`gigs/${gigId}`, {
      method: "GET",
    });
    if (res.ok) {
      setLoading(false);
      setGigDetails(res.data.data.gig);
    }
  };
  useEffect(() => {
    gigDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
console.log("test",isProvider)
  const minutesAgo = Math.floor(
    (new Date().getTime() - new Date(gigDetails?.createdAt ?? "").getTime()) /
      (1000 * 60)
  );
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);

  let timeToShow =
    daysAgo > 0
      ? daysAgo + " days ago"
      : hoursAgo + " hours ago";
  if (hoursAgo < 1) {
    timeToShow = minutesAgo + " minutes ago";
  }
  if (minutesAgo < 1) {
    timeToShow = "Just now";
  }

  function getSkeleton () {
    return (
      <Grid container spacing={4}>
      <Grid size={{xs:12,md:8}}>
        <Box display="flex" justifyContent="space-between">
          <Skeleton animation="wave"  width="60%" height={40} />
          <Skeleton animation="wave"  width={80} height={40} />
        </Box>

        <Box className="gigHeader" mt={2} display="flex" justifyContent="space-between">
          <Skeleton animation="wave"  variant="rectangular" width={80} height={32} />
          <Skeleton animation="wave"  width={120} height={20} />
        </Box>

        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Description
          </Typography>
          <Skeleton animation="wave"  variant="text" width="100%" height={20} />
          <Skeleton animation="wave"  variant="text" width="90%" height={20} />
          <Skeleton animation="wave"  variant="text" width="80%" height={20} />
        </Box>

        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Keywords
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {[...Array(4)].map((_, i) => (
              <Skeleton animation="wave"  key={i} variant="rectangular" width={60} height={30} />
            ))}
          </Box>
        </Box>

        <Box mt={4}>
          <Skeleton animation="wave"  variant="rectangular" width={140} height={40} />
        </Box>
      </Grid>

      <Grid size={{xs:12,md:4}}>
        <Paper elevation={3} className="providerCard" sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Skeleton animation="wave"  variant="circular" width={60} height={60} />
            <Box>
              <Skeleton animation="wave"  width={120} height={24} />
              <Skeleton animation="wave"  width={80} height={18} />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Skills
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {[...Array(3)].map((_, i) => (
                <Skeleton animation="wave"  key={i} variant="rectangular" width={70} height={30} />
              ))}
            </Box>
          </Box>

          <Box mt={2}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Certifications
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {[...Array(2)].map((_, i) => (
                <Skeleton animation="wave"  key={i} variant="rectangular" width={100} height={30} />
              ))}
            </Box>
          </Box>
        </Paper>
      </Grid>
      </Grid> 
    )
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
      {(loading || !gigDetails) ?
      getSkeleton()
    : 
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box display="flex" justifyContent={"space-between"}>
            <Typography variant="h5" className="gigTitle">
              {gigDetails.title}
            </Typography>
            <Typography variant="h5" fontWeight={600} mb={2}>
              $ {gigDetails.price}
            </Typography>
          </Box>

          <Box className="gigHeader">
            <Chip label={gigDetails.tier} className="gigChip" />
            <Typography variant="subtitle1" fontWeight={600}>
              Posted {timeToShow} • 2 bids
            </Typography>
            {/* <Box display="flex" alignItems="center" gap={0.5}>
              <Rating
                value={gigDetails.rating}
                precision={0.5}
                readOnly
                size="small"
              />
              <Typography variant="body2">({gigDetails.reviews})</Typography>
            </Box> */}
          </Box>

          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Description
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {gigDetails.description}
          </Typography>

          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Keywords
          </Typography>
          <Box className="keywords">
            {gigDetails.keywords.map((word: string) => (
              <Chip key={word} label={word} size="small" className="gigChip" />
            ))}
          </Box>
          {!showPlaceBid ? (
            <Button
              variant="contained"
              className="bookBtn"
              onClick={() => setShowPlaceBid(true)}
            >
              Place Bid
            </Button>
          ) : (
            <Box className="bidBox">
              <Typography variant="h6" fontWeight={600} mb={2}>
                Place Your Bid
              </Typography>

              <Box display="flex" gap={2} mb={2} alignItems={"center"}>
                <CustomTextField
                  placeholder="Enter your bid amount"
                  type="number"
                  slotProps={{ input: { startAdornment: "$" } }}
                  fullWidth={false}
                  isWithoutMargin
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
                <Typography variant="h6" fontWeight={600}>
                  / hour
                </Typography>
              </Box>
              <CustomTextField
                fullWidth
                multiline
                minRows={4}
                placeholder="Why are you the best fit for this gig?"
                className="bidComment"
                value={bidComment}
                onChange={(e) => setBidComment(e.target.value)}
              />

              <Button
                variant="contained"
                className="submitBtn"
                // onClick={handleBidSubmit}
              >
                Submit Bid
              </Button>
            </Box>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={3} className="providerCard">
            <Box className="providerHeader">
              <Avatar
                src={gigDetails.createdBy.profilePicture}
                alt={gigDetails.createdBy.fullName}
                sx={{ width: 60, height: 60, cursor: "pointer" }}
                onClick={() =>
                  router.push("/profile/" + gigDetails.createdBy.fullName.toLowerCase())
                }
              />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {gigDetails.createdBy.fullName}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Rating
                    value={gigDetails.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                  <Typography variant="body2">({gigDetails.reviews})</Typography>
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

            {/* <Button
              variant="contained"
              fullWidth
              className="bookBtn"
              onClick={() => router.push("/chat")}
            >
              Contact / Book Now
            </Button> */}
          </Paper>
        </Grid>
      </Grid>
}
    </StyledWrapper>
  );
}

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
  ".bidBox": {
    backgroundColor: "#f9f9f9",
    padding: theme.spacing(2),
    borderRadius: 12,
    marginBottom: theme.spacing(4),
    border: "1px solid #ccc",
  },

  ".toggleBtns": {
    display: "flex",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  ".bidBtn, .bidBtnActive": {
    flex: 1,
    textTransform: "none",
    fontWeight: 600,
    borderRadius: 8,
    borderColor: "#003322",
  },

  ".bidBtnActive": {
    backgroundColor: "#003322",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#004d33",
    },
  },

  ".submitBtn": {
    backgroundColor: "#003322",
    color: "#fff",
    fontWeight: 600,
    textTransform: "none",
    borderRadius: 8,
    "&:hover": {
      backgroundColor: "#004d33",
    },
  },
}));
