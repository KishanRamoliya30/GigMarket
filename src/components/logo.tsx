import React from "react";

interface GigMarketLogoProps {
  textColor?: string;
  dotColor?: string;
  fontSize?: number;
}

const GigMarketLogo = ({
  textColor = "#404145", 
  dotColor = "#1dbf73",
  fontSize = 28,
}: GigMarketLogoProps) => {
  return (
    <svg
      width="200"
      height="40"
      viewBox="0 0 200 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0"
        y="25"
        fontFamily="'Segoe UI', sans-serif"
        fontSize={fontSize}
        fontWeight="bold"
        fill={textColor}
      >
        GigMarket
      </text>
      <circle cx="150" cy="22" r="4.5" fill={dotColor} />
    </svg>
  );
};

export default GigMarketLogo;
