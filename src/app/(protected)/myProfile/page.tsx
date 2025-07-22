"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  CircularProgress,
  IconButton,
  Paper,
} from "@mui/material";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import ProfileImageEditor from "@/components/profile/profileAvtarPopup";
import ProfileFormCard from "@/components/profile/profileFormsModal";
import { apiRequest } from "@/app/lib/apiCall";
import { useUser } from "@/context/UserContext";
import { Profile, Education, Certification } from "../../utils/interfaces";
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { capitalizeFirstLetter } from "../../../../utils/constants";

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children }) => (
  <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
      {icon}
      <Typography variant="h6">{title}</Typography>
    </Stack>
    {children}
  </Paper>
);

const ProfileViewCard: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();
  const userId = user?._id;

  const onEdit = () => {
    setOpen(true);
    setIsEdit(true);
  };

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

    if (userId) fetchProfile();
  }, [userId]);

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfileData(updatedProfile);
  };

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

  return (
    <Box sx={{ p: 4, background: "#fafaf5", minHeight: "100vh" }}>
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          position: "relative",
          mb: 4,
          backgroundColor: "#fff",
        }}
      >
        {/* Edit Button Top Right */}
        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
          <IconButton
            onClick={onEdit}
            sx={{
              // bgcolor: "#1dbf73",
              borderRadius: 1,
              border: "1px solid gray",
              px: 2,
              height: 36,
              "&:hover": {
                // bgcolor: "#1dbf73",
              },
            }}
          >
            <EditIcon sx={{ mr: 1, fontSize: 18 }} />
            <Typography variant="body2" fontWeight={600}>
              Edit Profile
            </Typography>
          </IconButton>
        </Box>

        {/* Profile Header Content */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar */}
          <div>
            <ProfileImageEditor avtar={profilePicture} userId={userId ?? ""} />
          </div>

          {/* Name and Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{fullName}</h2>

            <div className="flex items-center gap-1 mt-1 text-gray-600 text-sm">
              <PlaceOutlinedIcon className="!text-base text-gray-500" />
              <span>{currentSchool}</span>
            </div>
          </div>
        </div>
      </Paper>

      {open && (
        <ProfileFormCard
          isEdit={isEdit}
          open={open}
          setOpen={setOpen}
          profileData={profileData}
          onUpdate={handleProfileUpdate}
        />
      )}

      {/* Summary */}
      <SectionCard title="Professional Summary">
        <Typography color="text.secondary">{professionalSummary}</Typography>
      </SectionCard>

      {/* Skills & Interests */}
      <div className="mb-6 bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Skills & Interests</h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Skills Section */}
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-medium mb-2">Skills</h3>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string) => (
                  <div
                    key={skill}
                    className="flex items-center border border-gray-300 text-gray-700 text-sm px-3 py-1 rounded-md"
                  >
                    <StarIcon
                      className="!text-yellow-500 mr-1"
                      fontSize="small"
                    />

                    {capitalizeFirstLetter(skill)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills added.</p>
            )}
          </div>

          {/* Interests Section */}
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-medium mb-2">Interests</h3>
            {interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {interests.map((interest: string) => (
                  <div
                    key={interest}
                    className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-md font-medium"
                  >
                    {capitalizeFirstLetter(interest)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No interests added.</p>
            )}
          </div>
        </div>
      </div>

      {/* Education */}
      <SectionCard
        title="Education"
        icon={<SchoolOutlinedIcon color="primary" />}
      >
        <Paper
          sx={{ p: 2, backgroundColor: "#f0f6ff", borderRadius: 2, mb: 2 }}
        >
          <Typography fontWeight={600}>
            {degreeType} in {major}
            {minor && (
              <Typography component="span" fontWeight={400}>
                {" "}
                (Minor: {minor})
              </Typography>
            )}
          </Typography>
          <Typography color="text.secondary">
            {currentSchool} • Class of {graduationYear}
          </Typography>
        </Paper>

        {pastEducation.length > 0 && (
          <Box mt={1}>
            <Typography fontWeight={500} mb={1}>
              Previous Education
            </Typography>
            {pastEducation.map((edu: Education, idx: number) => (
              <Stack
                key={idx}
                direction="row"
                spacing={1}
                alignItems="center"
                mb={0.5}
              >
                <FiberManualRecordIcon sx={{ fontSize: 8, color: "gray" }} />
                <Box>
                  <Typography fontWeight={500}>{edu.degree}</Typography>
                  <Typography color="text.secondary">
                    {edu.school} • {edu.year}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Box>
        )}
      </SectionCard>

      {/* Extracurricular */}
      <SectionCard
        title="Extracurricular Activities"
        icon={<EmojiEventsOutlinedIcon color="primary" />}
      >
        <Typography color="text.secondary">
          {extracurricularActivities}
        </Typography>
      </SectionCard>

      {/* Certifications */}
      <SectionCard
        title="Certifications"
        icon={<VerifiedIcon color="primary" />}
      >
        {certifications.length > 0 ? (
          <Stack spacing={1}>
            {certifications.map((cert: Certification, idx: number) => (
              <Paper
                key={idx}
                sx={{
                  p: 2,
                  borderRadius: 1.5,
                  backgroundColor: "#e8f5e9",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <WorkspacePremiumIcon sx={{ mr: 1, color: "green" }} />
                <Typography>{cert.fileName || cert?.file?.fileName}</Typography>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary">
            No certifications uploaded
          </Typography>
        )}
      </SectionCard>
    </Box>
  );
};

export default ProfileViewCard;
