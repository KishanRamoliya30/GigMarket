"use client";

import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useFormik } from "formik";
import CustomTextField from "@/components/customUi/CustomTextField";
import CustomButton from "@/components/customUi/CustomButton";
import { apiRequest } from "@/app/lib/apiCall";

const OtpVerificationForm = () => {
  const router = useRouter();
  const email = localStorage.getItem("email");

  const validationSchema = Yup.object({
    otp: Yup.string()
      .required("OTP is required")
      .matches(/^\d{4,6}$/, "OTP must be 4 to 6 digits"),
  });

  const formik = useFormik({
    initialValues: {
      email,
      otp: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      const response = await apiRequest("verify-otp", {
        method: "POST",
        data: {
          email,
          otp: values.otp,
        },
      });

      if (response.ok) {
        router.push("/reset-password");
      } else {
        setFieldError("otp", response.error ?? "Invalid OTP.");
      }

      setSubmitting(false);
    },
  });

  const {
    values,
    touched,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    handleBlur,
  } = formik;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: "400px",
        mx: "auto",
        bgcolor: "#fff",
        p: { xs: 3, sm: 5 },
        borderRadius: 4,
        boxShadow: 4,
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={2}>
        OTP Verification
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={4}>
        Enter the OTP sent to your email.
      </Typography>

      <CustomTextField
        fullWidth
        label="OTP"
        name="otp"
        value={values.otp}
        onChange={handleChange}
        onBlur={handleBlur}
        errorText={touched.otp && errors.otp ? errors.otp : ""}
      />

      <CustomButton
        fullWidth
        type="submit"
        variant="contained"
        label={isSubmitting ? "Verifying..." : "Verify OTP"}
        sx={{ mt: 4 }}
        disabled={!formik.isValid || isSubmitting}
      />

      {/* Optional Resend Button */}
      {/* <CustomButton
        fullWidth
        variant="text"
        label="Resend OTP"
        sx={{ mt: 2 }}
        onClick={async () => {
          const res = await apiRequest("resend-otp", {
            method: "POST",
            data: { email },
          });
          if (res.ok) {
            alert("OTP sent again to your email.");
          } else {
            alert("Failed to resend OTP.");
          }
        }}
      /> */}
    </Box>
  );
};

export default OtpVerificationForm;
