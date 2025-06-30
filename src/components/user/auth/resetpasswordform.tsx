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

const ResetPasswordForm = ({isAdmin}:{isAdmin?:boolean}) => {
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
      let redirectLink = "/login";
      if(isAdmin) redirectLink = `/admin${redirectLink}`
      if (response.ok) {
        Cookies.remove("email");
        toast.success(response.message || "Password reset successfully!");
        router.push(redirectLink);
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
  const passwordValid = {
    length: values.password.length >= 8,
    uppercase: /[A-Z]/.test(values.password),
    lowercase: /[a-z]/.test(values.password),
    number: /\d/.test(values.password),
  };
  return (
    <Box
      onSubmit={handleSubmit}
     minWidth={{ xs: "100%", md: "600px", sm: "600px" }}
      bgcolor="#fff"
      borderRadius={4}
      boxShadow={3}
      p={isAdmin ? { xs: 2, sm: 4 } : { xs: 4, sm: 4 }}
      mx={isAdmin ? "auto" : { xs: "10px", sm: "50px" }}
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
        isPassword
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        errorText={touched.password && errors.password ? errors.password : ""}
      />
     
      <CustomTextField
        fullWidth
        label="Confirm Password"
        name="confirmPassword"
        isPassword
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        errorText={
          touched.confirmPassword && errors.confirmPassword
            ? errors.confirmPassword
            : ""
        }
      />
  <Box mt={2} mb={2} display="flex" flexWrap="wrap" justifyContent="space-between">
        <Box width={{ xs: "100%", sm: "48%" }} mb={1}>
          <Typography
            variant="body2"
            color={passwordValid.length ? "success.main" : "text.secondary"}
          >
            ✓ At least 8 characters
          </Typography>
        </Box>
        <Box width={{ xs: "100%", sm: "48%" }} mb={1}>
          <Typography
            variant="body2"
            color={passwordValid.uppercase ? "success.main" : "text.secondary"}
          >
            ✓ At least 1 uppercase letter
          </Typography>
        </Box>
        <Box width={{ xs: "100%", sm: "48%" }} mb={1}>
          <Typography
            variant="body2"
            color={passwordValid.lowercase ? "success.main" : "text.secondary"}
          >
            ✓ At least 1 lowercase letter
          </Typography>
        </Box>
        <Box width={{ xs: "100%", sm: "48%" }} mb={1}>
          <Typography
            variant="body2"
            color={passwordValid.number ? "success.main" : "text.secondary"}
          >
            ✓ At least 1 number
          </Typography>
        </Box>
      </Box>
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
