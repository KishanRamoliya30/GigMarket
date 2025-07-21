"use client";

import {
  Autocomplete,
  Box,
  Container,
  Grid,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ServiceTier } from "../../../utils/constants";
import CustomTextField from "../customUi/CustomTextField";
import { ChangeEvent, useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CancelIcon from "@mui/icons-material/Cancel";
import { apiRequest } from "@/app/lib/apiCall";
import { toast } from "react-toastify";
import CustomButton from "../customUi/CustomButton";
import AddIcon from "@mui/icons-material/Add";

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
  title: Yup.string().required("This field is required"),
  description: Yup.string().required("This field is required"),
  tier: Yup.string().required("This field is required"),
  price: Yup.number().required("This field is required").min(0),
  time: Yup.number().required("This field is required").min(1),
  keywords: Yup.array().min(1, "At least one keyword is required"),
  releventSkills: Yup.array().min(1, "At least one skill is required"),
  certification: Yup.mixed().required("This field is required"),
});

export default function CreateGigPage() {
  const [skillInput, setSkillInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
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
        const res = await apiRequest("gigs", {
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.success) {
          toast.success("Gig created successfully");
          resetForm();
        } else if (res.errors && Array.isArray(res.errors)) {
          const fieldErrors: Record<string, string> = {};
          res.errors.forEach((err: { field: string; message: string }) => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
        } else {
          toast.error(res.message ?? "Validation error");
        }
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    isSubmitting,
  } = formik;

  return (
    <Container maxWidth="md" sx={{ py: 4, pt: "100px" }}>
      <Typography variant="h3" fontWeight={600} mb={2}>
        Create a new Gig
      </Typography>
      <Typography variant="h5" fontWeight={400} mb={4}>
        Enter the details to create the gig
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              label="Gig Title"
              name="title"
              value={values.title}
              onChange={handleChange}
              errorText={touched.title && errors.title ? errors.title : ""}
              isAstrick
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
              isAstrick
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
              isAstrick
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
              isAstrick
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
              isAstrick
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              inputValue={keywordInput}
              onInputChange={(_, val) => setKeywordInput(val)}
              value={values.keywords}
              onChange={(_, val) => setFieldValue("keywords", val)}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Keywords"
                  isAstrick
                  name="keywords"
                  errorText={
                    touched.keywords && errors.keywords
                      ? (errors.keywords as string)
                      : ""
                  }
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        <IconButton
                          onClick={() => {
                            const trimmed = keywordInput.trim();
                            if (
                              trimmed &&
                              !values.keywords.includes(trimmed)
                            ) {
                              setFieldValue("keywords", [
                                ...values.keywords,
                                trimmed,
                              ]);
                              setKeywordInput("");
                            }
                          }}
                          size="small"
                          edge="end"
                        >
                          <AddIcon />
                        </IconButton>
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              inputValue={skillInput}
              onInputChange={(_, val) => setSkillInput(val)}
              value={values.releventSkills}
              onChange={(_, val) => setFieldValue("releventSkills", val)}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Relevant Skills"
                  isAstrick
                  name="releventSkills"
                  errorText={
                    touched.releventSkills && errors.releventSkills
                      ? (errors.releventSkills as string)
                      : ""
                  }
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        <IconButton
                          onClick={() => {
                            const trimmed = skillInput.trim();
                            if (
                              trimmed &&
                              !values.releventSkills.includes(trimmed)
                            ) {
                              setFieldValue("releventSkills", [
                                ...values.releventSkills,
                                trimmed,
                              ]);
                              setSkillInput("");
                            }
                          }}
                          size="small"
                          edge="end"
                        >
                          <AddIcon />
                        </IconButton>
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
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

              {!values.certification && (
                <input
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
                />
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }} className="mt-10">
            <CustomButton
              sx={{ width: { xs: "100%", md: "150px" } }}
              label={isSubmitting ? "Submitting..." : "Create Gig"}
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            />
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
