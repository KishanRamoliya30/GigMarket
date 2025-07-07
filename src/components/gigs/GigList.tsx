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
  Switch,
} from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {ExpandMoreOutlined} from "@mui/icons-material";


const tiers = ["Tier 1", "Tier 2", "Tier 3"];
export const allGigs = new Array(50).fill(null).map((_, i) => ({
  id: (i + 1).toString(),
  title: `Gig Title ${i + 1}`,
  description: `Sample description for gig number ${i + 1}`,
  tier: tiers[(i % 3)] || "Tier 1",
  price: `₹${(i + 1) * 500}`,
  rating: 4 + (i % 2) * 0.5,
  reviews: (i + 1) * 2,
  provider: {
    name: `Provider ${i + 1}`,
    avatar: "/avatar1.png",
    skills: ["Adobe Illustrator", "Figma", "Creative Design"],
    certifications: ["Certified Graphic Designer"],
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
    height: "250px",
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
  }
}));

export default function GigListing() {
  const router = useRouter();
  const gigsPerPage = 25;
  const [page, setPage] = useState(1);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [openMenu, setOpenMenu] = useState("");

  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [proServices, setProServices] = useState(false);

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
    })
    .filter((gig) => (proServices ? gig.reviews >= 30 : true));

  const paginatedGigs = filteredGigs.slice(
    startIndex,
    startIndex + gigsPerPage
  );

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, menuType: string) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(menuType);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setOpenMenu("");
  };

  return (
    <StyledWrapper>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Browse Gigs
      </Typography>

      {/* Filter bar */}
      <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} className="filterMenu">
        <Button
          variant="outlined"
          endIcon={<Box component="span"><ExpandMoreOutlined /></Box>}
          onClick={(e) => handleOpenMenu(e, "sellers")}
        >
          Tiers
        </Button>
        <Button
          variant="outlined"
          endIcon={<Box component="span"><ExpandMoreOutlined /></Box>}
          onClick={(e) => handleOpenMenu(e, "rating")}
        >
          Rating
        </Button>
        <Button
          variant="outlined"
          endIcon={<Box component="span"><ExpandMoreOutlined /></Box>}
          onClick={(e) => handleOpenMenu(e, "budget")}
        >
          Budget
        </Button>
        <Button
          variant="outlined"
          endIcon={<Box component="span"><ExpandMoreOutlined /></Box>}
          onClick={(e) => handleOpenMenu(e, "delivery")}
        >
          Delivery time
        </Button>
        <FormControlLabel
          control={
            <Switch
              checked={proServices}
              onChange={() => setProServices(!proServices)}
            />
          }
          label="Pro services"
        />
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
        {selectedDelivery && (
          <Chip
            label={selectedDelivery}
            onDelete={() => setSelectedDelivery("")}
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
            {["5⭐","4⭐ and above","3⭐ and above","2⭐ and above"].map(
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
            ))}
          
        </Box>
      </Menu>

      {/* Budget Filter */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu === "budget"}
        onClose={handleCloseMenu}
      >
        <Box px={2} py={1} width={250}>
          <Typography fontWeight={600} mb={1}>
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
                  control={<Radio />}
                  label={opt === "custom" ? "Custom" : opt}
                />
              )
            )}
          </RadioGroup>
          {selectedBudget === "custom" && (
            <Box display="flex" gap={1} mt={1}>
              <input
                type="number"
                placeholder="Min ₹"
                style={{
                  width: "100%",
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max ₹"
                style={{
                  width: "100%",
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                value={customMax}
                onChange={(e) => setCustomMax(e.target.value)}
              />
            </Box>
          )}
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              onClick={() => {
                setSelectedBudget("");
                setCustomMin("");
                setCustomMax("");
                handleCloseMenu();
              }}
            >
              Clear
            </Button>
            <Button onClick={handleCloseMenu}>Apply</Button>
          </Box>
        </Box>
      </Menu>

      {/* Delivery Filter */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu === "delivery"}
        onClose={handleCloseMenu}
      >
        <Box px={2} py={1}>
          <Typography fontWeight={600} mb={1}>
            Delivery Time
          </Typography>
          {["24H", "Up to 3 days", "Up to 7 days", "Anytime"].map((option) => (
            <MenuItem
              key={option}
              selected={selectedDelivery === option}
              onClick={() => {
                setSelectedDelivery(option);
                handleCloseMenu();
              }}
            >
              {option}
            </MenuItem>
          ))}
        </Box>
      </Menu>

      {/* Gigs Grid */}
      <Grid container spacing={3} mt={2}>
        {paginatedGigs.map((gig) => (
          <Grid size={{ xs: 12,sm:6, md: 3 }} key={gig.id}>
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
                  {gig.price}
                </Typography>
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2, justifyContent: "space-between" }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar src={gig.provider.avatar} alt={gig.provider.name} />
                  <Box>
                    <Typography variant="body2">{gig.provider.name}</Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Rating value={gig.rating} precision={0.5} readOnly size="small" />
                      <Typography variant="caption">({gig.reviews})</Typography>
                    </Box>
                  </Box>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  className="viewBtn"
                  // onClick={() => router.push(`/gigs/${gig.id}`)}
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
          count={Math.ceil(filteredGigs.length / gigsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          shape="circular"
        />
      </Box>
    </StyledWrapper>
  );
}
