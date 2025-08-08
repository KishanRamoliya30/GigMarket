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
  wrappedStyle?: React.CSSProperties;
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
  wrappedStyle,
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
        className={`flex items-center px-[12px] py-[5px] shadow hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#388E3C] border-[1px] border-[#388E3C] rounded-lg text-[#388E3C] cursor-pointer ${isSelectTitle && "bg-emerald-50 border-0 outline-0 border-transparent"}`}
        onClick={() => handleValue(!openMenu)}
      >
        <span className="mr-2 text-sm">
          {isSelectTitle ? selectedOption : title?.toUpperCase()}
        </span>
        <ExpandMoreOutlined
          className={`w-5 h-5 transform transition-transform duration-200 ${openMenu ? "rotate-180" : ""}`}
        />
      </button>

      {openMenu && (
        <div
          className="absolute z-50 mt-2 bg-white rounded-md shadow-lg"
          style={{ top: "90%", ...(wrappedStyle as React.CSSProperties) }}
        >
          <div className="p-4 w-max border border-gray-100">
            {!isSelectTitle && (
              <h3 className="font-semibold text-gray-800 mb-3">
                Select {title}
              </h3>
            )}
            <div className="space-y-2">
              {options.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    value={opt}
                    checked={selectedOption === opt}
                    onChange={(e) => handleOptionChange(e.target.value)}
                    className="peer hidden"
                  />
                  <div className="w-4 h-4 rounded-full border-2 border-green-700 peer-checked:border-green-700 relative">
                    <div
                      className={`w-2 h-2 bg-green-700 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${selectedOption === opt ? "scale-100" : "scale-0"} transition-transform duration-150 ease-in-out`}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-800">{opt}</span>
                </label>
              ))}
              {rangeOption && selectedOption === rangeOption && (
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <div className="flex-1">
                    {setCustomMin && (
                      <input
                        type="number"
                        className="w-full px-3 py-2 text-sm border border-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
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
