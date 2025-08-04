"use client";
import {
  Box,
  Typography,
  Chip,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Grid,
  Pagination,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/apiCall";
import { PaymentLog } from "@/app/utils/interfaces";

const tabs = ["In Progress", "Completed"];

const StyledWrapper = styled(Box)(() => ({
  backgroundColor: "#f6f9fc",
  borderRadius: 16,
  padding: 24,
  maxWidth: 850,
  margin: "0 auto",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
}));

export default function PaymentHistory() {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [gigs , setGigs] = useState<PaymentLog[]>([]);
  const [count, setCount] = useState({ inProgress: 0, completed: 0 });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 1,
    totalPages: 0,
  });
  useEffect(() => {
    const fetchGigs = async () => {
      const response = await apiRequest("payment/payment-history", {
        method: "GET",
        params: {
          limit: pagination.limit,
          page: page,
          status: activeTab
        },
      });
      if (response.ok) {
        setGigs(response.data.data);
        setPagination(response.data.pagination)
      }
    };

    const fetchCount = async () => {
      const response = await apiRequest("payment/payment-history/count", {
        method: "GET",
      });
      if (response.ok) {
        setCount({ inProgress: response.data.data.inProgressCount, completed: response.data.data.completedCount });
      } 
    };
    fetchGigs();
    fetchCount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeTab]);

  const getPaymentStatusStyle = (status: string) => {
    return status === "Success"
      ? { color: "#2E7D32", bg: "#C8E6C9" }
      : { color: "#F57C00", bg: "#FFE0B2" };
  };

  return (
    <StyledWrapper>
      {/* Tabs */}
      <Box mb={3} display="flex" justifyContent="center">
        <Tabs
          value={activeTab}
          onChange={(e, val) => {
            setActiveTab(val);
            setPage(1);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: 3,
              minHeight: "auto",
              px: 3,
              py: 1.2,
              mx: 0.5,
            },
            "& .Mui-selected": {
              color: "#003322",
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            },
          }}
        >
          {tabs.map((tab,index) => (
            <Tab
              key={tab}
              label={`${tab} (${index === 0 ? count.inProgress : count.completed})`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Gigs */}
      {gigs.length > 0 ? (
        gigs.map((gig) => {
          return (
            <Accordion
              key={gig.gigId}
              sx={{
                mb: 2,
                borderRadius: 3,
                boxShadow: "0 3px 6px rgba(0,0,0,0.05)",
                border: "1px solid #e0f2f1",
                backgroundColor: "#ffffff",
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, py: 1 }}>
                <Box width="100%">
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={0.5}
                  >
                    <Typography fontWeight={600}>{gig.gigTitle}</Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Avatar
                      src={gig.createdBy.profilePicture}
                      alt={gig.createdBy.fullName}
                      sx={{ width: 28, height: 28 }}
                    />
                    <Typography variant="body2">
                      {gig.createdBy.fullName}
                    </Typography>
                  </Box>
                  </Box>

                  

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={1}
                    mb={1}
                  >
                    {gig.gigDescription}
                  </Typography>

                  <Grid container spacing={2} fontSize="14px">
                    <Grid size={{xs:6}} display="flex" alignItems="center" gap={1}>
                      <AttachMoneyIcon fontSize="small" />
                      ₹{gig.totalPaid}
                    </Grid>
                    <Grid
                      size={{xs:6}}
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                      gap={1}
                    >
                      <CalendarMonthIcon fontSize="small" />
                      {new Date(gig.createdAt).toLocaleDateString()}
                    </Grid>
                  </Grid>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Typography fontWeight={600} mb={1}>
                  Payments
                </Typography>
                <Divider sx={{ mb: 1 }} />
                {gig.payments.map((p, idx) => {
                  const payColor = getPaymentStatusStyle(p.status);
                  return (
                    <Box
                      key={idx}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      bgcolor="#fefefe"
                      px={2}
                      py={1.5}
                      borderRadius={2}
                      mb={1}
                      boxShadow="0 1px 2px rgba(0,0,0,0.03)"
                    >
                      <Typography fontSize={14}>₹{p.amount}</Typography>
                      <Typography fontSize={14} color="text.secondary">
                        {new Date(p.date).toLocaleDateString()}
                      </Typography>
                      <Chip
                        label={p.status}
                        size="small"
                        sx={{
                          bgcolor: payColor.bg,
                          color: payColor.color,
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          );
        })
      ) : (
        <Typography textAlign="center" color="text.secondary" py={6}>
          No gigs found.
        </Typography>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={pagination.totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            shape="rounded"
            color="primary"
          />
        </Box>
      )}
    </StyledWrapper>
  );
}
