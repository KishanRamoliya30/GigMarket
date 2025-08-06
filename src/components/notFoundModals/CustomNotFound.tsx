import { ArrowLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const CustomNotFound = ({
  title,
  desc,
  buttonX,
  icon,
}: {
  buttonX?: React.ReactNode;
  icon?: React.ReactNode;
  title: string;
  desc: string;
}) => {
  const navigation = useRouter();
  return (
    <div className="flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col justify-center items-center w-full max-w-xl bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-10 transform transition-all duration-500 hover:scale-102 hover:shadow-2xl backdrop-blur-sm bg-opacity-90">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-100 to-emerald-400 text-emerald-700 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="inline-flex justify-center items-center w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-full p-4 animate-bounce">
              {icon || <AlertCircle className="h-12 w-12 text-red-500" />}
            </div>
          </div>

          {title && (
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
              {title}
            </h2>
          )}
          {desc && (
            <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed max-w-md mx-auto">
              {desc}
            </p>
          )}
        </div>

        <div className="w-full flex justify-center items-center">
          {buttonX ? (
            buttonX
          ) : (
            <button
              className="group flex items-center px-8 py-4 rounded-full gap-3 text-white font-bold cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={() => navigation.back()}
            >
              <ArrowLeft className="h-6 w-6 transform group-hover:-translate-x-2 transition-transform duration-300 ease-in-out" />
              <span>Go Back</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomNotFound;
