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

const ResetPasswordForm = () => {
  const router = useRouter(); 
const email = Cookies.get("email");
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      const response = await apiRequest("reset-password", {
        method: "POST",
        data: {
          email,
          newPassword: values.password,
        },
      });

      if (response.ok) {
        Cookies.remove("email");
        toast.success(response.message || "Password reset successfully!");
        router.push("/login");
        resetForm();
      } else {
        setFieldError("password", response.error ?? "Something went wrong.");
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
        Reset Password
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={4}>
        Set your new password below.
      </Typography>

      <CustomTextField
        fullWidth
        label="New Password"
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        errorText={touched.password && errors.password ? errors.password : ""}
      />

      <CustomTextField
        fullWidth
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        errorText={
          touched.confirmPassword && errors.confirmPassword
            ? errors.confirmPassword
            : ""
        }
      />

      <CustomButton
        fullWidth
        type="submit"
        variant="contained"
        label={isSubmitting ? "Resetting..." : "Reset Password"}
        sx={{ mt: 4 }}
        disabled={!formik.isValid || isSubmitting}
      />
    </Box>
  );
};

export default ResetPasswordForm;
