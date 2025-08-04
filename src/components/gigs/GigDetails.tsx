"use client";

import {
  Box,
  Typography,
  Chip,
  Button,
  Paper,
  Avatar,
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
import { useRouter, useParams } from "next/navigation";
import { styled } from "@mui/system";
import { useUser } from "@/context/UserContext";
import { apiRequest } from "@/app/lib/apiCall";
import { JSX, useEffect, useState } from "react";
import { Gig, Bid } from "@/app/utils/interfaces";
import { usePathname } from "next/navigation";
import CustomTextField from "../customUi/CustomTextField";
import { ExpandMoreOutlined, Check as CheckIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { getStatusStyles } from "../../../utils/constants";
import { Details } from "./GigDetailsComponents/Details";
import BackButton from "../customUi/BackButton";
import Skeleton from "./GigDetailsComponents/Skeleton";

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
    const priceParams: { minPrice?: number; maxPrice?: number } = {
      minPrice: undefined,
      maxPrice: undefined,
    };
    if (selectedBudget === "Under ₹500") {
      priceParams.maxPrice = 500;
    } else if (selectedBudget === "₹500–₹1500") {
      priceParams.minPrice = 500;
      priceParams.maxPrice = 1500;
    } else if (selectedBudget === "₹1500 & Above") {
      priceParams.minPrice = 1501;
    } else if (selectedBudget === "custom" && customMin && customMax) {
      priceParams.minPrice = Number(customMin);
      priceParams.maxPrice = Number(customMax);
    }

    let minRating: number | undefined = undefined;
    if (selectedRating === "5⭐") minRating = 5;
    else if (selectedRating === "4⭐ and above") minRating = 4;
    else if (selectedRating === "3⭐ and above") minRating = 3;
    else if (selectedRating === "2⭐ and above") minRating = 2;
    const res = await apiRequest(`mygigs/${gigId}/bids`, {
      method: "GET",
      params: {
        limit: pagination.limit,
        page: page,
        minPrice: priceParams.minPrice,
        maxPrice: priceParams.maxPrice,
        minRating: minRating,
        sort: sortBy,
      },
    });
    if (res.ok) {
      // setLoading(false);
      setPagination(res.data.pagination);
      setGigBids(res.data.data);
    }
  };
  const redirectToPublicProfile = (userId: string) => {
    router.push("/publicProfile/" + userId);
  };

  const updateBidStatus = async (
    bidId: string,
    status: "Assigned" | "Not-Assigned"
  ) => {
    return await apiRequest(`gigs/${gigId}/changeStatus`, {
      method: "PATCH",
      data: { status, bidId },
    });
  };

  const handleBidStatusChange = async (
    bidId: string,
    status: "Assigned" | "Not-Assigned"
  ) => {
    try {
      const res = await updateBidStatus(bidId, status);

      if (res.success) {
        toast.success(res?.data?.message);
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
  }, [page, sortBy, selectedRating, selectedBudget, customMin, customMax]);

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
            {gigDetails?.createdByRole === "Provider"
              ? "Your Request"
              : "Your Bid"}
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
        {gigDetails?.createdByRole === "Provider" ? "Request" : "Place Bid"}
      </Button>
    ) : (
      <Box className="bidBox">
        <Typography variant="h6" fontWeight={600} mb={2}>
          {gigDetails?.createdByRole === "Provider"
            ? "Place Your Request"
            : "Place Your Bid"}
        </Typography>

        <Box display="flex" gap={2} mb={2}>
          <CustomTextField
            placeholder={
              gigDetails?.createdByRole === "Provider"
                ? "Enter your request amount"
                : "Enter your bid amount"
            }
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
          placeholder={
            gigDetails?.createdByRole === "Provider"
              ? "Enter your request description for this gig"
              : "Why are you the best fit for this gig?"
          }
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
          {gigDetails?.createdByRole === "Provider"
            ? "Submit Request"
            : "Submit Bid"}
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
          {gigDetails?.createdByRole === "Provider"
            ? "All Requests"
            : "All Bids"}
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
              {["Under ₹500", "₹500–₹1500", "₹1500 & Above", "custom"].map(
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
                    label={opt === "custom" ? "Custom" : opt}
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

        <Box display="flex" justifyContent="space-between" alignItems="center">
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
        <Box display="flex" flexWrap="wrap" gap={1} mt={0.5} mb={1}>
          {selectedBudget && selectedBudget !== "custom" && (
            <Chip
              label={selectedBudget}
              onDelete={() => setSelectedBudget("")}
              className="chip"
            />
          )}
          {selectedBudget === "custom" && customMin && customMax && (
            <Chip
              label={`₹${customMin} - ₹${customMax}`}
              onDelete={() => {
                setCustomMin("");
                setCustomMax("");
                setSelectedBudget("");
              }}
              className="chip"
            />
          )}
          {selectedRating && (
            <Chip
              label={selectedRating}
              onDelete={() => setSelectedRating("")}
              className="chip"
            />
          )}
        </Box>
        {gigBids.length > 0 ? (
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, boxShadow: 2 }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>
                    {gigDetails?.createdByRole === "Provider"
                      ? "Requester"
                      : "Bidder"}
                  </TableCell>
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
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          onClick={() =>
                            redirectToPublicProfile(bid.createdBy._id)
                          }
                          sx={{ cursor: "pointer" }}
                        >
                          <Avatar
                            src={bid.createdBy.profilePicture}
                            alt={bid.createdBy.fullName}
                            sx={{ width: 36, height: 36 }}
                          />
                          <Typography
                            variant="subtitle2"
                            sx={{ cursor: "pointer !important" }}
                          >
                            {bid.createdBy.fullName}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ maxWidth: 500 }}>
                        <Typography variant="body2" color="text.secondary">
                          {truncatedDescription}
                        </Typography>
                        {bid.description.length > 120 && (
                          <Typography
                            variant="caption"
                            sx={{ cursor: "pointer", color: "#000" }}
                            onClick={() => handleExpand(bid._id)}
                          >
                            {isExpanded ? "Read less" : "Read more"}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell sx={{ minWidth: 120, fontWeight: 600 }}>
                        ${bid.bidAmount} / hr
                      </TableCell>

                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(bid.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        {bid.status == "Requested" || !bid.status ? (
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            {" "}
                            <Button
                              variant="outlined"
                              color="success"
                              size="small"
                              onClick={() =>
                                handleBidStatusChange(bid._id, "Assigned")
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() =>
                                handleBidStatusChange(bid._id, "Not-Assigned")
                              }
                            >
                              Reject
                            </Button>
                          </Stack>
                        ) : (
                          // show bid.status here
                          <Chip
                            label={
                              bid.status.charAt(0).toUpperCase() +
                              bid.status.slice(1)
                            }
                            sx={{
                              ...getStatusStyles(bid.status),
                            }}
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {loadingMore && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <div className="h-[30px] w-[120px] animate-pulse rounded bg-gray-200" />
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
              {!selectedBudget && !selectedRating
                ? gigDetails?.createdByRole === "Provider"
                  ? "No Requests yet"
                  : "No bids placed yet."
                : gigDetails?.createdByRole === "Provider"
                  ? "No Requests match this filter"
                  : "No bids match this filter."}
            </Typography>
          </Paper>
        )}
      </Box>
    );
  }

  const renderDynamicContent = () => {
    return isSelf ? getAllBids() : getBidBox();
  };

  return (
    <StyledWrapper>
      <BackButton
        title="Back to Gigs"
        onClick={() => {
          if (isSelf) {
            router.push("/myGigs");
          } else {
            router.back();
          }
        }}
      />
      {loading || !gigDetails ? (
        <Skeleton />
      ) : (
        <div>
          <Details gigDetails={gigDetails} />
          <div className="mt-3">{renderDynamicContent() as JSX.Element}</div>
        </div>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled(Box)(({ theme }) => ({
  maxWidth: "1440px",
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
    paddingTop: "0px",
    paddingBottom: "0px",
  },
}));
