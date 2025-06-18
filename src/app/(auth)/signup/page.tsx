"use client";

import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useFormik } from "formik";
import CustomTextField from "@/components/CustomTextField";
import CustomButton from "@/components/CustomButton";

const Signup = () => {
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[0-9]/, "Must contain at least one number"),
    terms: Yup.bool().oneOf([true], "You must accept the terms and conditions"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      terms: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            termsAccepted: values.terms,
            subscriptionCompleted: false,
            profileCompleted: false,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          alert("Signup successful! Verification email sent.");
          resetForm();
          router.push("/subscription");
        } else {
          if (data.error) {
            setFieldError("email", data.error);
          } else {
            alert(data.message || "Signup failed.");
          }
        }
      } catch {
        alert("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
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
    <Grid container sx={{ minHeight: "100vh" }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box width="100%" p={3} component="form" onSubmit={handleSubmit}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#222325", fontSize: "26px", mb: 0 }}
            gutterBottom
          >
            Create a new account
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, fontSize: "16px" }}>
            Already have an account?&nbsp;
            <a
              href="/login"
              style={{ color: "#2e7d32", textDecoration: "underline" }}
              target="_blank"
            >
              Sign in
            </a>
          </Typography>

          <CustomTextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            errorText={touched.email && errors.email ? errors.email : ""}
          />

          <CustomTextField
            label="Password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            isPassword={true}
            errorText={
              touched.password && errors.password ? errors.password : ""
            }
          />

          <Box mt={1} mb={4}>
            <Typography
              variant="body2"
              color={passwordValid.length ? "success.main" : "text.secondary"}
            >
              ✓ At least 8 characters
            </Typography>
            <Typography
              variant="body2"
              color={
                passwordValid.uppercase ? "success.main" : "text.secondary"
              }
            >
              ✓ At least 1 uppercase letter
            </Typography>
            <Typography
              variant="body2"
              color={
                passwordValid.lowercase ? "success.main" : "text.secondary"
              }
            >
              ✓ At least 1 lowercase letter
            </Typography>
            <Typography
              variant="body2"
              color={passwordValid.number ? "success.main" : "text.secondary"}
            >
              ✓ At least 1 number
            </Typography>
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
                <a href="/terms" style={{ color: "#2e7d32" }} target="_blank">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" style={{ color: "#2e7d32" }} target="_blank">
                  Privacy Policy
                </a>
              </Typography>
            }
          />
          {touched.terms && errors.terms && (
            <Typography variant="caption" color="error" sx={{ ml: "14px" }}>
              {errors.terms}
            </Typography>
          )}

          <CustomButton
            fullWidth
            label={isSubmitting ? "Submitting..." : "Continue"}
            variant="contained"
            sx={{ mt: "20px" }}
            type="submit"
            disabled={!formik.isValid || !formik.dirty || isSubmitting}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Signup;
