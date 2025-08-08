import React from "react";
import { Star, Award, MessageSquare, ExternalLink } from "lucide-react";
import { Gig } from "@/app/utils/interfaces";
import { useRouter } from "next/navigation";

const UserCard = ({ gigDetails }: { gigDetails: Gig }) => {
  const router = useRouter();
  return (
    <div className="bg-white rounded-md p-6 border border-gray-200 transition-shadow duration-300 max-w-sm min-w-[340px] w-full mx-auto">
      <div className="flex items-center space-x-4">
        <img
          src={gigDetails.createdBy.profilePicture}
          alt={gigDetails.createdBy.fullName}
          className="w-16 h-16 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() =>
            router.push(`/publicProfile/${gigDetails.createdBy._id}`)
          }
        />
        <div className="flex-1">
          <h2
            className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer transition-colors"
            onClick={() =>
              router.push(`/publicProfile/${gigDetails.createdBy._id}`)
            }
          >
            {gigDetails.createdBy.fullName}
          </h2>
          <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
            <ExternalLink size={14} />
            <span>{gigDetails.createdByRole}</span>
          </div>
          <div className="flex items-center mt-2 space-x-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium">
                {gigDetails.rating}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({gigDetails.reviews} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200 my-4" />

      <div className="space-y-4">
        <div>
          <h3 className="text-gray-800 font-semibold flex items-center mb-2">
            <Award className="w-4 h-4 mr-2" />
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {gigDetails.createdBy.skills &&
              gigDetails.createdBy.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="px-3 shadow py-1 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-full text-sm font-medium transition-colors"
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>

        <div>
          <h3 className="text-gray-800 font-semibold flex items-center mb-2">
            <Star className="w-4 h-4 mr-2" />
            Certifications
          </h3>
          <div className="flex flex-wrap gap-2">
            {gigDetails.createdBy.certifications &&
              gigDetails.createdBy.certifications
                .slice(0, 2)
                .map((cert, index) => (
                  <span
                    key={index}
                    className="px-3 shadow py-1 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-full text-sm font-medium transition-colors"
                  >
                    {cert?.fileName?.replace(".pdf", "")}
                  </span>
                ))}
          </div>
        </div>

        {gigDetails.createdByRole === "Provider" && (
          <button
           className="group relative w-fit flex items-center justify-center gap-2 px-8 py-2.5 bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] before:absolute before:inset-0 before:bg-white/10 before:rounded-xl before:opacity-0 before:transition hover:before:opacity-100 overflow-hidden cursor-pointer ml-auto mr-auto"
            onClick={() => router.push("/chat")}
          >
            <MessageSquare className="w-4 h-4 group-hover:animate-ping " />
            <span className="animate-draw">Contact</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
