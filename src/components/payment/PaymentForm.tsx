"use client";
import React, { useEffect, useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { apiRequest } from "@/app/lib/apiCall";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
interface PaymentProps {
  amount: number;
  userId: string;
  gigId: string;
  refId: string;
  gigTitle: string;
  gigDescription: string;
}

export default function PaymentForm(payment: PaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [savedMethods, setSavedMethods] = useState<any[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("new");
  const [tab, setTab] = useState<string>("new");

  useEffect(() => {
    const fetchClientSecret = async () => {
      const res = await apiRequest("payment/create-payment-intent", {
        method: "POST",
        data: payment,
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok && res.data) {
        setClientSecret(res.data.data.clientSecret);
      }
    };

    const fetchSavedCards = async () => {
      const res = await apiRequest("payment/get-saved-methods", {
        method: "POST",
      });
      if (res.ok && res.data) {
        const methods = res.data.data.paymentMethods || [];
        setSavedMethods(methods);
        if (methods.length > 0) {
          setSelectedMethod(methods[0].id);
          setTab("saved");
        }
      }
    };

    fetchClientSecret();
    fetchSavedCards();
  }, []);

  const savepaymentInfo = async (stripePaymentIntentId: string,isSuccess:boolean) => {
    const res = await apiRequest("payment/save-payment-info", {
      method: "POST",
      data: {
        stripePaymentIntentId,
        userId: payment.userId,
        gigId: payment.gigId,
        refId: payment.refId,
        amount: payment.amount,
        status: isSuccess ? "Success" : "Fail",
      },
      headers: { "Content-Type": "application/json" },
    });
    console.log("Payment info saved:", res);
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    setLoading(true);

    const payment_method =
      tab === "new"
        ? { card: elements.getElement(CardNumberElement)! }
        : selectedMethod;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method,
    });

    setLoading(false);

    if (result.error) {
       toast.error(result.error.message);
       savepaymentInfo("Failed",false);
      
    } else if (result.paymentIntent?.status === "succeeded") {
      toast.success("Payment successful!");
      savepaymentInfo(result.paymentIntent.id,true);
      console.log("Payment successful:", result);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={8}>
      <Paper
        elevation={3}
        sx={{ maxWidth: 520, p: 4, borderRadius: 3, width: "100%" }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          textAlign="center"
          gutterBottom
          color="#003322"
        >
          Secure Payment
        </Typography>

        <Box bgcolor="#E8F5E9" borderRadius={2} p={2} mb={4}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            color="#003322"
          >
            {payment.gigTitle}
          </Typography>
          <Typography
            variant="body2"
            color="#2e7d32"
            mb={1}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {payment.gigDescription}
          </Typography>
          <Typography variant="h6" fontWeight={700} color="#004d3b">
            ${payment.amount.toFixed(2)}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          {savedMethods.length > 0 && (
            <ToggleButtonGroup
              value={tab}
              exclusive
              onChange={(e, newTab) => setTab(newTab || "new")}
              fullWidth
              sx={{
                mb: 3,
                gap: 2,
                "& .MuiToggleButton-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  py: 1.2,
                  color: "#003322",
                  borderColor: "#a5d6a7",
                  "&.Mui-selected": {
                    backgroundColor: "#E8F5E9",
                    borderColor: "#66bb6a",
                    color: "#003322",
                  },
                  "&:hover": {
                    backgroundColor: "#E8F5E9",
                  },
                },
              }}
            >
              <ToggleButton value="saved">Saved Card</ToggleButton>
              <ToggleButton value="new">New Card</ToggleButton>
            </ToggleButtonGroup>
          )}

          <AnimatePresence mode="wait">
            {tab === "saved" && savedMethods.length > 0 && (
              <motion.div
                key="saved"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <RadioGroup
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  {savedMethods.map((method) => {
                    const brand = method.card.brand.toLowerCase();
                    // const icon =
                    //   cardBrandIcons[brand] || cardBrandIcons.default;
                    return (
                      <Paper
                        key={method.id}
                        variant="outlined"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 2,
                          borderRadius: 2,
                          borderColor:
                            selectedMethod === method.id
                              ? "#66bb6a"
                              : "grey.300",
                          backgroundColor:
                            selectedMethod === method.id
                              ? "#E8F5E9"
                              : "background.paper",
                        }}
                      >
                        <FormControlLabel
                          value={method.id}
                          control={
                            <Radio
                              sx={{
                                color: "#2e7d32",
                                "&.Mui-checked": {
                                  color: "#2e7d32",
                                },
                              }}
                            />
                          }
                          label={
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              width="100%"
                            >
                              <Typography fontSize={14}>
                                **** **** **** {method.card.last4} (
                                {brand.toUpperCase()})
                              </Typography>
                              {/* <img
                                src={icon}
                                alt={brand}
                                width={34}
                                height={24}
                                style={{ objectFit: "contain" }}
                              /> */}
                            </Box>
                          }
                          sx={{ flex: 1 }}
                        />
                      </Paper>
                    );
                  })}
                </RadioGroup>
              </motion.div>
            )}

            {tab === "new" && (
              <motion.div
                key="new"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
              >
                <Box display="flex" flexDirection="column" gap={2} mb={3}>
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color="#003322"
                    >
                      Card Number
                    </Typography>
                    <Box p={2} border="1px solid #ccc" borderRadius={2}>
                      <CardNumberElement
                        options={{ style: { base: { fontSize: "16px" } } }}
                      />
                    </Box>
                  </Box>

                  <Box display="flex" gap={2}>
                    <Box flex={1}>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        color="#003322"
                      >
                        Expiry
                      </Typography>
                      <Box p={2} border="1px solid #ccc" borderRadius={2}>
                        <CardExpiryElement
                          options={{ style: { base: { fontSize: "16px" } } }}
                        />
                      </Box>
                    </Box>
                    <Box flex={1}>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        color="#003322"
                      >
                        CVC
                      </Typography>
                      <Box p={2} border="1px solid #ccc" borderRadius={2}>
                        <CardCvcElement
                          options={{ style: { base: { fontSize: "16px" } } }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!stripe || loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
            sx={{
              py: 1.4,
              fontWeight: 600,
              mt: 1,
              textTransform: "none",
              backgroundColor: "#003322",
              "&:hover": {
                backgroundColor: "#004d3b",
              },
            }}
          >
            {loading ? "Processing..." : `Pay $${payment.amount.toFixed(2)}`}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
