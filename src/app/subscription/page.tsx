import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";

const plans = [
  {
    title: "Free",
    price: "$0/mo",
    description: "Can only be a user (request gigs)",
    features: [
      "Voice messages anywhere",
      "Voice messages anywhere",
      "Voice messages anywhere",
    ],
    disabled: false,
    buttonText: "Buy now",
  },
  {
    title: "Basic",
    price: "$10/mo",
    tag: "MOST POPULAR",
    description: "User + Provider (limited access)",
    features: [
      "Voice messages anywhere",
      "Voice messages anywhere",
      "Voice messages anywhere",
    ],
    buttonText: "Buy now",
  },
  {
    title: "Pro",
    price: "$20/mo",
    description: "User + Provider (full access)",
    features: [
      "Voice messages anywhere",
      "Voice messages anywhere",
      "Voice messages anywhere",
    ],
    buttonText: "Buy now",
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
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                  {plan.price}
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
