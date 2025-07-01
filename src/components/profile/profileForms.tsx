"use client";
import React, { useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  Typography,
  Autocomplete,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { Formik, FieldArray, FieldArrayRenderProps } from "formik";
import * as Yup from "yup";
import CustomTextField from "../customUi/CustomTextField";
import CustomButton from "../customUi/CustomButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const degreeTypes = ["Bachelor’s", "Master’s", "PhD", "Other"];
const graduationYears = Array.from(
  { length: 2026 - 1950 },
  (_, i) => `${1950 + i}`
);
const interestOptions = ["Startups", "AI", "Mentoring", "Finance"];

interface EducationEntry {
  school: string;
  degree: string;
  year: string;
}

interface FormValues {
  fullName: string;
  profilePicture: string;
  professionalSummary: string;
  interests: string[];
  extracurricularActivities: string;
  certifications: { file: File | null }[];
  skills: string[];
  currentSchool: string;
  degreeType: string;
  major: string;
  minor?: string;
  graduationYear: string;
  pastEducation: EducationEntry[];
}

const initialValues: FormValues = {
  fullName: "",
  profilePicture: "",
  professionalSummary: "",
  interests: [],
  extracurricularActivities: "",
  certifications: [{ file: null }],
  skills: [],
  currentSchool: "",
  degreeType: "",
  major: "",
  minor: "",
  graduationYear: "",
  pastEducation: [],
};

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  profilePicture: Yup.string().required("Profile picture is required"),
  professionalSummary: Yup.string()
    .required("Professional Summary is required")
    .max(500, "Maximum 500 characters allowed"),
  interests: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least one interest"),
  extracurricularActivities: Yup.string().required("This field is required"),
  skills: Yup.array().of(Yup.string()).min(1, "At least one skill is required"),
  currentSchool: Yup.string().required("Current School is required"),
  degreeType: Yup.string().required("Degree Type is required"),
  major: Yup.string().required("Major is required"),
  minor: Yup.string().required("Minor is required"),
});

