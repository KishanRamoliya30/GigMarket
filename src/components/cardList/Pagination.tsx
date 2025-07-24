import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers: number[] = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-5">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`p-[3px] rounded-lg ${
          page === 1
            ? " text-gray-400 cursor-not-allowed"
            : " text-emerald-400 hover:bg-green-200 cursor-pointer"
        } border border-emerald-300 transition-colors duration-200`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-[10px] py-[1.3px] rounded-lg border border-emerald-300 hover:bg-green-200"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-[10px] py-[1.3px] rounded-lg border ${
            page === number
              ? "bg-emerald-500 text-white border-emerald-500 cursor-not-allowed"
              : "border-emerald-300 hover:bg-green-200 cursor-pointer"
          }`}
        >
          {number}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-[10px] py-[1.3px] rounded-lg border border-emerald-300 hover:bg-emerald-50"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`p-[3px] rounded-lg ${
          page === totalPages
            ? " text-gray-400 cursor-not-allowed"
            : " text-emerald-400 hover:bg-green-200 cursor-pointer"
        } border border-emerald-300 transition-colors duration-200`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CustomPagination;
