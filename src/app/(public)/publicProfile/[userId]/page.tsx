import React from "react";
import PublicProfile from "@/components/profile/PublicProfile";
import PublicProviderGigs from "@/components/carousel/PublicProviderGigs";

const ProfileViewCard = () => {
  return (
    <div className="flex flex-col gap-2">
      <PublicProfile />
      <div className="px-2 sm:px-3 md:px-4 lg:px-5 w-full max-w-[1440px] mx-auto">
        <PublicProviderGigs />
      </div>
    </div>
  );
};

export default ProfileViewCard;
