import React, { useState, useEffect, useRef } from "react";
import { ExpandMoreOutlined } from "@mui/icons-material";

interface FilterDropDownProps {
  title: string;
  options: string[];
  selectedOption: string;
  onOptionChange: (value: string) => void;
  rangeOption?: string;
  customMin?: string;
  customMax?: string;
  setCustomMin?: (value: string) => void;
  setCustomMax?: (value: string) => void;
  isSelectTitle?: boolean;
}

const FilterDropDown: React.FC<FilterDropDownProps> = ({
  title,
  options,
  selectedOption,
  onOptionChange,
  rangeOption,
  customMin,
  customMax,
  setCustomMin,
  setCustomMax,
  isSelectTitle,
}) => {
  const [openMenu, setOpenMenu] = useState(Boolean);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleValue = (value: boolean) => {
    setOpenMenu(value);
  };

  const handleOptionChange = (value: string) => {
    onOptionChange(value);
    if (value !== rangeOption) {
      handleValue(false);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="flex relative flex-wrap items-center gap-2"
    >
      <button
        className="flex items-center px-4 py-[6px] hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-400 border-[1px] border-[#388E3C] rounded-lg text-[#388E3C] cursor-pointer"
        onClick={() => handleValue(!openMenu)}
      >
        <span className="mr-2">
          {isSelectTitle ? selectedOption : title?.toUpperCase()}
        </span>
        <ExpandMoreOutlined
          className={`w-5 h-5 transform transition-transform duration-200 ${openMenu ? "rotate-180" : ""}`}
        />
      </button>

      {openMenu && (
        <div
          className="absolute z-50 mt-2 bg-white rounded-md shadow-lg"
          style={{ top: "90%" }}
        >
          <div className="p-4 w-64 sm:w-72">
            <h3 className="font-semibold text-gray-800 mb-3">Select {title}</h3>
            <div className="space-y-2">
              {options.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    value={opt}
                    checked={selectedOption === opt}
                    onChange={(e) => handleOptionChange(e.target.value)}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 accent-green-600"
                  />
                  <span className="text-gray-700 font-medium">{opt}</span>
                </label>
              ))}
              {rangeOption && selectedOption === rangeOption && (
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <div className="flex-1">
                    {setCustomMin && (
                      <input
                        type="number"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={customMin}
                        onChange={(e) => setCustomMin(String(e.target.value))}
                        placeholder="Min ₹"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    {setCustomMax && (
                      <input
                        type="number"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={customMax}
                        onChange={(e) => setCustomMax(String(e.target.value))}
                        placeholder="Max ₹"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropDown;
