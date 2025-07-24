import { ArrowLeft, UserX } from "lucide-react";
import React from "react";

const ProfileNotFound = ({ router }: { router: { back: () => void } }) => {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 transform hover:scale-105 transition-transform duration-300">
        <button
          className="flex items-center p-2 rounded-md gap-2 text-[#003322] font-semibold cursor-pointer mb-3 hover:bg-[#E8F5E9] transition-colors duration-200"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back</span>
        </button>

        <div className="text-center space-y-4">
          <div className="inline-flex justify-center items-center w-20 h-20 bg-red-50 rounded-full">
            <UserX className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Profile Not Found
          </h2>
          <p className="text-red-500 text-lg font-medium">
            The requested profile could not be found
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileNotFound;
