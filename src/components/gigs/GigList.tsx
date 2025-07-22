"use client";

import {
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Pagination,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Skeleton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CustomTextField from "@/components/customUi/CustomTextField";
import { styled } from "@mui/system";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ExpandMoreOutlined, Check as CheckIcon } from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { apiRequest } from "@/app/lib/apiCall";
import { Gig } from "@/app/utils/interfaces";
import { ServiceTier } from "../../../utils/constants";
import { useUser } from "@/context/UserContext";
const tiers = [ServiceTier.BASIC, ServiceTier.EXPERT, ServiceTier.ADVANCED];

export default function GigListing() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const router = useRouter();
  const { user } = useUser();
  const gigsPerPage = 5;
  const [page, setPage] = useState(1);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [openMenu, setOpenMenu] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedReviews, setSelectedReviews] = useState("");
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState("Recently Added");
  const [allGig, setAllGig] = useState<Gig[]>();
  const [loading, setLoading] = useState(true);
  const [selectedDeleteGig, setSelectedDeleteGig] = useState<string>("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: gigsPerPage,
    totalPages: 0,
  });
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState("");

  const sortOptions = [
    "Pricing: High to Low",
    "Pricing: Low to High",
    "Rating: High to Low",
    "Rating: Low to High",
    "No of Reviews: High to Low",
    "No of Reviews: Low to High",
    "Recently Added",
  ];

  const handleSortClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (option: string) => {
    setSortBy(option);
    handleSortClose();
  };

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
  const gigList = async () => {
    setLoading(true);
    const priceParams: { minPrice?: number; maxPrice?: number } = {
      minPrice: undefined,
      maxPrice: undefined,
    };
    if (selectedBudget === "Under ₹2,252") {
      priceParams.maxPrice = 2252;
    } else if (selectedBudget === "₹2,252–₹5,404") {
      priceParams.minPrice = 2252;
      priceParams.maxPrice = 5404;
    } else if (selectedBudget === "₹5,404 & Above") {
      priceParams.minPrice = 5405;
    } else if (selectedBudget === "custom" && customMin && customMax) {
      priceParams.minPrice = Number(customMin);
      priceParams.maxPrice = Number(customMax);
    }

    let minReviews: number | undefined = undefined;

    if (selectedReviews === "Under 500") {
      minReviews = 0;
    } else if (selectedReviews === "500–1000") {
      minReviews = 500;
    } else if (selectedReviews === "1000 & Above") {
      minReviews = 1000;
    }

    let minRating: number | undefined = undefined;

    if (selectedRating === "5⭐") minRating = 5;
    else if (selectedRating === "4⭐ and above") minRating = 4;
    else if (selectedRating === "3⭐ and above") minRating = 3;
    else if (selectedRating === "2⭐ and above") minRating = 2;
    const res = await apiRequest(`gigs/list`, {
      method: "GET",
      params: {
        limit: gigsPerPage,
        page: page,
        search: search,
        tier: selectedTiers,
        minPrice: priceParams.minPrice,
        maxPrice: priceParams.maxPrice,
        minReviews: minReviews,
        minRating: minRating,
        sort: sortBy,
      },
    });
    setLoading(false);
    if (res.ok) {
      setAllGig(res.data.data);
      setPagination(res.data.pagination);
    }
  };

  useEffect(() => {
    gigList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    search,
    page,
    selectedTiers,
    selectedBudget,
    customMin,
    customMax,
    selectedReviews,
    selectedRating,
    sortBy,
  ]);

  const handleDeleteModalClick = (value: string) => {
    setSelectedDeleteGig(value);
  };

  const handleConfirmDelete = async () => {
    console.log("HELLO");
    const res = await apiRequest(
      `gigs/${selectedDeleteGig}`,
      {
        method: "DELETE",
      },
      true
    );
    if (res.ok) {
      setSelectedDeleteGig("");
      const filteredGigs =
        allGig?.filter((gig) => gig._id !== selectedDeleteGig) || [];
      setAllGig(filteredGigs);
    }
  };

  return (
    <StyledWrapper>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Browse Gigs
      </Typography>

      {/* Filter bar */}
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
          onClick={(e) => handleOpenMenu(e, "sellers")}
        >
          Tiers
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
          onClick={(e) => handleOpenMenu(e, "reviews")}
        >
          No. of Reviews
        </Button>
      </Box>

      {/* Selected filters */}
      <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
        {selectedTiers.map((label) => (
          <Chip
            key={label}
            label={label}
            onDelete={() =>
              setSelectedTiers((prev) => prev.filter((s) => s !== label))
            }
            className="chip"
          />
        ))}
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
        {selectedReviews && (
          <Chip
            label={selectedReviews}
            onDelete={() => setSelectedReviews("")}
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

      <Menu
        anchorEl={anchorEl}
        open={openMenu === "sellers"}
        onClose={handleCloseMenu}
      >
        <Box px={2} py={1}>
          <Typography fontWeight={600} mb={1}>
            Tiers
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            sx={{ width: 250, overflowY: "auto" }}
            className="tiersBox"
          >
            {tiers.map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={selectedTiers.includes(option)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedTiers((prev) =>
                        checked
                          ? [...prev, option]
                          : prev.filter((s) => s !== option)
                      );
                    }}
                    sx={{
                      color: "#388E3C",
                      "&.Mui-checked": {
                        color: "#388E3C",
                      },
                    }}
                  />
                }
                label={option}
                sx={{
                  ".MuiTypography-root": {
                    fontWeight: 500,
                    color: "#333",
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Menu>

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
            {["Under ₹2,252", "₹2,252–₹5,404", "₹5,404 & Above", "custom"].map(
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

      <Menu
        anchorEl={anchorEl}
        open={openMenu === "reviews"}
        onClose={handleCloseMenu}
      >
        <Box px={2} py={1} width={250}>
          <Typography fontWeight={600} mb={1} color="#333">
            No. of Reviews
          </Typography>
          <RadioGroup
            value={selectedReviews}
            onChange={(e) => {
              setSelectedReviews(e.target.value);
            }}
          >
            {["Under 500", "500–1000", "1000 & Above"].map((opt) => (
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
            ))}
          </RadioGroup>
        </Box>
      </Menu>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={"center"}
        mt={2}
        mb={1}
      >
        <Box>
          <Typography fontWeight={600} color="#333">
            {pagination.total} Gigs found
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
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

      <Grid container spacing={3} mt={2}>
        {loading
          ? Array.from(new Array(8)).map((_, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={idx}>
                <Card className="gigCard">
                  <CardContent>
                    <Skeleton variant="text" height={32} width="80%" />
                    <Skeleton variant="text" height={20} width="100%" />
                    <Skeleton variant="text" height={20} width="90%" />
                    <Box mt={1} mb={2}>
                      <Skeleton variant="rectangular" height={24} width={60} />
                    </Box>
                    <Skeleton variant="text" height={28} width="40%" />
                  </CardContent>
                  <CardActions
                    sx={{ px: 2, pb: 2, justifyContent: "space-between" }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box>
                        <Skeleton variant="text" height={20} width={80} />
                        <Skeleton variant="text" height={16} width={60} />
                      </Box>
                    </Box>
                    <Skeleton variant="rectangular" width={64} height={36} />
                  </CardActions>
                </Card>
              </Grid>
            ))
          : allGig?.map((gig, ind) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                key={`${ind}-${gig.id}`}
              >
                <Card className="gigCard">
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        gutterBottom
                        className="descClamp"
                      >
                        {gig.title}
                      </Typography>
                      {gig.createdBy._id.toString() === user?._id && (
                        <DeleteOutlineOutlinedIcon
                          sx={{
                            color: "#666",
                            cursor: "pointer",
                            "&:hover": {
                              color: "#d32f2f",
                            },
                          }}
                          onClick={() => handleDeleteModalClick(gig?._id)}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="descClamp"
                      mb={"12px"}
                    >
                      {gig.description}
                    </Typography>
                    <Box mb={1}>
                      <Chip
                        label={gig.tier}
                        size="small"
                        className="chipBlack"
                      />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      $ {gig.price}
                    </Typography>
                  </CardContent>

                  <CardActions
                    sx={{ px: 2, pb: 2, justifyContent: "space-between" }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        src={gig.createdBy.profilePicture}
                        alt={gig.createdBy.fullName}
                      />
                      {/* <Typography variant="body2">{!isProvider?gig.provider.name:gig.user.name}</Typography> */}
                      <Typography variant="body2">
                        {gig.createdBy.fullName}
                      </Typography>
                      {/* <Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Rating
                        value={gig.rating}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                      <Typography variant="caption">({gig.reviews})</Typography>
                    </Box>
                  </Box> */}
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      className="viewBtn"
                      onClick={() => router.push(`/gigs/${gig._id}`)}
                    >
                      View
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        <Dialog
          open={!!selectedDeleteGig}
          onClose={() => handleDeleteModalClick("")}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.08)",
            },
          }}
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#1a1a1a",
              p: 1,
              pt: 3,
              textAlign: "center",
            }}
          >
            Confirm Deletion
          </DialogTitle>
          <DialogContent sx={{ py: 4, px: 1 }}>
            <Typography
              align="center"
              sx={{
                fontSize: "1rem",
                color: "#666",
                maxWidth: "80%",
                mx: "auto",
              }}
            >
              Are you sure you want to delete this gig? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2, paddingTop: 0 }}>
            <Button
              onClick={() => handleDeleteModalClick("")}
              sx={{
                color: "#666",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                px: 3,
                "&:hover": {
                  backgroundColor: "#eeeeee",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#d32f2f",
                color: "white",
                borderRadius: "8px",
                px: 3,
                "&:hover": {
                  backgroundColor: "#b71c1c",
                },
              }}
              onClick={() => handleConfirmDelete()}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>

      <Box display="flex" justifyContent="center" mt={4} className="pagination">
        <Pagination
          count={pagination.totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          shape="circular"
        />
      </Box>
    </StyledWrapper>
  );
}

const StyledWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  // paddingTop: "100px !important",
  [theme.breakpoints.up("md")]: { padding: theme.spacing(4) },
  ".chip": {
    backgroundColor: "#E0E0E0",
    color: "#333",
    fontSize: "0.8rem",
    fontWeight: 500,
    transition: "opacity 0.3s ease, transform 0.3s ease",
    "& .MuiChip-deleteIcon": { color: "#888" },
  },
  ".chipBlack": {
    backgroundColor: "#E8F5E9",
    color: "#388E3C",
    fontSize: "0.75rem",
    fontWeight: 500,
  },
  ".viewBtn": {
    color: "#388E3C",
    textTransform: "none",
    borderColor: "#388E3C",
    fontWeight: 600,
    "&:hover": {
      borderColor: "#388E3C",
      backgroundColor: "#f4f4f4",
    },
  },
  ".pagination": {
    "& .Mui-selected": {
      backgroundColor: "#000",
      color: "#fff",
      fontWeight: 600,
      "&:hover": {
        backgroundColor: "#000",
      },
    },
  },
  ".gigCard": {
    border: "1px solid #ddd",
    borderRadius: 12,
    boxShadow: 3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "0.3s",
    height: "270px",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: 6,
    },
  },
  ".descClamp": {
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  ".filterMenu button": {
    border: "1px solid #388E3C",
    borderRadius: 8,
    color: "#388E3C",
  },
  ".tiersBox": {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    width: 250,
    overflowY: "auto",
    backgroundColor: "#f9f9f9",
  },
}));
