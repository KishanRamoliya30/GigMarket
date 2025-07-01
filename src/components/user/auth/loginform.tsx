"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Typography, Grid } from "@mui/material";
import CustomTextField from "@/components/customUi/CustomTextField";
import CustomButton from "@/components/customUi/CustomButton";
import Link from "next/link";
import { apiRequest } from "@/app/lib/apiCall";
import TermsPopup from "@/components/TermsPopup";
import { useState } from "react";
import Cookies from "js-cookie";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required(""),
});

const LoginForm = () => {
  const router = useRouter();
  const [showTerms, setShowTerms] = useState(false);
  const [terms, setTerms] = useState("");
  const [userId, setUserId] = useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      const res = await apiRequest("login", {
        method: "POST",
        data: values,
      });

      if (res.ok && res.data) {
        if (res.data.needToAcceptTerms) {
          setUserId(res.data.user.id);
          setTerms(res.data.terms);
          setShowTerms(true);
        } else {
          redirectAfterLogin(res.data.hasSubscription,res.data.user.id);
          Cookies.set("id", res.data.user.id, {
            expires: 1,
            path: "/",
            sameSite: "Strict",
            secure: process.env.NODE_ENV === "production",
          });
        }
      } else {
        setFieldError("password", res.error ?? "Invalid credentials");
      }

      setSubmitting(false);
    },
  });

  const redirectAfterLogin = (hasSubscription:boolean,userId:string) => {
    Cookies.set("id", userId, {
      expires: 1,
      path: "/",
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });
    router.push(hasSubscription?"/dashboard":"/subscription");
  };

  const acceptTerms = async () => {
    const res = await apiRequest("terms/accept", {
      method: "PATCH",
      data: {
        userId: userId,
      },
    });

    if (res.ok && res.data) {
      redirectAfterLogin(res.data.hasSubscription,res.data.user.id);
    }
  };

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = formik;

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      <TermsPopup
        open={showTerms}
        onClose={() => {
          setShowTerms(false);
        }}
        termsHtml={terms}
        onAgree={acceptTerms}
      />
      <Grid
        size={{ xs: 12 }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          width="100%"
          minWidth={{ xs: "100%", md: "600px", sm: "600px" }}
          bgcolor="#fff"
          borderRadius={4}
          boxShadow={3}
          p={{ xs: 4, sm: 4 }}
          mx={{ xs: "10px", sm: "50px" }}
          component="form"
          onSubmit={handleSubmit}
        >
          <Typography
            variant="h6" fontWeight={600} mb={1}
          >
            Sign In
          </Typography>
<Typography variant="body1" color="text.secondary" mb={4}>
       Continue with your email and password
      </Typography>
          <CustomTextField
            fullWidth
            label="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            errorText={touched.email && errors.email ? errors.email : ""}
            sx={{ mb: 2 }}
          />

          <CustomTextField
            fullWidth
            label="Password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            isPassword
            errorText={
              touched.password && errors.password ? errors.password : ""
            }
          />

          <Typography
            display={"flex"}
            justifyContent={"end"}
            mt={1}
            mb={4}
            sx={{
              textDecoration: "underline",
              color: "#2e7d32",
              cursor: "pointer",
            }}
          >
            <Link href="/forgot-password">Forgot Password?</Link>
          </Typography>

          <CustomButton
            fullWidth
            label={isSubmitting ? "Signing In..." : "Sign In"}
            variant="contained"
            type="submit"
            disabled={!formik.isValid || !formik.dirty || isSubmitting}
          />
          <Box mt={3} display="flex" justifyContent="center">
            Don&apos;t have an account?
            <Link href="/signup">
              &nbsp;
              <Typography
                component={"span"}
                variant={"body2"}
                sx={{
                  color: "#2e7d32",
                  fontSize: "16px",
                  textDecoration: "underline",
                }}
              >
                Sign Up
              </Typography>
            </Link>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
