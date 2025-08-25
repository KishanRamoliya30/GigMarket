import { apiRequest } from "@/app/lib/apiCall";
import { Profile } from "@/app/utils/interfaces";
import React from "react";
import CustomCarousel from "./CustomCarousel";
import ProviderCard from "@/app/providers/ProviderCard";
import ViewAllButton from "../customUi/ViewAllButton";


const LandingProviderProfiles = async () => {
   const res = await apiRequest<{
    profiles: Profile[];
    pagination: { total: number };
  }>("profile/allProfile", {
    method: "GET",
    params: { limit: 3, page: 1 },
  });

 const data: {
    profiles: Profile[];
    pagination: { total: number };
  } = res.ok ? res.data.data : { profiles: [], pagination: { total: 0 } };

  return (
   <div className="py-12 px-10">
      <CustomCarousel
        loading={false}
        data={data.profiles}
        CardComponent={ProviderCard}
        ViewAllButtonComponent={ViewAllButton}
        heading="Top Providers"
        subheading="Most viewed and all-time top-rated providers"
      />
    </div>
  );
};

export default LandingProviderProfiles;
