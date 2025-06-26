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

const ForgotPasswordForm = () => {
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Must be a valid email")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Enter a valid email address"
      )
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      const response = await apiRequest("forgot-password", {
        method: "POST",
        data: { email: values.email },
      });

      if (response.ok && response.data) {
        Cookies.set("email", values.email, {
          expires: 1,
          path: "/",
          sameSite: "Strict",
          secure: process.env.NODE_ENV === "production",
        });
        toast.success(response.message ?? "OTP has been sent to your email!");
        router.push(`/verify-otp`);
        resetForm();
      } else {
        setFieldError("email", response.error ?? "Something went wrong.");
        toast.error(response.error ?? "Something went wrong.");
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
      width="100%"
      maxWidth={{ xs: "100%", sm: "600px" }}
      bgcolor="#fff"
      borderRadius={4}
      boxShadow={3}
      p={{ xs: 2, sm: 4 }}
      mx="auto"
    >
      <Typography variant="h4" fontWeight={700} mb={2}>
        Forgot Password?
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={4}>
        Enter your email address and we’ll send you a link to reset your
        password.
      </Typography>

      <CustomTextField
        fullWidth
        label="Email address"
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        errorText={touched.email && errors.email ? errors.email : ""}
      />

      <CustomButton
        fullWidth
        type="submit"
        variant="contained"
        label={isSubmitting ? "Sending..." : "Send Otp"}
        sx={{ mt: 4 }}
        disabled={!formik.isValid || !formik.dirty || isSubmitting}
      />
    </Box>
  );
};

export default ForgotPasswordForm;
