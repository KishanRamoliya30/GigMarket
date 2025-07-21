
"use client"
import { GIG_STATUS_CONFIG, GigStatus } from "../../../../utils/constants";
import { Badge } from "./Badge";


interface GigStatusBadgeProps {
  status: GigStatus;
  size?: "sm" | "default" | "lg";
}

export function GigStatusBadge({ status, size = "default" }: GigStatusBadgeProps) {
  const config = GIG_STATUS_CONFIG[status];
  
  return (
    <Badge
      variant="secondary"
      className={`inline-flex items-center gap-1 ${size === "sm" ? "text-xs px-2 py-1" : ""}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        borderColor: config.color
      }}
    >
      <div 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </Badge>
  );
}