"use client";

import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useFormik } from "formik";
import CustomTextField from "@/components/customUi/CustomTextField";
import CustomButton from "@/components/customUi/CustomButton";
import { apiRequest } from "@/app/lib/apiCall";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const OtpVerificationForm = () => {
  const router = useRouter();
  const email = Cookies.get("email");

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
        toast.success(response.message || "OTP verified successfully!");
        router.push("/reset-password");
      } else {
        setFieldError("otp", response.error ?? "Invalid OTP.");
        toast.error(response.error ?? "Invalid OTP.");
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
      onSubmit={handleSubmit}
      minWidth={{ xs: "100%", md: "600px", sm: "600px" }}
      bgcolor="#fff"
      borderRadius={4}
      boxShadow={3}
      p={{ xs: 4, sm: 4 }}
      mx={{ xs: "10px", sm: "50px" }}
      component="form"
    >
      <Typography variant="h6" fontWeight={600} mb={1}>
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
