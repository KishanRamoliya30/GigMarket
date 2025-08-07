"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tooltip,
  Button,
  Rating,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  Radio,
  Grid,
  Chip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import CommonTable, { Column } from "./CommonTable";
import { apiRequest } from "@/app/lib/apiCall";

interface Gig {
  _id: string;
  title: string;
  rating: number;
}

interface Pagination {
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export default function ManagePost() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [minRating, setMinRating] = useState<number | "all">("all");
  const [searchText, setSearchText] = useState<string>("");
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    limit: 5,
    page: 1,
    pages: 1,
  });


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("admin/approved-gig", {
        method: "GET",
        params: {
          limit: pagination.limit,
          page: pagination.page,
        },
      });
  
      if (response.ok) {
        setGigs(response.data.data || []);
        setPagination(response.data.pagination || pagination);
      }
    } catch (err) {
      console.error("Error fetching gigs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page,pagination.limit]);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleSelectRating = (val: number | "all") => {
    setMinRating(val);
    handleMenuClose();
  };

  const handlePageChange = (newPage: number,rowsPerPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage, limit: rowsPerPage }));
  };

  const columns: Column[] = [
    {
      id: "title",
      label: "Gig Title",
      render: (row) => (
        <Tooltip title={row.title}>
          <Typography
            sx={{
              maxWidth: 350,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: 500,
              color: "#222",
            }}
          >
            {row.title}
          </Typography>
        </Tooltip>
      ),
    },
    {
      id: "rating",
      label: "Rating",
      render: (row) => (
        <Box display="flex" alignItems="center">
          <Rating value={row.rating} precision={0.5} readOnly size="small" />
          <Typography variant="body2" ml={1} color="#333">
            {row.rating}
          </Typography>
        </Box>
      ),
    },
  ];

  const tranferPayment = async (gigId: string,providerId: string) => {
    apiRequest("admin/approve-payment", {
      method: "POST",
      data: {
        providerId: providerId,
        gigId: gigId
      }
    }).then((response) => {
      console.log("Payment transferred successfully:", response);
    }).catch((error) => {
      console.error("Error transferring payment:", error);
    });
  }
  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight={600} mb={3} color="#222">
        Completed Gigs
      </Typography>

      {/* ✅ Filters */}
      <Grid container spacing={2} mb={2}>
        <Grid size={{xs:12,sm:6,md:4}}>
          <TextField
            label="Search Gig Title"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            fullWidth
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ddd" },
                "&:hover fieldset": { borderColor: "#aaa" },
                "&.Mui-focused fieldset": { borderColor: "#666" },
              },
              "& .MuiInputLabel-root": { color: "#555" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#444" },
              "& input": { color: "#222" },
            }}
          />
        </Grid>

        {/* Rating Filter */}
        <Grid size={{xs:12,sm:6,md:4}}>
          <Button
            variant="outlined"
            onClick={handleMenuClick}
            endIcon={<ArrowDropDownIcon />}
            sx={{
              borderColor: "#333",
              color: "#333",
              textTransform: "none",
              fontWeight: 500,
              width: "100%",
              height: "40px",
              "&:hover": { borderColor: "#222", backgroundColor: "#eeeeee" },
            }}
          >
            {minRating === "all" ? "Filter by Rating" : `${minRating}+ Stars`}
          </Button>

          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <Box px={2} py={1}>
              <Typography fontWeight={600} color="#222">
                Select Rating
              </Typography>
            </Box>
            {[5, 4, 3, 2].map((rating) => (
              <MenuItem key={rating} onClick={() => handleSelectRating(rating)}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Radio
                    checked={minRating === rating}
                    size="small"
                    sx={{
                      color: "#333",
                      "&.Mui-checked": { color: "#222" },
                    }}
                  />
                </ListItemIcon>
                <Typography color="#333">
                  {rating}{" "}
                  <StarIcon
                    sx={{ fontSize: 18, color: "#ffb400", ml: 0.5, mb: "2px" }}
                  />{" "}
                  {rating !== 5 && "and above"}
                </Typography>
              </MenuItem>
            ))}
            <MenuItem onClick={() => handleSelectRating("all")}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Radio
                  checked={minRating === "all"}
                  size="small"
                  sx={{
                    color: "#333",
                    "&.Mui-checked": { color: "#222" },
                  }}
                />
              </ListItemIcon>
              <Typography color="#333">All Ratings</Typography>
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>

      {/* ✅ Active Filter Chips */}
      {minRating !== "all" && (
        <Box mb={2}>
          <Chip
            label={
              <Box display="flex" alignItems="center">
                {minRating}
                <StarIcon
                  sx={{ fontSize: 16, color: "#ffb400", ml: 0.5, mb: "2px" }}
                />
              </Box>
            }
            onDelete={() => setMinRating("all")}
            deleteIcon={<CloseIcon />}
            sx={{
              backgroundColor: "#f5f5f5",
              color: "#333",
              fontWeight: 500,
              "& .MuiChip-deleteIcon": {
                color: "#333",
                "&:hover": { color: "#222" },
              },
            }}
          />
        </Box>
      )}

      {/* ✅ Table */}
      {/* {loading ? (
        <CommonTable
        columns={columns}
        rows={gigs}
        pagination={pagination}
        pageChange={handlePageChange}
        
      />
      ) : ( */}
        <CommonTable
          columns={columns}
          rows={gigs}
          pagination={pagination}
          pageChange={handlePageChange}
          actions={(row) =>
            row.rating >= 3 ? (
              <Button
                variant="contained"
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  backgroundColor: "#333",
                  "&:hover": { backgroundColor: "#222" },
                }}
                onClick={()=>tranferPayment(row._id,row.assignedToBid.createdBy)}
              >
                Pay
              </Button>
            ) : (
              <Tooltip title="Minimum 3★ required to pay">
                <span>
                  <Button
                    variant="contained"
                    size="small"
                    disabled
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                      backgroundColor: "#999",
                      color: "#fff",
                    }}
                  >
                    Pay
                  </Button>
                </span>
              </Tooltip>
            )
          }
          loading={loading}
        />
      {/* )} */}
    </Box>
  );
}
