/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  Box,
  Typography,
  Chip,
  Button,
  Grid,
  Paper,
  Divider,
  Rating,
  Avatar,
  Skeleton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,

} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import { styled } from "@mui/system";
import { useUser } from "@/context/UserContext";
import { apiRequest } from "@/app/lib/apiCall";
import { useEffect, useState } from "react";
import { Gig, Bid } from "@/app/utils/interfaces";
import { usePathname } from "next/navigation";
import CustomTextField from "../customUi/CustomTextField";
import { ExpandMoreOutlined, Check as CheckIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
export default function GigDetailPage(props?: { self?: boolean }) {
  const isSelf = props?.self ?? false;
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { user, setRedirectUrl } = useUser();
  const { gigId } = params;
  const [gigDetails, setGigDetails] = useState<Gig | null>(null);
  const [gigBids, setGigBids] = useState<Bid[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 3,
    totalPages: 0,
  });
  const [page, setPage] = useState(1);
  const [showPlaceBid, setShowPlaceBid] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidComment, setBidComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState({ bidAmount: "", bidComment: "" });
  const [expandedBidIds, setExpandedBidIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Recently Added");
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [openMenu, setOpenMenu] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");
  const gig = {
    id: gigId,
    provider: {
      name: `Provider 1`,
      avatar: "/avatar1.png",
      skills: ["Adobe Illustrator", "Figma", "Creative Design"],
      certifications: ["Certified Graphic Designer"],
    },
    user: {
      name: `User 1`,
    },
    keywords: ["logo", "branding", "startup", "vector"],
  };
  const gigDetail = async () => {
    const apiPath = isSelf ? `mygigs/${gigId}` : `gigs/${gigId}`;
    const res = await apiRequest(apiPath, {
      method: "GET",
    });
    if (res.ok) {
      setLoading(false);
      setGigDetails(res.data.data);
    }
  };

  const getGigBids = async () => {
    const res = await apiRequest(
      `mygigs/${gigId}/bids?page=${page}&limit=${pagination.limit}`,
      {
        method: "GET",
      }
    );
    if (res.ok) {
      // setLoading(false);
      setPagination(res.data.pagination);
      setGigBids(res.data.data);
    }
  };

  const updateBidStatus = async (bidId: string, status: "approved" | "rejected") => {
    return await apiRequest(`mygigs/${gigId}/bids/${bidId}/status`, {
      method: "PUT",
      data: { status },
    });
  };

  const handleBidStatusChange = async (bidId: string, status: "approved" | "rejected") => {
    try {
      const res = await updateBidStatus(bidId, status);
  
      if (res.ok) {
        toast.success(`Bid ${status} successfully`);
        getGigBids();
      } else {
        toast.error(res?.data?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Error while updating bid status");
      console.error(err);
    }
  };
  useEffect(() => {
    gigDetail();
  }, []);

  useEffect(() => {
    if (isSelf) getGigBids();
  }, [page]);

  useEffect(() => {
    setError((prev) => ({
      ...prev,
      bidAmount: "",
    }));
  }, [bidAmount]);

  useEffect(() => {
    setError((prev) => ({
      ...prev,
      bidComment: "",
    }));
  }, [bidComment]);

  const minutesAgo = Math.floor(
    (new Date().getTime() - new Date(gigDetails?.createdAt ?? "").getTime()) /
      (1000 * 60)
  );
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);

  let timeToShow =
    daysAgo > 0 ? daysAgo + " days ago" : hoursAgo + " hours ago";
  if (hoursAgo < 1) {
    timeToShow = minutesAgo + " minutes ago";
  }
  if (minutesAgo < 1) {
    timeToShow = "Just now";
  }

  function getSkeleton() {
    return (
      <Grid container spacing={4}>
        <Grid size={isSelf?{ xs: 12}:{ xs: 12, md: 8 }}>
          <Box display="flex" justifyContent="space-between">
            <Skeleton animation="wave" width="60%" height={40} />
            <Skeleton animation="wave" width={80} height={40} />
          </Box>

          <Box
            className="gigHeader"
            mt={2}
            display="flex"
            justifyContent="space-between"
          >
            <Skeleton
              animation="wave"
              variant="rectangular"
              width={80}
              height={32}
            />
            <Skeleton animation="wave" width={120} height={20} />
          </Box>

          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Description
            </Typography>
            <Skeleton
              animation="wave"
              variant="text"
              width="100%"
              height={20}
            />
            <Skeleton animation="wave" variant="text" width="90%" height={20} />
            <Skeleton animation="wave" variant="text" width="80%" height={20} />
          </Box>

          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Keywords
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  animation="wave"
                  key={i}
                  variant="rectangular"
                  width={60}
                  height={30}
                />
              ))}
            </Box>
          </Box>

          <Box mt={4}>
            <Skeleton
              animation="wave"
              variant="rectangular"
              width={140}
              height={40}
            />
          </Box>
        </Grid>

        {!isSelf && (
          <Grid size={{ xs: 12, md: 12 }}>
            <Paper elevation={3} className="providerCard" sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={60}
                  height={60}
                />
                <Box>
                  <Skeleton animation="wave" width={120} height={24} />
                  <Skeleton animation="wave" width={80} height={18} />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Skills
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {[...Array(3)].map((_, i) => (
                    <Skeleton
                      animation="wave"
                      key={i}
                      variant="rectangular"
                      width={70}
                      height={30}
                    />
                  ))}
                </Box>
              </Box>

              <Box mt={2}>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Certifications
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {[...Array(2)].map((_, i) => (
                    <Skeleton
                      animation="wave"
                      key={i}
                      variant="rectangular"
                      width={100}
                      height={30}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    );
  }

  function showPlacedBid() {
    return (
      <Box className="bidBox">
        <Box
          display="flex"
          gap={2}
          mb={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="h6" fontWeight={600}>
            Your Bid
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            $ {gigDetails?.bid?.bidAmount} / hour
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {gigDetails?.bid?.description}
        </Typography>
      </Box>
    );
  }

  function getBidBox() {
    return gigDetails?.bid ? (
      showPlacedBid()
    ) : !showPlaceBid ? (
      <Button variant="contained" className="bookBtn" onClick={placebid}>
        Place Bid
      </Button>
    ) : (
      <Box className="bidBox">
        <Typography variant="h6" fontWeight={600} mb={2}>
          Place Your Bid
        </Typography>

        <Box display="flex" gap={2} mb={2}>
          <CustomTextField
            placeholder="Enter your bid amount"
            type="number"
            slotProps={{ input: { startAdornment: "$" } }}
            fullWidth={false}
            isWithoutMargin
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            disabled={submitting}
            error={error.bidAmount !== ""}
            helperText={error.bidAmount}
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
          disabled={submitting}
          error={error.bidComment !== ""}
          helperText={error.bidComment}
        />

        <Button
          variant="contained"
          className="submitBtn"
          onClick={handleBidSubmit}
        >
          Submit Bid
        </Button>
      </Box>
    );
  }

  function placebid() {
    if ((user?._id ?? "") === "") {
      setRedirectUrl(pathname);
      router.push("/login");
      return;
    }
    setShowPlaceBid(true);
  }

  function handleBidSubmit() {
    let hasError = false;
    const bidError = {
      bidAmount: "",
      bidComment: "",
    };
    if (!bidAmount) {
      hasError = true;
      bidError.bidAmount = "Bid amount is required";
    } else if (isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
      bidError.bidAmount = "Invalid Amount";
    }
    if (!bidComment) {
      hasError = true;
      bidError.bidComment = "Bid Comment is required";
    }

    if (hasError) {
      setError(bidError);
      return;
    }
    const data = {
      gigId: gigId,
      bidAmount: Number(bidAmount),
      description: bidComment,
    };
    setSubmitting(true);

    apiRequest(`gigs/${gigId}/placeBid`, {
      method: "POST",
      data: data,
    }).then((res) => {
      setSubmitting(false);
      if (res.ok) {
        const bid = res.data.data as Bid;
        if (gigDetails) setGigDetails({ ...gigDetails, bid: bid });
      } else {
        setError({ ...error, bidComment: res.message ?? "Error placing bid" });
      }
    });
  }

  function getAllBids() {
    const loadingMore = false;

    const handleExpand = (id: string) => {
      setExpandedBidIds((prev) =>
        prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
      );
    };
    const handleSortClose = () => {
      setSortAnchorEl(null);
    };
    const handleSortSelect = (option: string) => {
      setSortBy(option);
      handleSortClose();
    };
    const handleSortClick = (event: React.MouseEvent<HTMLDivElement>) => {
      setSortAnchorEl(event.currentTarget);
    };

    const sortOptions = [
      "Pricing: High to Low",
      "Pricing: Low to High",
      "Rating: High to Low",
      "Rating: Low to High",
      "Recently Added",
    ];
    const handleOpenMenu = (
      event: React.MouseEvent<HTMLButtonElement>,
      menuType: string
    ) => {
      setAnchorEl(event.currentTarget);
      setOpenMenu(menuType);
    };
    const handleCloseMenu = () => {
      setAnchorEl(null);
      setOpenMenu("");
    };
    return (
      <Box>
        <Typography variant="h6" fontWeight={600} mb={2}>
          All Bids
        </Typography>

        <Menu
          anchorEl={anchorEl}
          open={openMenu === "rating"}
          onClose={handleCloseMenu}
        >
          <Box px={2} py={1} width={250}>
            <Typography fontWeight={600} mb={1}>
              Select Rating
            </Typography>
            <RadioGroup
              value={selectedRating}
              onChange={(e) => {
                setSelectedRating(e.target.value);
              }}
            >
              {["5⭐", "4⭐ and above", "3⭐ and above", "2⭐ and above"].map(
                (opt) => (
                  <FormControlLabel
                    key={opt}
                    value={opt}
                    control={
                      <Radio
                        sx={{
                          color: "#388E3C",
                          "&.Mui-checked": {
                            color: "#388E3C",
                          },
                        }}
                      />
                    }
                    label={opt}
                    sx={{
                      ".MuiTypography-root": {
                        fontWeight: 500,
                        color: "#333",
                      },
                    }}
                  />
                )
              )}
            </RadioGroup>
          </Box>
        </Menu>

        <Menu
          anchorEl={anchorEl}
          open={openMenu === "budget"}
          onClose={handleCloseMenu}
        >
          <Box px={2} py={1} width={250}>
            <Typography fontWeight={600} mb={1} color="#333">
              Select Budget
            </Typography>
            <RadioGroup
              value={selectedBudget}
              onChange={(e) => {
                setSelectedBudget(e.target.value);
                setCustomMin("");
                setCustomMax("");
              }}
            >
              {[
                "Under ₹2,252",
                "₹2,252–₹5,404",
                "₹5,404 & Above",
                "custom",
              ].map((opt) => (
                <FormControlLabel
                  key={opt}
                  value={opt}
                  control={
                    <Radio
                      sx={{
                        color: "#388E3C",
                        "&.Mui-checked": {
                          color: "#388E3C",
                        },
                      }}
                    />
                  }
                  label={opt === "custom" ? "Custom" : opt}
                  sx={{
                    ".MuiTypography-root": {
                      fontWeight: 500,
                      color: "#333",
                    },
                  }}
                />
              ))}
            </RadioGroup>
            {selectedBudget === "custom" && (
              <Box display="flex" gap={1} mt={1}>
                <Box flex={1}>
                  <CustomTextField
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={customMin}
                    onChange={(e) => setCustomMin(e.target.value)}
                    placeholder="Min ₹"
                    slotProps={{
                      input: {
                        style: {
                          fontSize: "0.9rem",
                        },
                      },
                    }}
                  />
                </Box>
                <Box flex={1}>
                  <CustomTextField
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={customMax}
                    onChange={(e) => setCustomMax(e.target.value)}
                    placeholder="Max ₹"
                    slotProps={{
                      input: {
                        style: {
                          fontSize: "0.9rem",
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Menu>
        
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            gap={2}
            className="filterMenu"
          >
            <Button
              variant="outlined"
              endIcon={
                <Box component="span">
                  <ExpandMoreOutlined />
                </Box>
              }
              onClick={(e) => handleOpenMenu(e, "budget")}
            >
              Budget
            </Button>
            <Button
              variant="outlined"
              endIcon={
                <Box component="span">
                  <ExpandMoreOutlined />
                </Box>
              }
              onClick={(e) => handleOpenMenu(e, "rating")}
            >
              Rating
            </Button>
          </Box>

          <Box display="flex" alignItems="center" mb={2} mt={1}>
            <Typography fontWeight={600} mr={1} color="#333">
              Sort by:
            </Typography>
            <Box
              onClick={handleSortClick}
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 1,
                cursor: "pointer",
                position: "relative",
                fontWeight: 500,
                fontSize: "0.9rem",
                color: "#333",
                backgroundColor: "#E8F5E9",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                ":hover": {
                  backgroundColor: "#fff",
                  color: "#388E3C",
                },
              }}
            >
              {sortBy}
              <ExpandMoreOutlined
                sx={{ ml: 1, fontSize: "1rem", color: "#388E3C" }}
              />
            </Box>
            <Menu
              anchorEl={sortAnchorEl}
              open={Boolean(sortAnchorEl)}
              onClose={handleSortClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: {
                  sx: {
                    borderRadius: 2,
                    mt: 1,
                    boxShadow: 3,
                    minWidth: 180,
                    backgroundColor: "#fff",
                  },
                },
              }}
            >
              {sortOptions.map((option) => (
                <MenuItem
                  key={option}
                  onClick={() => handleSortSelect(option)}
                  selected={sortBy === option}
                  sx={{
                    fontWeight: sortBy === option ? 600 : 400,
                    fontSize: "0.9rem",
                    color: "#333",
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor:
                      sortBy === option ? "#E8F5E9 !important" : "transparent",
                    "&:hover": {
                      backgroundColor: "#E8F5E9 !important",
                    },
                  }}
                >
                  {option}
                  {sortBy === option && (
                    <CheckIcon sx={{ color: "#333", fontSize: "1rem" }} />
                  )}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
        {gigBids.length > 0 ? (
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, boxShadow: 2 }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>Bidder</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {gigBids.map((bid, index) => {
                  const isExpanded = expandedBidIds.includes(bid._id);
                  const truncatedDescription =
                    bid.description.length > 120 && !isExpanded
                      ? bid.description.slice(0, 120) + "..."
                      : bid.description;

                  return (
                    <TableRow
                      key={bid._id}
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa",
                        "&:hover": { backgroundColor: "#f0f0f0" },
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar
                            src={bid.createdBy.profilePicture}
                            alt={bid.createdBy.fullName}
                            sx={{ width: 36, height: 36 }}
                          />
                          <Typography variant="subtitle2">
                            {bid.createdBy.fullName}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell sx={{maxWidth:500}}>
                        <Typography variant="body2" color="text.secondary">
                          {truncatedDescription}
                        </Typography>
                        {bid.description.length > 120 && (
                          <Typography
                            variant="caption"
                            color="primary"
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleExpand(bid._id)}
                          >
                            {isExpanded ? "Read less" : "Read more"}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell sx={{ minWidth: 120,fontWeight: 600 }}>
                          ${bid.bidAmount} / hr
                      </TableCell>

                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(bid.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                      {(bid.status =="pending" || !bid.status) ? 
                      <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        > <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            onClick={()=>handleBidStatusChange(bid._id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleBidStatusChange(bid._id, "rejected")}
                          >
                            Reject
                          </Button>
                          </Stack> 
                        :
                        // show bid.status here
                        <Chip label={bid.status.charAt(0).toUpperCase() + bid.status.slice(1)} className={`gig${bid.status}`} />
                        
                        }
                        
                      </TableCell>
                    </TableRow>
                  );
                })}

                {loadingMore && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Skeleton variant="rectangular" width={120} height={30} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {pagination.totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={2} mb={2}>
                <Pagination
                  count={pagination.totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  shape="circular"
                />
              </Box>
            )}
          </TableContainer>
        ) : (
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No bids placed yet.
            </Typography>
          </Paper>
        )}
      </Box>
    );
  }

  return (
    <StyledWrapper>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => {
          if (isSelf) {
            router.push("/myGigs");
          } else {
            router.back();
          }
        }}
        className="backBtn"
      >
        Back to Gigs
      </Button>
      {loading || !gigDetails ? (
        getSkeleton()
      ) : (
        <Grid container spacing={4}>
          <Grid size={isSelf?{ xs: 12}:{ xs: 12, md: 8 }}>
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
                Posted {timeToShow} • {gigDetails.bids} bids
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
                <Chip
                  key={word}
                  label={word}
                  size="small"
                  className="gigChip"
                />
              ))}
            </Box>
            {isSelf ? getAllBids() : getBidBox()}
          </Grid>

          {!isSelf && (
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={3} className="providerCard">
                <Box className="providerHeader">
                  <Avatar
                    src={gigDetails.createdBy.profilePicture}
                    alt={gigDetails.createdBy.fullName}
                    sx={{ width: 60, height: 60, cursor: "pointer" }}
                    onClick={() =>
                      router.push(
                        "/profile/" +
                          gigDetails.createdBy.fullName.toLowerCase()
                      )
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
                      <Typography variant="body2">
                        ({gigDetails.reviews})
                      </Typography>
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
          )}
        </Grid>
      )}
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

  
  ".gigapproved": {
    backgroundColor: "#E8F5E9",
    color: "#388E3C",
  },
  
  ".gigrejected": {
    backgroundColor: "#FFCDD2",
    color: "#D32F2F",
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
  ".filterMenu button": {
    border: "1px solid #388E3C",
    borderRadius: 8,
    color: "#388E3C",
    marginBottom: "10px",
    paddingTop:"0px",
    paddingBottom:"0px",
  },
}));
