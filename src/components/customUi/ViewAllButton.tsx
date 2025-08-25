// app/components/ViewAllButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const ViewAllButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/providers")}
      className="mt-10 mx-auto flex items-center gap-2 rounded-full bg-green-100 px-6 py-2 text-green-600 font-semibold hover:bg-green-200 transition-colors cursor-pointer"
    >
      All Providers <ArrowRight className="w-4 h-4" />
    </button>
  );
};

export default ViewAllButton;
