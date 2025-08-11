"use client";
import { useUser } from "@/context/UserContext";

import UsersDispute from "@/components/dispute-management/UsersDispute";
import ProvidersDispute from "@/components/dispute-management/ProvidersDispute";


const DisputeManagement = () => {
  const {user} = useUser()
  const userRole = user?.role;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
    
      {userRole === "User"?<UsersDispute/>:<ProvidersDispute/>}


   
    </div>
  );
};

export default DisputeManagement;