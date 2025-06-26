import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";

const plans = [
  {
    id: 1,
    title: "Free",
    duration: "/mo",
    currency: { name: "", symbole: "" },
    price: "Free",
    description: "Can only be a user (request gigs)",
    features: [
      "Only user account — can request gigs",
      "Cannot post gigs as provider",
      "No access to badges or bids",
    ],
    disabled: false,
    buttonText: "Join for free",
  },
  {
    id: 2,
    title: "Basic",
    duration: "/mo",
    currency: { name: "USD", symbole: "$" },
    price: 10,
    tag: "MOST POPULAR",
    description: "Limited access to provider features",
    features: [
      "Can post up to 3 gigs per month",
      "Can bid on up to 5 gigs per month",
      "Cannot earn badges like 'Top Rated Seller'",
      "Can act as user or provider (limited)",
    ],
    buttonText: "Upgrade to Basic",
    priceId: process.env.BASIC_STRIP_PRICE_ID
  },
  {
    id: 3,
    title: "Pro",
    duration: "/mo",
    currency: { name: "USD", symbole: "$" },
    price: 20,
    description: "Full access as user and provider",
    features: [
      "Dual profile: user + provider in one account",
      "Unlimited gig posts and bids",
      "Eligible for all badges (e.g., Top Rated Seller)",
      "Priority support and full marketplace access",
    ],
    buttonText: "Go Pro",
    priceId: process.env.PRO_STRIP_PRICE_ID
  },
];

export default function SubscriptionPlans() {
  return (
    <Box sx={{ bgcolor: "#fff", py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Choose your plan
        </Typography>

        <Grid container spacing={4} justifyContent="center" mt={4}>
          {plans.map((plan, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Paper
                elevation={0}
                sx={{
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
                {plan.tag && (
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
                    {plan.tag}
                  </Box>
                )}

                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {plan.title}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {`${plan.currency.symbole}${plan.price}`}
                  <span className="px-1 text-[14px]">{plan.duration}</span>
                </Typography>
                <Typography variant="body2" color="gray" mt={1} gutterBottom>
                  {plan.description}
                </Typography>

                <Box mt={2} mb={4}>
                  {plan.features.map((feature, i) => (
                    <Typography variant="body2" key={i} sx={{ mb: 1 }}>
                      ✓ {feature}
                    </Typography>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  disabled={plan.disabled}
                  sx={{
                    bgcolor: plan.disabled ? "#555" : "#fff",
                    color: plan.disabled ? "#ccc" : "#000",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: plan.disabled ? "#555" : "#ddd",
                    },
                  }}
                >
                  {plan.buttonText}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
