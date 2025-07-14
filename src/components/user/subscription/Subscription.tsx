"use client";

import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/apiCall";
import { Plan } from "@/app/utils/interfaces";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { useUser } from "@/context/UserContext";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const Subscription = () => {
  const { user, setUser } = useUser();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const fetchPlans = async () => {
    setLoading(true);
    const res = await apiRequest<{ success: boolean; data: Plan[] }>("plans");
    if (res.ok && res.data?.success) {
      setPlans(res.data.data);
    }
    setLoading(false);
  };

  const getAndSetUser = async () => {
    setLoading(true);
    const response = await apiRequest("user", {
      method: "GET",
    });
    setLoading(false);

    const newUser = response?.data?.data;

    if (newUser) {
      setUser(newUser);
      return;
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCheckout = async (plan: Plan) => {
    const isFree = !plan.priceId;
    setLoading(true);
    try {
      const res = await apiRequest("create-checkout-session", {
        method: "POST",
        data: JSON.stringify({
          plan,
          successUrl: `${window.location.origin}/subscriptionSuccess/{CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/subscription`,
        }),
      });

      if (isFree) {
        toast.success(res.data.message);
        router.push("/add-profile");
        console.log("test data123",res.data.message)
      } else {
        const { id } = await res.data.data;
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId: id });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;
    setLoading(true);
    try {
      const res = await apiRequest("cancel-subscription", {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Subscription cancelled successfully");
        getAndSetUser();
      } else {
        toast.error(res.data?.message || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error("An error occurred while cancelling the subscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader loading={loading} />
      <Box sx={{ bgcolor: "#fff", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            style={{ marginBottom: "16px" }}
            variant="h3"
            fontWeight="bold"
            align="center"
            gutterBottom
          >
            Upgrade to Grow
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            color="textSecondary"
            style={{ maxWidth: 600, margin: "0 auto 65px" }}
          >
            {`Choose a subscription plan that fits your freelancing goals. Whether you're just starting out or scaling your gig empire, we have the right tools to help you succeed.`}
          </Typography>

          <Grid container spacing={4} justifyContent="center" mt={6}>
            {plans.map((plan) => {
              const isActivePlan = user?.subscription?.planId === plan._id;

              return (
                <Grid
                  display={"flex"}
                  size={{ xs: 12, sm: 6, md: 4 }}
                  key={plan._id}
                >
                  <Paper
                    elevation={isActivePlan ? 10 : 2}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      flex: 1,
                      px: 4,
                      py: 5,
                      borderRadius: 5,
                      textAlign: "center",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      bgcolor: isActivePlan ? "#1A1F36" : "#fff",
                      color: isActivePlan ? "#fff" : "#000",
                      border: isActivePlan
                        ? "2px solid #1DBF73"
                        : "1px solid #e0e0e0",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
                        bgcolor: "#1A1F36",
                        color: "#fff",
                      },
                    }}
                  >
                    {isActivePlan && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "180px",
                          height: "180px",
                          overflow: "hidden",
                          pointerEvents: "none",
                          zIndex: 3,
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: 50,
                            left: -65,
                            width: "245px",
                            height: "30px",
                            transform: "rotate(-45deg)",
                            background: "linear-gradient(135deg, #1DBF73, #13aa60)",
                            color: "#000",
                            textAlign: "center",
                            fontSize: "13px",
                            fontWeight: "bold",
                            lineHeight: "30px",
                            letterSpacing: "0.5px",
                            boxShadow: "0 4px 12px rgba(29, 191, 115, 0.3)",
                            animation: "ribbonShine 3s infinite linear",
                          }}
                        >
                          <span style={{ fontSize: "18px" }}>👑</span> Current
                          Plan
                        </Box>
                      </Box>
                    )}

                    <Box>
                      <Typography variant="h4" fontWeight={700} gutterBottom>
                        {plan.name}
                      </Typography>
                      <Typography variant="h3" fontWeight="bold" mb={1}>
                        ${plan.price}
                        <Typography
                          component="span"
                          sx={{ fontSize: 16, ml: 0.5 }}
                        >
                          /mo
                        </Typography>
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: isActivePlan ? "#ccc" : "text.secondary",
                          mb: 3,
                        }}
                      >
                        {plan.description}
                      </Typography>
                    </Box>

                    <Box mb={4}>
                      {plan.benefits.map((feature: string, i: number) => (
                        <Typography
                          key={i}
                          className="feature"
                          variant="body1"
                          sx={{
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            transition: "color 0.3s ease",
                          }}
                        >
                          ✅ {feature}
                        </Typography>
                      ))}
                    </Box>

                    {isActivePlan &&
                      user.subscription?.planName !== "Free" &&
                      !user.subscription?.cancelAtPeriodEnd && (
                        <Button
                          variant="outlined"
                          fullWidth
                          disabled={user.subscription?.cancelAtPeriodEnd}
                          onClick={handleCancelSubscription}
                          sx={{
                            mt: 1,
                            mb: 2,
                            py: 1.2,
                            textTransform: "none",
                            transition: "all 0.3s ease",
                            color: "#f44336",
                            borderColor: "#f44336",
                            borderRadius: 3,
                            fontWeight: 600,
                            "&:hover": {
                              bgcolor: "#ffe5e5",
                              borderColor: "#f44336",
                            },
                            "&:disabled": {
                              bgcolor: "#fddcdc",
                              borderColor: "#f44336",
                              color: "#f44336",
                              cursor: "not-allowed",
                              opacity: 0.6,
                            },
                          }}
                        >
                          Cancel Subscription
                        </Button>
                      )}
                    <Button
                      className="action-btn"
                      variant="contained"
                      fullWidth
                      disabled={isActivePlan}
                      onClick={() => handleCheckout(plan)}
                      sx={{
                        bgcolor: "#1DBF73 !important",
                        color: isActivePlan ? "#0000009 !important" : "#000",
                        textTransform: "none",
                        fontWeight: 700,
                        py: 1.2,
                        borderRadius: 3,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: isActivePlan ? "#f4f4f4" : "#1de28f",
                        },
                      }}
                    >
                      {isActivePlan
                        ? "Subscribed"
                        : plan.price <= 0
                          ? "Get Started"
                          : "Buy Now"}
                    </Button>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Subscription;
