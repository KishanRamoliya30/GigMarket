"use client";

import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Typography,
} from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { ServiceTier } from "../../../utils/constants";
import CustomTextField from "../customUi/CustomTextField";
import { ChangeEvent } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CancelIcon from "@mui/icons-material/Cancel";
import { IconButton } from "@mui/material";

interface FormValues {
  title: string;
  description: string;
  tier: string;
  price: string;
  time: string;
  keywords: string[];
  releventSkills: string[];
  certification: File | null;
}

const initialValues: FormValues = {
  title: "",
  description: "",
  tier: "",
  price: "",
  time: "",
  keywords: [],
  releventSkills: [],
  certification: null,
};

const validationSchema = Yup.object({
  title: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  tier: Yup.string().required("Required"),
  price: Yup.number().required("Required").min(0),
  time: Yup.number().required("Required").min(1),
  keywords: Yup.array().min(1, "At least one keyword is required"),
  certification: Yup.mixed().required("Certification is required"),
});

export default function CreateGigPage() {

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("tier", values.tier);
    formData.append("price", values.price);
    formData.append("time", values.time);
    formData.append("keywords", JSON.stringify(values.keywords));
    formData.append("releventSkills", JSON.stringify(values.releventSkills));
    if (values.certification) {
      formData.append("certification", values.certification);
    }

    try {
      const res = await fetch("/api/gigs", {
        method: "POST",
        body: formData,
        headers: {
          "x-user": JSON.stringify({
            _id: "6859102a09d00c17564fb697",
            role: "User",
          }),
        },
      });

      const data = await res.json();
      if (data.success) {
        alert("Gig created successfully");
        resetForm();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight={600} mb={2}>
        Create a new Gig
      </Typography>

      <Typography variant="h5" fontWeight={400} mb={4}>
        Enter the details to create the gig
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <CustomTextField
                  label="Gig Title"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  errorText={touched.title && errors.title ? errors.title : ""}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <CustomTextField
                  label="Tier"
                  name="tier"
                  select
                  value={values.tier}
                  onChange={handleChange}
                  errorText={touched.tier && errors.tier ? errors.tier : ""}
                  required
                >
                  {Object.values(ServiceTier).map((tier) => (
                    <MenuItem key={tier} value={tier}>
                      {tier}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <CustomTextField
                  label="Gig Description"
                  name="description"
                  multiline
                  rows={4}
                  value={values.description}
                  onChange={handleChange}
                  errorText={
                    touched.description && errors.description
                      ? errors.description
                      : ""
                  }
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <CustomTextField
                  label="Gig Price ($)"
                  name="price"
                  type="number"
                  value={values.price}
                  onChange={handleChange}
                  errorText={touched.price && errors.price ? errors.price : ""}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <CustomTextField
                  label="Delivery Time (in hours)"
                  name="time"
                  type="number"
                  value={values.time}
                  onChange={handleChange}
                  errorText={touched.time && errors.time ? errors.time : ""}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={values.keywords}
                  onChange={(_, val) => setFieldValue("keywords", val)}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      label="Keywords"
                      required
                      errorText={
                        touched.keywords && errors.keywords
                          ? (errors.keywords as string)
                          : ""
                      }
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={values.releventSkills}
                  onChange={(_, val) => setFieldValue("releventSkills", val)}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      label="Relevant Skills"
                      required
                      errorText={
                        touched.releventSkills && errors.releventSkills
                          ? (errors.releventSkills as string)
                          : ""
                      }
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box mt={1} sx={{ position: "relative" }}>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "text.secondary",
                      mb: "6px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Upload Certification
                    <Typography component="span" color="error" ml={0.5}>
                      *
                    </Typography>
                  </Typography>

                  <CustomTextField
                    name="certification"
                    value={values.certification?.name || ""}
                    onChange={() => {}}
                    // placeholder="Upload your document"
                    disabled
                    errorText={
                      touched.certification && errors.certification
                        ? (errors.certification as string)
                        : ""
                    }
                    isWithoutMargin
                    sx={{
                      "& .Mui-disabled": {
                        color: values.certification
                          ? "text.primary"
                          : "text.secondary",
                      },
                    }}
                  />

                  {!values.certification && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "40px",
                        left: "12px",
                        display: "flex",
                        alignItems: "center",
                        color: "text.secondary",
                        pointerEvents: "none",
                        fontSize: "14px",
                      }}
                    >
                      <UploadFileIcon sx={{ fontSize: 20, mr: 1 }} />
                      <span>Upload your document</span>
                    </Box>
                  )}

                  {/* Cancel button */}
                  {values.certification && (
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: "4px",
                        zIndex: 3,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFieldValue("certification", null);
                      }}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  )}

                  {!values.certification && <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFieldValue("certification", file);
                      }
                    }}
                    style={{
                      position: "absolute",
                      top: "32px",
                      left: 0,
                      width: "100%",
                      height: "44px",
                      opacity: 0,
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                  />}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Create Gig"}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
