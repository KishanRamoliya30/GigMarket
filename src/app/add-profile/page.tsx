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
import { useFormik } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";
import { apiRequest } from "@/app/lib/apiCall";
import { useUser } from "@/context/UserContext";
import CloseIcon from "@mui/icons-material/Close";
import CustomTextField from "@/components/customUi/CustomTextField";
import CustomButton from "@/components/customUi/CustomButton";
import { useRouter } from "next/navigation";
import Header from "@/components/user/header/Header";
import Footer from "@/components/user/footer/Footer";

const degreeTypes = ["Bachelor’s", "Master’s", "PhD", "Other"];
const graduationYears = Array.from(
  { length: 2026 - 1950 },
  (_, i) => `${1950 + i}`
);
const interestOptions = ["Startups", "AI", "Mentoring", "Finance"];

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  profilePicture: Yup.string().required("Profile picture is required"),
  professionalSummary: Yup.string()
    .required("Professional Summary is required")
    .max(500),
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

const Profile = () => {
  const route = useRouter();
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [pastEducation, setPastEducation] = useState<
    { school: string; degree: string; year: string }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, redirectUrl, setRedirectUrl } = useUser();
  const userId = user?._id;
  const [certifications, setCertifications] = useState<{ file: File }[]>([]);

  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files).map((file) => ({ file }));
      setCertifications((prev) => [...prev, ...fileArray]);
    }
  };

  const handleCertRemove = (index: number) => {
    setCertifications((prev) => prev.filter((_, i) => i !== index));
  };
  const handleAddEducation = () => {
    setPastEducation((prev) => [...prev, { school: "", degree: "", year: "" }]);
  };

  const handleRemoveEducation = (index: number) => {
    setPastEducation((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEducationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setPastEducation((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const formik = useFormik({
    initialValues: {
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
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();

        formData.append("userId", userId || "");
        formData.append("fullName", values.fullName);
        formData.append("professionalSummary", values.professionalSummary);
        formData.append("interests", JSON.stringify(values.interests));
        formData.append(
          "extracurricularActivities",
          values.extracurricularActivities
        );
        formData.append("skills", JSON.stringify(values.skills));
        formData.append("currentSchool", values.currentSchool);
        formData.append("degreeType", values.degreeType);
        formData.append("major", values.major);
        formData.append("minor", values.minor);
        formData.append("graduationYear", values.graduationYear);
        formData.append("pastEducation", JSON.stringify(pastEducation));

        // Append profile picture
        const file = fileInputRef.current?.files?.[0];
        if (file) {
          formData.append("profilePicture", file);
        }

        // Append certification metadata and files
        // formData.append(
        //   "certifications",
        //   JSON.stringify(
        //     certifications.map((cert) => ({
        //       file: { name: cert.file?.name },
        //     }))
        //   )
        // );

        // certifications.forEach((cert, index) => {
        //   formData.append(`certifications[${index}].file`, cert.file);
        // });
        certifications.forEach(cert => {
  if (cert.file instanceof File) {
    formData.append("certifications", cert.file);
  }
});

        const res = await apiRequest("profile", {
          method: "POST",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.ok && res.data) {
          toast.success("Profile created successfully");
          let redirectPath = "/dashboard";
          if (redirectUrl) {
            redirectPath = redirectUrl;
            setRedirectUrl("");
          } 
          route.push(redirectPath);
        } else {
          toast.error(res.error || "Something went wrong");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message || "Submission failed");
        } else {
          toast.error("Submission failed");
        }
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
    setFieldValue,
    isSubmitting,
  } = formik;

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

  return (
    <>
      <Header />
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            background:
              "linear-gradient(270deg, #0f2027, #203a43, #2c5364, #1a1f2b)",
            backgroundSize: "800% 800%",
            animation: "gradientShift 20s ease infinite",
          }}
        >
          <Box
            sx={{
              margin: "127px 0",
              // minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "30px 60px",
              width: "800px",
              backgroundColor: "#f5f5f5",
              borderRadius: 4,
            }}
          >
            <Box component="form" onSubmit={handleSubmit} width="100%">
              <Stack alignItems="center" spacing={1} mt={2} mb={3}>
                <Box position="relative">
                  <Avatar
                    src={profilePreview || ""}
                    sx={{ width: "150px", height: "150px" }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
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
                      touched.fullName && errors.fullName ? errors.fullName : ""
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

              <Box mt={3}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Typography variant="h6">Certifications</Typography>
                  <Button variant="outlined" component="label" size="small">
                    Upload Certifications
                    <input
                      type="file"
                      multiple
                      accept="application/pdf"
                      hidden
                      onChange={handleCertUpload}
                    />
                  </Button>
                </Stack>

                {certifications.length > 0 && (
                  <Box>
                    {certifications
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
                              {cert.file.name}
                            </Typography>
                            <IconButton
                              aria-label="remove"
                              // color="error"
                              onClick={() => handleCertRemove(index)}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Stack>
                        </Box>
                      ))}
                  </Box>
                )}
              </Box>

              <Autocomplete
                multiple
                freeSolo
                options={["react", "node", "javascript", "python"]}
                value={values.skills}
                onChange={(_, val) => setFieldValue("skills", val)}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    isAstrick
                    label="Skills"
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
              <Box mt={3}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Typography variant="h6">Past Education</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleAddEducation}
                  >
                    Add
                  </Button>
                </Stack>

                {pastEducation.map((edu, index) => (
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
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <CustomTextField
                        fullWidth
                        label="School"
                        value={edu.school}
                        onChange={(e) =>
                          handleEducationChange(index, "school", e.target.value)
                        }
                      />
                      <CustomTextField
                        fullWidth
                        label="Degree"
                        value={edu.degree}
                        onChange={(e) =>
                          handleEducationChange(index, "degree", e.target.value)
                        }
                      />
                      <CustomTextField
                        select
                        fullWidth
                        label="Year"
                        value={edu.year}
                        InputProps={{ sx: { height: "44px" } }}
                        onChange={(e) =>
                          handleEducationChange(index, "year", e.target.value)
                        }
                      >
                        {graduationYears.map((year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                      <IconButton
                        aria-label="remove"
                        // color="error"
                        onClick={() => handleRemoveEducation(index)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Stack>
                  </Box>
                ))}
              </Box>
              <CustomButton
                type="submit"
                variant="contained"
                fullWidth
                label={isSubmitting ? "Saving..." : "Create"}
                disabled={isSubmitting}
                onClick={() => handleSubmit()}
                sx={{ mt: 6 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Profile;
