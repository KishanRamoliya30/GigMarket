"use client";

import {
  Box,
  Typography,
  Avatar,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Rating,
  Pagination,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
} from "@mui/material";
import CustomTextField from "@/components/customUi/CustomTextField";
import { styled } from "@mui/system";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExpandMoreOutlined, Check as CheckIcon } from "@mui/icons-material";
import { useUser } from "@/context/UserContext";  
import { apiRequest } from '@/app/lib/apiCall';
import { GigDocument } from "@/app/models/gig";

const tiers = ["Tier 1", "Tier 2", "Tier 3"];
export const allGigs = new Array(50).fill(null).map((_, i) => ({
  id: (i + 1).toString(),
  title: `Gig Title ${i + 1}`,
  description: `Sample description for gig number ${i + 1}`,
  tier: tiers[i % 3] || "Tier 1",
  price: `₹${(i + 1) * 500}`,
  rating: 4 + (i % 2) * 0.5,
  reviews: (i + 1) * 2,
  provider: {
    name: `Provider ${i + 1}`,
    avatar: "/avatar1.png",
    skills: ["Adobe Illustrator", "Figma", "Creative Design"],
    certifications: ["Certified Graphic Designer"],
  },
  user: {
    name: `User ${i + 1}`
  },
  keywords: ["logo", "branding", "startup", "vector"],
}));

const StyledWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
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
    marginBottom: "12px",
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
    display:"flex",
    flexDirection:"column",
    gap:1,
    width: 250,
    overflowY: "auto",
    backgroundColor: "#f9f9f9",
    }
  
}));

export default function GigListing() {
  const router = useRouter();
  const { user } = useUser();
  const isProvider = user?.role == "Provider";
  const gigsPerPage = 5;
  const [page, setPage] = useState(1);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [openMenu, setOpenMenu] = useState("");

  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedReviews, setSelectedReviews] = useState("");
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");
  const [selectedEdu, setselectedEdu] = useState<string[]>([]);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState("Rating: High to Low");
  const [allGig, setAllGig] = useState<GigDocument[]>(); 
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: gigsPerPage,
    totalPages: 0,
  });
  const startIndex = (page - 1) * gigsPerPage;

  const filteredGigs = allGigs
    .filter((gig) => {
      const price = parseInt(gig.price.replace("\u20b9", ""));
      if (selectedBudget === "Under ₹2,252") return price < 2252;
      if (selectedBudget === "₹2,252–₹5,404")
        return price >= 2252 && price <= 5404;
      if (selectedBudget === "₹5,404 & Above") return price > 5404;
      if (selectedBudget === "custom" && customMin && customMax)
        return price >= Number(customMin) && price <= Number(customMax);
      return true;
    })
    .filter((gig) => {
      if (selectedSellers.includes("Top Rated Seller") && gig.reviews < 30)
        return false;
      if (selectedSellers.includes("Level 1") && gig.reviews < 10) return false;
      if (selectedSellers.includes("Level 2") && gig.reviews < 20) return false;
      return true;
    });

  const sortOptions = [
    "Pricing: High to Low",
    "Pricing: Low to High",
    "Rating: High to Low",
    "Rating: Low to High",
    "No of Reviews: High to Low",
    "No of Reviews: Low to High",
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
      const res = await apiRequest(`/gigs`, {
        method: "GET",
        params: {
          limit: gigsPerPage,
          page: page,
        }
      });
      if(res.ok) {
        setAllGig(res.data.data);
        setPagination(res.data.pagination);
      }
  };

  useEffect(() => {
    gigList();
  }, [page]);
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
        <Button
          variant="outlined"
          endIcon={
            <Box component="span">
              <ExpandMoreOutlined />
            </Box>
          }
          onClick={(e) => handleOpenMenu(e, "type")}
        >
          Type of Education
        </Button>
      </Box>

      {/* Selected filters */}
      <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
        {selectedSellers.map((label) => (
          <Chip
            key={label}
            label={label}
            onDelete={() =>
              setSelectedSellers((prev) => prev.filter((s) => s !== label))
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
        {selectedEdu.map((label) => (
          <Chip
            key={label}
            label={label}
            onDelete={() =>
              setselectedEdu((prev) => prev.filter((s) => s !== label))
            }
            className="chip"
          />
        ))}
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
                    checked={selectedSellers.includes(option)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedSellers((prev) =>
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
          {["5⭐", "4⭐ and above", "3⭐ and above", "2⭐ and above"].map(
            (option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={selectedSellers.includes(option)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedSellers((prev) =>
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
            )
          )}
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

      <Menu
        anchorEl={anchorEl}
        open={openMenu === "type"}
        onClose={handleCloseMenu}
      >
        <Box px={2} py={1}>
          <Typography fontWeight={600} mb={1}>
            Type of Education
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            sx={{ width: 250, overflowY: "auto" }}
          >
            {["Bachelor Degree", "Master Degree", "Diploma", "PhD"].map(
              (option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={selectedEdu.includes(option)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setselectedEdu((prev) =>
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
              )
            )}
          </Box>
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
              ":hover": {
                backgroundColor: "#E8F5E9",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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

      {/* <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="text.secondary">
          No gigs found
        </Typography>
      </Box> */}
      <Grid container spacing={3} mt={2}>
        {allGig?.map((gig) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={gig.id}>
            <Card className="gigCard">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {gig.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="descClamp"
                >
                  {gig.description}
                </Typography>
                <Box mb={1}>
                  <Chip label={gig.tier} size="small" className="chipBlack" />
                </Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  $ {gig.price}
                </Typography>
              </CardContent>

              <CardActions
                sx={{ px: 2, pb: 2, justifyContent: "space-between" }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  {/* <Avatar src={gig.provider.avatar} alt={!isProvider?gig.provider.name:gig.user.name} /> */}
                  {/* <Box>
                    <Typography variant="body2">{!isProvider?gig.provider.name:gig.user.name}</Typography>
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
