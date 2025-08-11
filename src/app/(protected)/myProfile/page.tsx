"use client";

import React, { useEffect, useState } from "react";
import {
  SchoolOutlined,
  WorkspacePremium,
  EmojiEventsOutlined,
  Verified,
  FiberManualRecord,
  Star,
  Edit,
  PlaceOutlined,
} from "@mui/icons-material";
import ProfileImageEditor from "@/components/profile/profileAvtarPopup";
import ProfileFormCard from "@/components/profile/profileFormsModal";
import { apiRequest } from "@/app/lib/apiCall";
import { useUser } from "@/context/UserContext";
import { Profile} from "../../utils/interfaces";
import { capitalizeFirstLetter } from "../../../../utils/constants";

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children }) => (
  <div className="bg-white p-6 mb-6 rounded-xl shadow-sm">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    {children}
  </div>
);

const ProfileViewCard: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [stripeData, setStripeData] = useState<{stripeConnectAccountId:string,
stripeConnectAccountStatus:string
  } | null>({ stripeConnectAccountId: "", stripeConnectAccountStatus: "" });
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();
  const userId = user?._id;

  const onEdit = () => {
    setOpen(true);
    setIsEdit(true);
  };

  const createStripeConnectAccount = async () => {
    const res = await apiRequest("payment/create-stripe-connect-profile", {
      method: "POST",
    })
    if (res.ok) {
      window.open(res.data.data.url, '_blank');
    } else {
      console.error("Failed to create Stripe Connect account:", res.message);
    }
  }
   
  const loginStripe = async () => {
    const res = await apiRequest("payment/create-login-link", {
      method: "POST",
    });
    if (res.ok) {
      window.open(res.data.data.url, '_blank');
    } else {
      console.error("Failed to create Stripe login link:", res.message);
    }
  }
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [res1, res2] = await Promise.all([
          apiRequest(`profile?userId=${userId}`, {
            method: "GET",
          }),
          apiRequest(`payment/get-stripe-connect-details`, {
            method: "GET",
          }),
        ]);
        const [res, resConnect] = await Promise.all([res1, res2]);
        setProfileData(res.data?.profile);
        if (resConnect.ok) {
          const { stripeConnectAccountId, stripeConnectAccountStatus } =
            resConnect.data.data;
          setStripeData({
            stripeConnectAccountId,
            stripeConnectAccountStatus,
          });
        }
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
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        Profile not found
      </div>
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
   <div className="relative bg-[#fafaf5] min-h-screen p-6">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <button
          onClick={onEdit}
          className="absolute cursor-pointer top-12 right-10 flex items-center text-sm border border-gray-300 px-3 py-1.5 rounded hover:shadow"
        >
          <Edit fontSize="small" className="mr-1" />
          <span className="font-semibold">Edit Profile</span>
        </button>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <ProfileImageEditor avtar={profilePicture} userId={userId ?? ""} />
          <div>
            <h2 className="text-2xl font-bold">{fullName}</h2>
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <PlaceOutlined className="text-base text-gray-500" />
              <span>{currentSchool}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {open && (
        <ProfileFormCard
          isEdit={isEdit}
          open={open}
          setOpen={setOpen}
          profileData={profileData}
          onUpdate={handleProfileUpdate}
        />
      )}

      <SectionCard title="Stripe Connect">
        <div className="bg-white border border-gray-200 p-5 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-700 break-all">
              <span className="font-medium">Account ID:</span>
              <span className="text-gray-800 font-semibold">
                {stripeData?.stripeConnectAccountId}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-500">Status:</span>
              <span
                className={`inline-block px-3 py-1 rounded-full font-semibold text-xs ${
                  stripeData?.stripeConnectAccountStatus === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {stripeData?.stripeConnectAccountStatus ?? "PENDING"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap sm:items-center sm:justify-between gap-3 pt-2">
            {["PENDING", "NEEDS_ONBOARDING"].includes(
              stripeData?.stripeConnectAccountStatus ?? "PENDING"
            ) && (
              <button
                onClick={createStripeConnectAccount}
                className="px-4 py-2 rounded-md text-sm font-semibold text-gray-700 border border-gray-300 hover:bg-gray-100 transition-all shadow hover:shadow-md cursor-pointer"
              >
                Complete Onboarding
              </button>
            )}

            {stripeData?.stripeConnectAccountStatus == "ACTIVE" && (
              <div className="sm:ml-auto">
                <button
                  onClick={loginStripe}
                  className="px-4 py-2 rounded-md text-sm font-semibold text-gray-700 border border-gray-300 hover:bg-gray-100 transition-all shadow hover:shadow-md cursor-pointer"
                >
                  Login to Stripe Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Summary */}
      <SectionCard title="Professional Summary">
        <p className="text-gray-700">{professionalSummary}</p>
      </SectionCard>

      {/* Skills & Interests */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Skills & Interests</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Skills */}
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-medium mb-2">Skills</h3>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center border border-gray-300 text-sm px-3 py-1 rounded text-gray-700"
                  >
                    <Star className="text-yellow-500 mr-1" fontSize="small" />
                    {capitalizeFirstLetter(skill)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills added.</p>
            )}
          </div>

          {/* Interests */}
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-medium mb-2">Interests</h3>
            {interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <div
                    key={interest}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium"
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
      <SectionCard title="Education" icon={<SchoolOutlined className="text-blue-500" />}>
        <div className="bg-blue-50 p-4 rounded-lg mb-2">
          <p className="font-semibold">
            {degreeType} in {major}
            {minor && <span className="font-normal"> (Minor: {minor})</span>}
          </p>
          <p className="text-gray-600">
            {currentSchool} • Class of {graduationYear}
          </p>
        </div>

        {pastEducation.length > 0 && (
          <div>
            <p className="font-medium mb-2">Previous Education</p>
            {pastEducation.map((edu, idx) => (
              <div key={idx} className="flex items-start gap-2 mb-1">
                <FiberManualRecord className="text-gray-400 !text-xs mt-1" />
                <div>
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-gray-600">
                    {edu.school} • {edu.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Extracurricular */}
      <SectionCard title="Extracurricular Activities" icon={<EmojiEventsOutlined className="text-blue-500" />}>
        <p className="text-gray-700">{extracurricularActivities}</p>
      </SectionCard>

      {/* Certifications */}
      <SectionCard title="Certifications" icon={<Verified className="text-blue-500" />}>
        {certifications?.length > 0 ? (
          <div className="flex flex-col gap-2">
            {certifications?.map((cert, idx) => (
              <div
                key={idx}
                className="flex items-center bg-green-50 p-3 rounded-lg text-sm"
              >
                <WorkspacePremium className="text-green-600 mr-2" />
                <span>{cert?.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No certifications uploaded</p>
        )}
      </SectionCard>
    </div>
  );
};

export default ProfileViewCard;
