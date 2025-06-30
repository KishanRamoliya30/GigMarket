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

import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import CustomTextField from "../customUi/CustomTextField";
import CustomButton from "../customUi/CustomButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const degreeTypes = ["Bachelor’s", "Master’s", "PhD", "Other"];
const graduationYears = Array.from({ length: 10 }, (_, i) => `${2025 + i}`);
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
  certifications: string[];
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
  certifications: [],
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
  // skills: Yup.array().of(Yup.string()).min(1, "At least one skill is required"),
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
        px: 2,
        py: 4,
        mt: "50px",
      }}
      
    >
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
            // handleSubmit,
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
                formRef.current?.requestSubmit();
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

                <CustomTextField
                  isRequired
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={values.fullName}
                  onChange={handleChange}
                  errorText={
                    touched.fullName && errors.fullName ? errors.fullName : ""
                  }
                />

                <CustomTextField
                  isRequired
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

                <CustomTextField
                  isRequired
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

                <CustomTextField
                  isRequired
                  fullWidth
                  label="Major"
                  name="major"
                  value={values.major}
                  onChange={handleChange}
                  errorText={touched.major && errors.major ? errors.major : ""}
                />

                <CustomTextField
                  isRequired
                  fullWidth
                  label="Minor"
                  name="minor"
                  value={values.minor}
                  onChange={handleChange}
                  errorText={touched.minor && errors.minor ? errors.minor : ""}
                />

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

                {/* ================= Biography ================= */}
                <Typography variant="h6" mt={3} mb={1}>
                  Biography
                </Typography>

                <CustomTextField
                  isRequired
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

                <Autocomplete
                  multiple
                  options={interestOptions}
                  value={values.interests}
                  onChange={(_, value) => setFieldValue("interests", value)}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      isRequired
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

                <CustomTextField
                  isRequired
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

                <FieldArray
                  name="certifications"
                  render={({ remove, push }) => (
                    <Box>
                      <Typography variant="subtitle1">
                        Certifications
                      </Typography>
                      {values.certifications.map((cert, index) => (
                        <Stack direction="row" spacing={1} key={index}>
                          <CustomTextField
                            value={cert}
                            onChange={(e) =>
                              setFieldValue(
                                `certifications[${index}]`,
                                e.target.value
                              )
                            }
                          />
                            <IconButton
                            aria-label="remove"
                            color="error"
                            onClick={() => remove(index)}
                            sx={{ mt: 1 }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Stack>
                      ))}
                      <Button onClick={() => push("")}>
                        Add Certification
                      </Button>
                    </Box>
                  )}
                />

                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
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

                <FieldArray
                  name="pastEducation"
                  render={({ push, remove }) => (
                    <Box>
                      <Typography variant="subtitle1">
                        Past Education
                      </Typography>
                      {values.pastEducation.map((edu, index) => (
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          key={index}
                        >
                          <CustomTextField
                            label="School"
                            value={edu.school}
                            onChange={(e) =>
                              setFieldValue(
                                `pastEducation[${index}].school`,
                                e.target.value
                              )
                            }
                          />
                          <CustomTextField
                            label="Degree"
                            value={edu.degree}
                            onChange={(e) =>
                              setFieldValue(
                                `pastEducation[${index}].degree`,
                                e.target.value
                              )
                            }
                          />
                          <CustomTextField
                            label="Year"
                            value={edu.year}
                            onChange={(e) =>
                              setFieldValue(
                                `pastEducation[${index}].year`,
                                e.target.value
                              )
                            }
                          />
                          <IconButton
                            aria-label="remove"
                            color="error"
                            onClick={() => remove(index)}
                            sx={{ mt: 1 }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Stack>
                      ))}
                      <Button
                        onClick={() =>
                          push({ school: "", degree: "", year: "" })
                        }
                        sx={{ mt: 2 }}
                        variant="outlined"
                      >
                        Add Past Education
                      </Button>
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
