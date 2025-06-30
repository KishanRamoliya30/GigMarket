"use client";

import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/apiCall";
import { Plan } from "@/app/utils/interfaces";
import { toast } from "react-toastify";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const Subscription = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlans = async () => {
    const res = await apiRequest<{ success: boolean; data: Plan[] }>("plans");
    if (res.ok && res.data?.success) {
      setPlans(res.data.data);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCheckout = async (plan: (typeof plans)[number]) => {
    if (!plan.priceId) {
      toast.success("Free account activated");
      return;
    }
    // if (!plan.priceId) return;

    setLoading(true);
    try {
      const res = await apiRequest("create-checkout-session", {
        method: "POST",
        data: JSON.stringify({
          plan,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/cancel`,
        }),
      });

      const { id } = await res.data.data;

      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId: id });
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#fff", py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Choose your plan
        </Typography>

        <Grid container spacing={4} justifyContent="center" mt={4}>
          {plans.map((plan) => (
            <Grid
              display={"flex"}
              // flex={1}
              size={{ xs: 12, sm: 6, md: 4 }}
              key={plan._id}
            >
              <Paper
                elevation={0}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flex: 1,
                  bgcolor: "#000",
                  color: "#fff",
                  p: 4,
                  borderRadius: 4,
                  textAlign: "center",
                  position: "relative",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                }}
              >
                {plan.ispopular && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -16,
                      left: "50%",
                      transform: "translateX(-50%)",
                      bgcolor: "#555",
                      color: "#fff",
                      px: 2,
                      py: 0.5,
                      borderRadius: "20px",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    Most Popular
                  </Box>
                )}

                <Box>
                  <Typography variant="h4" fontWeight={600} gutterBottom>
                    {plan.name}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ${plan.price}
                    <span className="px-1 text-[14px]">/mo</span>
                  </Typography>
                  <Typography variant="body2" color="gray" mt={1} gutterBottom>
                    {plan.description}
                  </Typography>

                  <Box mt={2} mb={4}>
                    {plan.benefits.map((feature, i) => (
                      <Typography variant="body2" key={i} sx={{ mb: 1 }}>
                        ✓ {feature}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  // disabled={loading}
                  onClick={() => handleCheckout(plan)}
                  sx={{
                    // bgcolor: plan.disabled ? "#555" : "#fff",
                    // color: plan.disabled ? "#ccc" : "#000",
                    bgcolor: "#fff",
                    color: "#000",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "#ddd",
                      // bgcolor: plan.disabled ? "#555" : "#ddd",
                    },
                  }}
                >
                  {loading ? "Loading..." : "Buy now"}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Subscription;
