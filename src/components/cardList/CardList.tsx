import { Pagination } from "@/app/utils/interfaces";
import React from "react";
import CustomPagination from "./Pagination";

interface CardProps<T> {
  CardComponent: React.ComponentType<{ item: T }>;
  data: T[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

const CardList = <T,>({
  CardComponent,
  data,
  pagination,
  onPageChange,
}: CardProps<T>) => {
  return (
    <div className="flex flex-col justify-between items-center gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((item, index) => (
          <CardComponent key={index} item={item} />
        ))}
      </div>
      <CustomPagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default CardList;
