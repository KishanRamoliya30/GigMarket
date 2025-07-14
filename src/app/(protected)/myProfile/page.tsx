"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  Stack,
  Typography,
  Divider,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import StarIcon from "@mui/icons-material/Star";
import ProfileImageEditor from "@/components/profile/profileAvtarPopup";
import { apiRequest } from "@/app/lib/apiCall";
import { Profile } from "../../utils/interfaces";
import { useUser } from "@/context/UserContext";
import EditIcon from "@mui/icons-material/Edit";
import ProfileFormCard from "@/components/profile/profileFormsModal";

const ProfileViewCard = () => {
  const [open, setOpen] = useState(false);
  const [isEdit , setIsEdit] = useState<boolean>(false);
  const onEdit = () => {
    setOpen(true);
    setIsEdit(true);
  };
  const [profileData, setProfileData] = useState<Profile | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();
  const userId = user?._id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiRequest(`profile?userId=${userId}`, {
          method: "GET",
        });
        setProfileData(res.data?.profile);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!profileData) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography color="error">Profile not found</Typography>
      </Box>
    );
  }

  const {
    fullName,
    profilePicture,
    professionalSummary,
    extracurricularActivities,
    interests = [],
    certifications = [],
    skills = [],
    currentSchool,
    degreeType,
    major,
    minor,
    graduationYear,
    pastEducation = [],
  } = profileData;
const handleProfileUpdate = (updatedProfile: Profile) => {
  setProfileData(updatedProfile);
};
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          p: 3,
          pt:12,
          backgroundColor: "#f7f9fc",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            maxWidth: 900,
            width: "100%",
            borderRadius: 4,
            p: 4,
            background: "#fff",
            position: "relative",
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center" mb={4}>
            <ProfileImageEditor avtar={profilePicture} userId={userId ?? ""} />
            <Box>
              <Typography variant="h5" fontWeight={600}>
                {fullName}
              </Typography>
              <Typography color="text.secondary">{currentSchool}</Typography>
            </Box>
            <Tooltip title="Edit Profile" placement="top">
            <IconButton
              sx={{
                position: "absolute",
                top: "71px",
                right: "20px",
                bgcolor: "#fffgy",
                boxShadow: 1,
                ":hover": { bgcolor: "#fff" },
              }}
              onClick={onEdit}
              size="small"
            >
              <EditIcon />
            </IconButton>
            </Tooltip>
          </Stack>

          {open && <ProfileFormCard isEdit={isEdit} open={open} setOpen={setOpen} profileData={profileData}  onUpdate={handleProfileUpdate} />}

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" gutterBottom>
            Professional Summary
          </Typography>
          <Typography color="text.secondary" mb={3}>
            {professionalSummary}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Extracurricular Activities
          </Typography>
          <Typography color="text.secondary" mb={3}>
            {extracurricularActivities}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Interests
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" mb={3}>
            {interests.map((interest: string) => (
              <Chip key={interest} label={interest} color="primary" />
            ))}
          </Stack>

          <Typography variant="h6" gutterBottom>
            Skills
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" mb={3}>
            {skills.map((skill: string) => (
              <Chip
                key={skill}
                label={skill}
                variant="outlined"
                icon={<StarIcon fontSize="small" />}
              />
            ))}
          </Stack>

          <Typography variant="h6" gutterBottom>
            Education
          </Typography>
          <Box mb={2}>
            <Typography fontWeight={500}>
              {degreeType} in {major}{" "}
              {minor && (
                <Typography component="span" fontWeight={400}>
                  (Minor: {minor})
                </Typography>
              )}
            </Typography>
            <Typography color="text.secondary">
              {currentSchool} — Class of {graduationYear}
            </Typography>
          </Box>

          {pastEducation.length > 0 && (
            <>
              <Typography variant="subtitle1" mb={1}>
                Past Education
              </Typography>
              {pastEducation.map(
                (
                  edu: { degree: string; school: string; year: string },
                  idx: number
                ) => (
                  <Box key={idx} display="flex" alignItems="center" mb={1}>
                    <SchoolIcon
                      fontSize="small"
                      sx={{ mr: 1, color: "#1976d2" }}
                    />
                    <Typography color="text.secondary">
                      {edu.degree}, {edu.school} ({edu.year})
                    </Typography>
                  </Box>
                )
              )}
            </>
          )}

          <Typography variant="h6" mt={4} mb={2}>
            Certifications
          </Typography>
          {certifications.length > 0 ? (
            certifications.map(
              (
                cert: { fileName: string; file: { fileName: string } },
                idx: number
              ) => (
                <Box key={idx} display="flex" alignItems="center" mb={1}>
                  <WorkspacePremiumIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "green" }}
                  />
                  <Typography color="text.secondary">
                    {cert.fileName || cert.file?.fileName}
                  </Typography>
                </Box>
              )
            )
          ) : (
            <Typography color="text.secondary">
              No certifications uploaded
            </Typography>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default ProfileViewCard;
