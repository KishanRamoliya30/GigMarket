"use client"

import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { useEffect,useState } from "react";
import { apiRequest } from "@/app/lib/apiCall";
import { Plan } from "@/app/utils/interfaces";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const router = useRouter();

  const fetchPlans = async () => {
    const res = await apiRequest<{ success: boolean; data: Plan[] }>("plans");
    if (res.ok && res.data?.success) {
      setPlans(res.data.data);
    }
  };

  const subscribePlan = async (planId:string) => {
    //stripe logic added here
    const response = await apiRequest("subscribe", {
      method: "POST",
      data: {
        planId: planId,
        stripeSubscriptionId: "test" //change with stripe Id
      },
    });
    if (response.ok && response.data) {
      toast.success("Subscription done successfully")
      router.push("/dashboard");
    } else {
      toast.error("Something went wrong")
    }
  }
  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <Box sx={{ bgcolor: "#fff", py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Choose your plan
        </Typography>

        <Grid container spacing={4} justifyContent="center" mt={4}>
          {plans.map((plan, index) => (
            <Grid size={{xs:12, sm:6, md:4}} key={plan._id} onClick={()=>{
              subscribePlan(plan._id)
            }}>
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
                {plan.ispopular && <Box
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
                  </Box>}

                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {plan.description}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  ₹{plan.price}/mo
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

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor:  "#fff",
                    color: "#000",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "#ddd",
                    },
                  }}
                >
                  Buy now
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
