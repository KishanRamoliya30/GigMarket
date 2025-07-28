"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  Typography,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomTextField from "../customUi/CustomTextField";
import CustomButton from "../customUi/CustomButton";
import { toast } from "react-toastify";
import { apiRequest } from "@/app/lib/apiCall";
import { useUser } from "@/context/UserContext";
import CloseIcon from "@mui/icons-material/Close";
import { Profile } from "@/app/utils/interfaces";

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

interface ProfileFormCardProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  profileData?: Profile | null;
  isEdit?: boolean;
  onUpdate?: (updatedProfile: Profile) => void;
}

const ProfileFormCard: React.FC<ProfileFormCardProps> = ({
  open,
  setOpen,
  profileData,
  isEdit,
  onUpdate,
}) => {
  const [profilePreview, setProfilePreview] = useState<string | null>(
    profileData?.profilePicture || null
  );
  const [pastEducation, setPastEducation] = useState<
    { school: string; degree: string; year: string }[]
  >(profileData?.pastEducation || []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, setUserProfile } = useUser();
  const userId = user?._id;

  interface FileMeta {
    name: string;
    url: string;
    type?: string;
    size?: number;
  }

  const [certifications, setCertifications] = useState<File[]>([]);
  console.log("certifications123", certifications);

  useEffect(() => {
    if (
      profileData?.certifications &&
      Array.isArray(profileData.certifications)
    ) {
      const formatted = profileData.certifications.map((cert:any) => ({
        file: {
          name: cert.name || "",
          url: cert.url || "",
          type: cert.type || "application/pdf",
          size: cert.size || 0,
        },
      }));
      setCertifications(formatted);
    }
  }, [profileData?.certifications]);

  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files).map((file) => ({ file }));
      console.log("certifications123", fileArray);
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
      fullName: profileData?.fullName || "",
      profilePicture: profilePreview || "",
      professionalSummary: profileData?.professionalSummary || "",
      interests: profileData?.interests || [],
      extracurricularActivities: profileData?.extracurricularActivities || "",
      certifications: certifications,
      skills: profileData?.skills || [],
      currentSchool: profileData?.currentSchool || "",
      degreeType: profileData?.degreeType || "",
      major: profileData?.major || "",
      minor: profileData?.minor || "",
      graduationYear: profileData?.graduationYear || "",
      pastEducation: pastEducation || [],
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();
        if (userId) formData.append("userId", userId);
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

        // Profile picture
        if (fileInputRef.current?.files?.[0]) {
          formData.append("profilePicture", fileInputRef.current.files[0]);
        }

        // Certifications

        certifications.forEach((cert) => {
          if (cert.file instanceof File) {
            formData.append("certifications", cert.file);
          } else {
            formData.append("certifications", JSON.stringify(cert.file));
          }
        });

        const res = await apiRequest("profile", {
          method: "PUT",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });

        if ((res.ok || res.success) && res.data) {
          setUserProfile(res.data.profile);
          toast.success("Profile updated successfully");
          const refreshed = await apiRequest(`profile?userId=${userId}`, {
            method: "GET",
          });
          if (refreshed.ok && refreshed.data) {
            onUpdate?.(refreshed.data.profile);
          }
          setOpen(false);
        } else {
          toast.error(res.error || "Something went wrong.");
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
      <Button
        variant="contained"
        startIcon={<EditIcon />}
        onClick={() => setOpen(true)}
      >
        Create Profile
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{
          width: "100%",
          maxWidth: "700px",
          bgcolor: "#fff",
          borderRadius: 4,
          boxShadow: "3px",
          padding: "0",
          margin: "0 auto",
        }}
      >
        <DialogTitle>
          {isEdit ? "Edit Profile" : "Create Profile"}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            sx={{
              // minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // backgroundColor: "#f5f5f5",
            }}
          >
            <Box component="form" onSubmit={handleSubmit} width="100%">
              <Stack alignItems="center" spacing={1} mt={2} mb={3}>
                <Box position="relative">
                  <Avatar
                    src={profilePreview || ""}
                    sx={{ width: 100, height: 100 }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: -2,
                      right: -2,
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
                        InputProps={{ sx: { height: "44px" } }}
                        value={edu.year}
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
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "end", p: 2 }}>
          <CustomButton
            sx={{
              mt: 3,
              border: "1px solid",
              width: "150px",
              color: "error.main",
              backgroundColor: "#fff",
              borderColor: "error.main",
              ":hover": {
                backgroundColor: "#f5f5f5",
                borderColor: "error.main",
                border: "1px solid",
              },
            }}
            label="Cancel"
            onClick={() => setOpen(false)}
            variant="outlined"
          />

          <CustomButton
            type="submit"
            variant="contained"
            label={isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
            disabled={isSubmitting}
            onClick={() => handleSubmit()}
            sx={{ mt: 3, width: "150px" }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileFormCard;
