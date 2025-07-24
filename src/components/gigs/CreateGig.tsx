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
import { ServiceTier } from "../../../utils/constants";
import CustomTextField from "../customUi/CustomTextField";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CancelIcon from "@mui/icons-material/Cancel";
import { apiRequest } from "@/app/lib/apiCall";
import { toast } from "react-toastify";
import CustomButton from "../customUi/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import { useParams, useRouter } from "next/navigation";
import { Gig } from "@/app/utils/interfaces";
import Loader from "../Loader";
import {
  FormDataValue,
  getDiffObj,
  objectToFormData,
} from "@/app/lib/commonFunctions";
import { useUser } from "@/context/UserContext";
import { CreteGigSchema } from "@/utils/feValidationSchema";

interface FileMeta {
  name: string;
  url: string;
  type?: string;
  size?: number;
}

type Certification = File | FileMeta;

interface FormValues {
  title: string;
  description: string;
  tier: string;
  price: string;
  time: string;
  keywords: string[];
  releventSkills: string[];
  certification: Certification | null;
  gigImage: Certification | null;
}

export default function CreateGigPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const router = useRouter();
  const { gigId } = params;

  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [skillInput, setSkillInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [gigDetails, setGigDetails] = useState<Gig | null>(null);

  const getGigDetail = useCallback(async () => {
    setLoading(true);
    const res = await apiRequest(`gigs/${gigId}`, {
      method: "GET",
    });
    setLoading(false);
    if (res.ok && res.data.data.createdBy._id === user?._id) {
      setGigDetails(res.data.data);
    } else {
      toast.error("You are not authorized to update this gig");
      router.back();
    }
  }, [gigId, router, user?._id]);

  useEffect(() => {
    if (gigId) {
      getGigDetail();
    } else {
      setLoading(false);
    }
  }, [gigId, getGigDetail]);

  const getInitialFormValues = (gig?: Gig | null): FormValues => ({
    title: gig?.title || "",
    description: gig?.description || "",
    tier: gig?.tier || "",
    price: gig?.price?.toString() || "",
    time: gig?.time?.toString() || "",
    keywords: gig?.keywords || [],
    releventSkills: gig?.releventSkills || [],
    certification: gig?.certification?.name ? gig.certification : null,
    gigImage: gig?.gigImage?.name ? gig.gigImage : null,
  });

  const initialFormValues = useMemo(
    () => getInitialFormValues(gigDetails),
    [gigDetails]
  );

  const formik = useFormik<FormValues>({
    initialValues: initialFormValues,
    validationSchema: CreteGigSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      setLoading(true);

      const originalData = initialFormValues;
      const updatedData = values;

      const changes = getDiffObj(
        originalData as unknown as Record<string, FormDataValue>,
        updatedData as unknown as Record<string, FormDataValue>
      );

      if (Object.keys(changes).length === 0) {
        toast.error("No changes found");
        setSubmitting(false);
        setLoading(false);
        return;
      }

      const { certification, gigImage, ...rest } = changes;

      const formPayload: Record<string, FormDataValue> = {
        ...rest,
      };

      if (certification instanceof File) {
        formPayload.certification = certification;
      }

      if (gigImage instanceof File) {
        formPayload.gigImage = gigImage;
      }

      const formData = objectToFormData(formPayload);

      try {
        const method = gigId ? "PATCH" : "POST";
        const endpoint = gigId ? `gigs/${gigId}` : "gigs";
        const res = await apiRequest(endpoint, {
          method,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.success) {
          toast.success(res.message);
          if (gigId) {
            setGigDetails(res?.data.data);
          } else {
            resetForm();
          }
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
        toast.error("Something went wrong");
      } finally {
        setSubmitting(false);
        setLoading(false);
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
    <>
      <Loader loading={loading} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" fontWeight={600} mb={2}>
          {`${gigDetails ? "Edit your Gig" : "Create a new Gig"}`}
        </Typography>
        <Typography variant="h5" fontWeight={400} mb={4}>
          {`${gigDetails ? "Enter the details to edit the gig" : "Enter the details to create the gig"}`}
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
                slotProps={{
                  input: {
                    inputProps: {
                      min: 0,
                    },
                    onKeyDown: (e: React.KeyboardEvent) => {
                      if (e.key === "-" || e.key === "e") {
                        e.preventDefault();
                      }
                    },
                  },
                }}
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
                slotProps={{
                  input: {
                    inputProps: {
                      min: 0,
                    },
                    onKeyDown: (e: React.KeyboardEvent) => {
                      if (e.key === "-" || e.key === "e") {
                        e.preventDefault();
                      }
                    },
                  },
                }}
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
                  value={
                    values.certification instanceof File
                      ? values.certification.name
                      : typeof values.certification === "object" &&
                          values.certification
                        ? values.certification.name
                        : ""
                  }
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
                    "& input": {
                      paddingRight: "32px !important",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
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

                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                )}

                {!values.certification && (
                  <input
                    ref={fileInputRef}
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
              {values.certification &&
                typeof values.certification === "object" &&
                "url" in values.certification && (
                  <Typography mt={1}>
                    <a
                      href={values.certification.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 14,
                        color: "#1976d2",
                        textDecoration: "underline",
                      }}
                    >
                      View document
                    </a>
                  </Typography>
                )}
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
                  Upload Gig Image
                  <Typography component="span" color="error" ml={0.5}>
                    *
                  </Typography>
                </Typography>

                <CustomTextField
                  name="gigImage"
                  value={
                    values.gigImage instanceof File
                      ? values.gigImage.name
                      : typeof values.gigImage === "object" && values.gigImage
                        ? values.gigImage.name
                        : ""
                  }
                  onChange={() => {}}
                  disabled
                  errorText={
                    touched.gigImage && errors.gigImage
                      ? (errors.gigImage as string)
                      : ""
                  }
                  isWithoutMargin
                  sx={{
                    "& .Mui-disabled": {
                      color: values.certification
                        ? "text.primary"
                        : "text.secondary",
                    },
                    "& input": {
                      paddingRight: "32px !important",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    },
                  }}
                />

                {!values.gigImage && (
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
                    <span>Upload your gig image</span>
                  </Box>
                )}

                {values.gigImage && (
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
                      setFieldValue("gigImage", null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                )}

                {!values.gigImage && (
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/*"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFieldValue("gigImage", file);
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

              {values.gigImage &&
                typeof values.gigImage === "object" &&
                "url" in values.gigImage && (
                  <Typography mt={1}>
                    <a
                      href={values.gigImage.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 14,
                        color: "#1976d2",
                        textDecoration: "underline",
                      }}
                    >
                      View image
                    </a>
                  </Typography>
                )}
            </Grid>

            <Grid size={{ xs: 12 }} className="mt-10">
              <CustomButton
                sx={{ width: { xs: "100%", md: "150px" } }}
                label={
                  isSubmitting
                    ? "Submitting..."
                    : gigDetails
                      ? "Edit Gig"
                      : "Create Gig"
                }
                variant="contained"
                type="submit"
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}
