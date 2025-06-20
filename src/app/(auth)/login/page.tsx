"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Typography, Grid } from "@mui/material";
import CustomTextField from "@/components/CustomTextField";
import CustomButton from "@/components/CustomButton";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required(""),
});

const Login = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (res.ok) {
          router.push("/subscription");
        } else {
          setFieldError("password", data.error || "Invalid credentials");
        }
      } catch {
        setFieldError("password", "Something went wrong. Please try again.");
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
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = formik;

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      <Grid
        size={{ xs: 12 }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box width="100%" p={3} component="form" onSubmit={handleSubmit}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#222325", fontSize: "26px", mb: 4 }}
            gutterBottom
          >
            Continue with your email or username
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
          <Typography display={"flex"} justifyContent={"end"} mt={1} mb={4} sx={{textDecoration:"underline"}}>
            Forgot Password ?
          </Typography>

          <CustomButton
            fullWidth
            label={isSubmitting ? "Signing In..." : "Sign In"}
            variant="contained"
            sx={{ mt: "80px !important" }}
            type="submit"
            disabled={!formik.isValid || !formik.dirty || isSubmitting}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
