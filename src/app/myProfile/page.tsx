"use client";

import { Box, Chip, Stack, Typography, Divider, Paper } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import StarIcon from "@mui/icons-material/Star";
import React from "react";
import Header from "@/components/user/header/Header";
import Footer from "@/components/user/footer/Footer";
import ProfileImageEditor from "@/components/profile/profileAvtarPopup";
import { profileData } from "../../../utils/constants";

const ProfileViewCard = () => {
  const {
    fullName,
    profilePicture,
    professionalSummary,
    extracurricularActivities,
    interests,
    certifications,
    skills,
    currentSchool,
    degreeType,
    major,
    minor,
    graduationYear,
    pastEducation,
  } = profileData;

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          p: 3,
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
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center" mb={4}>
            <ProfileImageEditor avtar={profilePicture} />
            <Box>
              <Typography variant="h5" fontWeight={600}>
                {fullName}
              </Typography>
              <Typography color="text.secondary">{currentSchool}</Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Summary Section */}
          <Typography variant="h6" gutterBottom>
            Professional Summary
          </Typography>
          <Typography color="text.secondary" mb={3}>
            {professionalSummary}
          </Typography>

          {/* Extracurricular */}
          <Typography variant="h6" gutterBottom>
            Extracurricular Activities
          </Typography>
          <Typography color="text.secondary" mb={3}>
            {extracurricularActivities}
          </Typography>

          {/* Interests */}
          <Typography variant="h6" gutterBottom>
            Interests
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" mb={3}>
            {interests.map((interest) => (
              <Chip key={interest} label={interest} color="primary" />
            ))}
          </Stack>

          {/* Skills */}
          <Typography variant="h6" gutterBottom>
            Skills
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" mb={3}>
            {skills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                variant="outlined"
                icon={<StarIcon fontSize="small" />}
              />
            ))}
          </Stack>

          {/* Education */}
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

          {/* Past Education */}
          {pastEducation.length > 0 && (
            <>
              <Typography variant="subtitle1" mb={1}>
                Past Education
              </Typography>
              {pastEducation.map((edu, idx) => (
                <Box key={idx} display="flex" alignItems="center" mb={1}>
                  <SchoolIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "#1976d2" }}
                  />
                  <Typography color="text.secondary">
                    {edu.degree}, {edu.school} ({edu.year})
                  </Typography>
                </Box>
              ))}
            </>
          )}

          {/* Certifications */}
          <Typography variant="h6" mt={4} mb={2}>
            Certifications
          </Typography>
          {certifications.length > 0 ? (
            certifications.map((cert, idx) => (
              <Box key={idx} display="flex" alignItems="center" mb={1}>
                <WorkspacePremiumIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "green" }}
                />
                <Typography color="text.secondary">{cert.name}</Typography>
              </Box>
            ))
          ) : (
            <Typography color="text.secondary">
              No certifications uploaded
            </Typography>
          )}
        </Paper>
      </Box>
      <Footer />
    </>
  );
};

export default ProfileViewCard;
