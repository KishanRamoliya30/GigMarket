"use client";

import React, { useEffect, useState } from "react";
import SchoolIcon from "@mui/icons-material/School";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import { apiRequest } from "@/app/lib/apiCall";
import { Profile } from "@/app/utils/interfaces";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProfileNotFound from "../notFoundModals/ProfileNotFound";

const PublicProfile = () => {
  const [profileData, setProfileData] = useState<Profile | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = params.userId as string;
      try {
        const res = await apiRequest(
          `profile/userProfile/${userId}`,
          {
            method: "GET",
          },
          true
        );
        setProfileData(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profileData) {
    return <ProfileNotFound router={router} />;
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
    <div className="max-w-7xl mx-auto min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        <button
          className="flex items-center p-2 rounded-md gap-2 text-[#003322] font-semibold cursor-pointer mb-3 hover:bg-[#E8F5E9] transition-colors duration-200"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={fullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <PersonIcon className="text-gray-400 text-5xl" />
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-800">{fullName}</h1>
              <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-600">
                <span>{currentSchool}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">
                Professional Summary
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {professionalSummary}
              </p>
            </div>

            {/* Extracurricular Activities */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">
                Extracurricular Activities
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {extracurricularActivities}
              </p>
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Education</h2>
              <div className="mb-4">
                <p className="font-medium text-gray-800">
                  {degreeType} in {major}
                  {minor && (
                    <span className="text-gray-600"> (Minor: {minor})</span>
                  )}
                </p>
                <p className="text-gray-600">
                  {currentSchool} — Class of {graduationYear}
                </p>
              </div>

              {pastEducation.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Past Education
                  </h3>
                  {pastEducation.map((edu, idx) => (
                    <div key={idx} className="flex items-center mb-2">
                      <SchoolIcon className="text-green-500 mr-2" />
                      <span className="text-gray-600">
                        {edu.degree}, {edu.school} ({edu.year})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-50 text-green-500 rounded-full flex items-center"
                  >
                    <StarIcon className="w-4 h-4 mr-1 text-green-500" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-gray-800 text-white rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Certifications</h2>
              {certifications.length > 0 ? (
                <div className="space-y-2">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center">
                      <WorkspacePremiumIcon className="text-green-500 mr-2" />
                      <span className="text-gray-600">
                        {cert.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No certifications uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