const ProfileFormCard = () => {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (
      field: string,
      value: unknown,
      shouldValidate?: boolean
    ) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfilePreview(imageData);
        setFieldValue("profilePicture", imageData);
      };
      reader.readAsDataURL(file);
    }
  };
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 100px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        width="100%"
        maxWidth={{ xs: "100%", md: "50%" }}
        bgcolor="#fff"
        borderRadius={4}
        boxShadow={3}
        mx={{ xs: "10px", sm: "50px" }}
        display="flex"
        flexDirection="column"
        p={{ xs: 2, sm: 4 }}
      >
        <Typography variant="h6" fontWeight={600} mb={1}>
          Create Profile
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => console.log("Form Submitted:", values)}
        >
          {({
            values,
            handleChange,
            setFieldValue,
            errors,
            touched,
            handleSubmit,
            validateForm,
            setTouched,
          }) => {
            const triggerFormSubmit = async () => {
              // Mark all fields as touched
              setTouched(
                Object.keys(initialValues).reduce(
                  (acc, key) => {
                    acc[key as keyof typeof initialValues] = true;
                    return acc;
                  },
                  {} as Record<string, boolean>
                )
              );

              const formErrors = await validateForm();
              if (Object.keys(formErrors).length === 0) {
                // formRef.current?.requestSubmit();
                handleSubmit()
              }
            };
            return (
              <Box
                component="form"
                ref={formRef}
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
                {/* Avatar Upload */}
                <Stack alignItems="center" spacing={1} mt={2} mb={3}>
                  <Box position="relative">
                    <Avatar
                      src={profilePreview || ""}
                      sx={{ width: 72, height: 72 }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: -5,
                        right: -5,
                        bgcolor: "white",
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                    />
                  </Box>
                  {touched.profilePicture && errors.profilePicture && (
                    <Typography color="error" fontSize="0.8rem">
                      {errors.profilePicture}
                    </Typography>
                  )}
                </Stack>

                {/* ================= Basic Information ================= */}
                <Typography variant="h6" mb={1}>
                  Basic Information
                </Typography>

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
                      isAstrick
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      value={values.fullName}
                      onChange={handleChange}
                      errorText={
                        touched.fullName && errors.fullName
                          ? errors.fullName
                          : ""
                      }
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <CustomTextField
                      isAstrick
                      fullWidth
                      label="Current School / University"
                      name="currentSchool"
                      value={values.currentSchool}
                      onChange={handleChange}
                      errorText={
                        touched.currentSchool && errors.currentSchool
                          ? errors.currentSchool
                          : ""
                      }
                    />
                  </Box>
                </Box>

                {/* ================= Biography ================= */}
                <Typography variant="h6" mt={3} mb={1}>
                  Biography
                </Typography>

                <CustomTextField
                  isAstrick
                  fullWidth
                  multiline
                  rows={3}
                  label="Professional Summary"
                  name="professionalSummary"
                  value={values.professionalSummary}
                  onChange={handleChange}
                  errorText={
                    touched.professionalSummary && errors.professionalSummary
                      ? errors.professionalSummary
                      : ""
                  }
                />

                <CustomTextField
                  isAstrick
                  fullWidth
                  multiline
                  rows={2}
                  label="Extracurricular Activities"
                  name="extracurricularActivities"
                  value={values.extracurricularActivities}
                  onChange={handleChange}
                  errorText={
                    touched.extracurricularActivities &&
                    errors.extracurricularActivities
                      ? errors.extracurricularActivities
                      : ""
                  }
                />

                <Autocomplete
                  multiple
                  options={interestOptions}
                  value={values.interests}
                  onChange={(_, value) => setFieldValue("interests", value)}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}                      
                      name="interests"
                      label="Interests"
                      margin="normal"
                      errorText={
                        touched.interests && errors.interests
                          ? (errors.interests as string)
                          : ""
                      }
                    />
                  )}
                />

                <FieldArray
                  name="certifications"
                  render={({ remove, push }: FieldArrayRenderProps) => (
                    <Box mt={4}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={2}
                      >
                        <Typography variant="h6">Certifications</Typography>

                        <Button
                          variant="outlined"
                          component="label"
                          size="small"
                        >
                          Upload Certifications
                          <input
                            type="file"
                            multiple
                            accept="application/pdf"
                            hidden
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                const fileArray = Array.from(files);
                                fileArray.forEach((file) => {
                                  push({ file });
                                });
                              }
                            }}
                          />
                        </Button>
                      </Stack>

                      {/* Only show if there are uploaded certificates */}
                      {values.certifications.length > 0 && (
                        <Box>
                          {values.certifications
                            .filter((cert) => cert.file)
                            .map((cert, index) => (
                              <Box
                                key={index}
                                sx={{
                                  border: "1px solid #ddd",
                                  borderRadius: 2,
                                  p: 2,
                                  mb: 2,
                                  backgroundColor: "#fafafa",
                                }}
                              >
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      flex: 1,
                                      wordBreak: "break-word",
                                      color: "text.secondary",
                                    }}
                                  >
                                    {cert.file?.name}
                                  </Typography>

                                  <IconButton
                                    aria-label="remove"
                                    color="error"
                                    onClick={() => remove(index)}
                                  >
                                    <DeleteOutlineIcon />
                                  </IconButton>
                                </Stack>
                              </Box>
                            ))}
                        </Box>
                      )}
                    </Box>
                  )}
                />

                <Autocomplete
                  multiple
                  freeSolo
                  options={["react", "node", "javascript", "python"]}
                  value={values.skills}
                  onChange={(_, val) => setFieldValue("skills", val)}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      label="Skills *"
                      margin="normal"
                      errorText={
                        touched.skills && errors.skills
                          ? (errors.skills as string)
                          : ""
                      }
                    />
                  )}
                />

                {/* ================= Education ================= */}
                <Typography variant="h6" mt={3} mb={1}>
                  Education
                </Typography>

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
                      isAstrick
                      fullWidth
                      label="Major"
                      name="major"
                      value={values.major}
                      onChange={handleChange}
                      errorText={
                        touched.major && errors.major ? errors.major : ""
                      }
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <CustomTextField
                      isAstrick
                      fullWidth
                      label="Minor"
                      name="minor"
                      value={values.minor}
                      onChange={handleChange}
                      errorText={
                        touched.minor && errors.minor ? errors.minor : ""
                      }
                    />
                  </Box>
                </Box>
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
                      isAstrick
                      select
                      fullWidth
                      label="Degree Type"
                      name="degreeType"
                      value={values.degreeType}
                      onChange={handleChange}
                      errorText={
                        touched.degreeType && errors.degreeType
                          ? errors.degreeType
                          : ""
                      }
                    >
                      {degreeTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <CustomTextField
                      select
                      fullWidth
                      label="Graduation Year"
                      name="graduationYear"
                      value={values.graduationYear}
                      onChange={handleChange}
                      errorText={
                        touched.graduationYear && errors.graduationYear
                          ? errors.graduationYear
                          : ""
                      }
                    >
                      {graduationYears.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Box>
                </Box>

                <FieldArray
                  name="pastEducation"
                  render={({ push, remove }) => (
                    <Box>
                        <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={2}
                      >
                        <Typography variant="h6">Past Education</Typography>

                        <Button
                          onClick={() =>
                            push({ school: "", degree: "", year: "" })
                          }
                          sx={{ mt: 2 }}
                          variant="outlined"
                        >
                          Add Past Education
                        </Button>
                      </Stack>
                      {values.pastEducation.map((edu, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 2,
                            mb: 2,
                            alignItems: "flex-start",
                          }}
                        >
                          <Box sx={{ flex: 1, width: "100%" }}>
                            <CustomTextField
                              fullWidth
                              label="School"
                              value={edu.school}
                              onChange={(e) =>
                                setFieldValue(
                                  `pastEducation[${index}].school`,
                                  e.target.value
                                )
                              }
                            />
                          </Box>

                          <Box sx={{ flex: 1, width: "100%" }}>
                            <CustomTextField
                              fullWidth
                              label="Degree"
                              value={edu.degree}
                              onChange={(e) =>
                                setFieldValue(
                                  `pastEducation[${index}].degree`,
                                  e.target.value
                                )
                              }
                            />
                          </Box>

                          <Box sx={{ flex: 1, width: "100%" }}>
                            <CustomTextField
                              fullWidth
                              label="Year"
                              value={edu.year}
                              onChange={(e) =>
                                setFieldValue(
                                  `pastEducation[${index}].year`,
                                  e.target.value
                                )
                              }
                            />
                          </Box>

                          <IconButton
                            aria-label="remove"
                            color="error"
                            onClick={() => remove(index)}
                            sx={{
                              alignSelf: { xs: "flex-start", sm: "center" },
                            }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Box>
                      ))}                     
                    </Box>
                  )}
                />

                <CustomButton
                  type="submit"
                  onClick={triggerFormSubmit}
                  variant="contained"
                  sx={{ mt: 3 }}
                  label="Save Changes"
                >
                  Save Change
                </CustomButton>
              </Box>
            );
          }}
        </Formik>
      </Box>
    </Box>
  );
};

export default ProfileFormCard;
