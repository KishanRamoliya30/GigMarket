"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Typography } from "@mui/material";
import CustomTextField from "@/components/customUi/CustomTextField";
import CustomButton from "@/components/customUi/CustomButton";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function AdminLogin() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (res.ok) {
          router.push("/admin");
        } else {
          setFieldError("password", data.error || "Access denied");
        }
      } catch (error) {
        setFieldError("password", "Server error. Try again.");
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
    <Box 
     component="form" 
     onSubmit={handleSubmit}
     borderRadius={4}
     boxShadow={3}
     minWidth={{ xs: "100%",sm: "500px" }}
     sx={{
       minHeight: "85vh",
       justifyContent: "center",
       alignItems: "center",
       p:  "25px",
       m:"15px"
     }}
     
     >
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, color: "#1A1A1A", fontSize: "24px", mb: 4 }}
      >
        Admin Panel Login
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
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        isPassword
        errorText={touched.password && errors.password ? errors.password : ""}
      />
      <Typography
        display={"flex"}
        justifyContent={"end"}
        mt={1}
        mb={4}
        sx={{ textDecoration: "underline",cursor:"pointer" }}
        onClick={()=>router.push("/admin/forgot-password")}
      >
        Forgot Password ?
      </Typography>

      <CustomButton
        fullWidth
        label={isSubmitting ? "Logging In..." : "Login"}
        variant="contained"
        sx={{ mt: 4 }}
        type="submit"
        disabled={!formik.isValid || !formik.dirty || isSubmitting}
      />
    </Box>
  );
}
