import { Column } from "@/app/utils/interfaces";
import Link from "next/link";
import React from "react";
import { addEllipsis } from "../../../utils/common";
import { useRouter } from "next/navigation";
import { getStatusStyles } from "../../../utils/constants";
import { IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { ArrowRight } from "lucide-react";

interface Raw {
  _id: string | number;
  [key: string]: string | number | boolean | undefined | [];
}

interface CustomeTableProps {
  raws: Raw[] | any[];
  columns: Column[];
  handleBidStatusChange?: (
    id: string,
    status: "Assigned" | "Not-Assigned"
  ) => void;
  openChatModal?: (userId: string) => void;
}

const CustomeTable = ({
  raws,
  columns,
  handleBidStatusChange,
  openChatModal
}: CustomeTableProps) => {
  const router = useRouter();

  const handleCellValue = (raw: any, column: Column): React.ReactNode => {
    const value = raw[column.key as keyof typeof raw];
    switch (column.type) {
      case "user":
        const { profilePicture, fullName, _id } = value;
        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/publicProfile/" + _id)}
          >
            <img
              src={profilePicture}
              alt={fullName}
              className="w-9 h-9 rounded-full object-cover"
            />
            <span className="text-sm sm:text-base font-medium cursor-pointer">
              {fullName}
            </span>
          </div>
        );

      case "amount":
        return (
          <div className="font-extrabold text-gray-800">${value} / hr</div>
        );

      case "boolean":
        return (
          <div className={value ? "text-green-400" : "text-red-400"}>
            {value ? "Yes" : "No"}
          </div>
        );

      case "date":
        return (
          <div className="">
            {new Date(value).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        );

      case "link":
        if (!column.href || !value) return value;
        return (
          <Link
            href={`${column.href}${value}`}
            className={`${column.class} p-[5px] m-[-5px]`}
          >
            <div className="w-fit px-4 py-2 flex items-center justify-center gap-1 rounded-2xl bg-emerald-50 shadow-sm cursor-pointer hover:scale-[1.02] transition-all duration-300 group">
              <span className="text-sm tracking-wide">View</span>
              <ArrowRight
                className="transition-transform duration-300 group-hover:translate-x-1"
                size={16}
              />
            </div>
          </Link>
        );

      case "bidStatus":
        return value == "Requested" || !value ? (
          <div className="flex flex-row items-center gap-2">
            <button
              className="px-2.5 py-1.5 hover:shadow text-[13px] border border-emerald-600 text-emerald-700 hover:bg-green-50 rounded-md transition-colors duration-200 cursor-pointer"
              onClick={() =>
                handleBidStatusChange &&
                handleBidStatusChange(raw._id, "Assigned")
              }
            >
              APPROVE
            </button>
            <button
              className="px-2.5 py-1.5 hover:shadow text-[13px] border border-red-500 text-red-500 hover:bg-red-50 rounded-md transition-colors duration-200 cursor-pointer"
              onClick={() =>
                handleBidStatusChange &&
                handleBidStatusChange(raw._id, "Not-Assigned")
              }
            >
              REJECT
            </button>
          </div>
        ) : (
          <div
            className={`inline-flex items-center shadow px-2.5 py-1 rounded-full text-xs sm:text-sm border ${
              value === "Assigned"
                ? "border-green-500 text-green-500 bg-green-50"
                : value === "Not-Assigned"
                  ? "border-red-500 text-red-500 bg-red-50"
                  : "border-gray-500 text-gray-500 bg-gray-50"
            }`}
            style={getStatusStyles(value) as React.CSSProperties}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </div>
        );

      case "chat":
        return (
          <IconButton aria-label="chat" onClick={() => openChatModal?.(raw.createdBy._id)}>
            <ChatIcon />
          </IconButton>
        );

      default:
        return typeof value === "string" ? addEllipsis(value, 35) : value;
    }
  };

  return (
    <div className="overflow-x-auto dark:shadow-md">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-gray-200 dark:border-transparent rounded-md ">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 ">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {columns.map((column) => {
                  return (
                    <th
                      key={column.id}
                      scope="col"
                      className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-300 tracking-wider"
                    >
                      {column.label.charAt(0).toUpperCase() +
                        column.label.slice(1).toLowerCase()}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
              {raws.map((raw) => (
                <tr
                  key={raw._id}
                  className="hover:bg-gray-600 dark:hover:bg-gray-700"
                >
                  {columns.map((column) => {
                    return (
                      <td
                        key={column.id}
                        className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-600 break-words"
                      >
                        {handleCellValue(raw, column)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomeTable;
