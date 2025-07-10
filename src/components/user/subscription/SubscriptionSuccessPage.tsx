"use client";

import { Button, Container, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/apiCall";
import Loader from "@/components/Loader";
import { useUser } from "@/context/UserContext";

const SubscriptionSuccessPage = () => {
  const router = useRouter();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setsetProfileCompleted] = useState(true);

  const {setUser} = useUser();
  const handleNavigate = () => {
    const pathName = profileCompleted ? "/dashboard" : "/myProfile";
    router.push(pathName);
  };

  const fetchSession = async () => {
    setLoading(true);
    const response = await apiRequest(`session/${sessionId}`, {
      method: "GET",
    });
    setLoading(false);

    if (response?.data?.success) {
      return;
    } else {
      handleNavigate();
    }
  };

  const getAndSetUser = async () => {
    setLoading(true);
    const response = await apiRequest("user", {
      method: "GET",
    });
    setLoading(false);

    const newUser = response?.data?.data

    if (newUser) {
      setsetProfileCompleted(newUser.profileCompleted)
      setUser(newUser);
      return;
    } else {
      handleNavigate();
    }
  };

  useEffect(() => {
    if (!sessionId) {
      handleNavigate();
      return;
    }

    fetchSession();
    getAndSetUser();
  }, [sessionId]);

  return (
    <>
      <Loader loading={loading} />
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "green", mb: 2 }} />

        <Typography variant="h4" fontWeight={600} gutterBottom>
          {`You're Subscribed!`}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Your subscription has been successfully activated. Enjoy the access to
          premium features and tools tailored to help you grow faster.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleNavigate}
          sx={{ textTransform: "none" }}
        >
          {profileCompleted ?  "Go to Dashboard" : "Complete your profile"}
        </Button>
      </Container>
    </>
  );
};

export default SubscriptionSuccessPage;
