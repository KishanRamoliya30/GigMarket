"use client";

import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useFormik } from "formik";
import CustomTextField from "@/components/customUi/CustomTextField";
import CustomButton from "@/components/customUi/CustomButton";
import { apiRequest } from "@/app/lib/apiCall";
import Link from "next/link";
import { toast } from "react-toastify";

const SignupForm = () => {
  const router = useRouter();

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Must be a valid email")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Enter a valid email address"
      )
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[0-9]/, "Must contain at least one number"),
    terms: Yup.bool().oneOf([true], "You must accept the terms and conditions"),
    consent: Yup.bool().oneOf([true], "Consent is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      terms: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      const response = await apiRequest("signup", {
        method: "POST",
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          termsAccepted: values.terms,
          subscriptionCompleted: false,
          profileCompleted: false,
        },
      });
      if (response.ok && response.data) {
        toast.success(response.message || "Account created successfully!");
        router.push("/subscription");
        resetForm();
      } else {
        setFieldError("password", response.error ?? "Invalid credentials");
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
    number: /[0-9]/.test(values.password),
  };

  return (
    <Box
      width="100%"
      maxWidth={{ xs: "100%", md: "600px" }}
      bgcolor="#fff"
      borderRadius={4}
      boxShadow={3}
      mx={{ xs: "10px", sm: "50px" }}
      height={{ xs: "90vh", sm: "80vh" }}
      display="flex"
      flexDirection="column"
      p={{ xs: 2, sm: 4 }}
    >
      <Typography variant="h6" fontWeight={600} mb={1}>
        Sign Up
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Join us and start your journey in minutes.
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          overflowY: "auto",
          p: { xs: 1, sm: 1 },
          flexGrow: 1,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "3px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <CustomTextField
              label="First name"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              errorText={
                touched.firstName && errors.firstName ? errors.firstName : ""
              }
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <CustomTextField
              label="Last name"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              errorText={
                touched.lastName && errors.lastName ? errors.lastName : ""
              }
            />
          </Box>
        </Box>

        <CustomTextField
          fullWidth
          margin="normal"
          label="Email address"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          errorText={touched.email && errors.email ? errors.email : ""}
        />

        <CustomTextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          isPassword
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          errorText={touched.password && errors.password ? errors.password : ""}
        />

        <Box
          mt={2}
          mb={2}
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
        >
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
              color={
                passwordValid.uppercase ? "success.main" : "text.secondary"
              }
            >
              ✓ At least 1 uppercase letter
            </Typography>
          </Box>

          <Box width={{ xs: "100%", sm: "48%" }} mb={1}>
            <Typography
              variant="body2"
              color={
                passwordValid.lowercase ? "success.main" : "text.secondary"
              }
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

        <FormControlLabel
          sx={{ mb: 2, display: "flex", alignItems: "center" }}
          control={
            <Checkbox
              name="terms"
              checked={values.terms}
              onChange={handleChange}
              onBlur={handleBlur}
              disableRipple
              sx={{
                color: "#2e7d32",
                "&.Mui-checked": { color: "#2e7d32" },
                "& .MuiSvgIcon-root": { fontSize: 22 },
              }}
            />
          }
          label={
            <Typography variant="body2">
              By joining, you agree to the{" "}
              <Link
                href="/terms-of-service"
                style={{ color: "#2e7d32" }}
                target="_blank"
              >
                Terms of Service
              </Link>
            </Typography>
          }
        />
        {touched.terms && errors.terms && (
          <Typography variant="caption" color="error" sx={{ ml: "14px" }}>
            {errors.terms}
          </Typography>
        )}
      </Box>
      <CustomButton
        fullWidth
        label={isSubmitting ? "Submitting..." : "Sign Up"}
        variant="contained"
        sx={{ mt: 3 }}
        type="submit"
        disabled={!formik.isValid || !formik.dirty || isSubmitting}
      />

      <Typography
        variant="body1"
        sx={{ fontSize: "16px", textAlign: "center", mt: 4 }}
      >
        Already have an account?&nbsp;
        <Link href="/login">
          <Typography
            component="span"
            variant="body2"
            sx={{
              color: "#2e7d32",
              fontSize: "16px",
              textDecoration: "underline",
            }}
          >
            Sign in
          </Typography>
        </Link>
      </Typography>
    </Box>
  );
};

export default SignupForm;
