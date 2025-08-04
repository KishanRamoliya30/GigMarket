import { Column } from "@/app/utils/interfaces";
import Link from "next/link";
import React from "react";
import { addEllipsis } from "../../../utils/common";

interface Raw {
  _id: string | number;
  [key: string]: string | number | boolean | undefined | [];
}

interface CustomeTableProps {
  raws: Raw[] | any[];
  columns: Column[];
}

const CustomeTable = ({ raws, columns }: CustomeTableProps) => {
  const handleCellValue = (
    value: string | boolean | number | undefined | [],
    column: Column
  ): React.ReactNode => {
    switch (column.type) {
      case "boolean":
        return (
          <div className={value ? "text-green-400" : "text-red-400"}>
            {value ? "Yes" : "No"}
          </div>
        );

      case "link":
        if (!column.href) return value;
        return (
          <Link
            href={`${column.href}${value}`}
            className={`${column.class} p-[5px] m-[-5px]`}
          >
            {value}
          </Link>
        );

      default:
        return typeof value === "string" ? addEllipsis(value, 30) : value;
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
                      {column.name.charAt(0).toUpperCase() +
                        column.name.slice(1).toLowerCase()}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
              {raws.map((raw) => (
                <tr
                  key={raw._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {columns.map((column) => {
                    const value = raw[column.name as keyof typeof raw];
                    return (
                      <td
                        key={column.id}
                        className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-100 break-words"
                      >
                        {handleCellValue(value, column)}
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
