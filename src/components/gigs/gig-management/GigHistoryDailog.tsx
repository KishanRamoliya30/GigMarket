"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import moment from "moment";
import { GigData } from "@/app/utils/interfaces";
import StatusDropdown from "./GigStatus";
import { getStatusColor, getStatusDotColor } from "../../../../utils/constants";

interface GigStatusDialogProps {
  open: boolean;
  onClose: () => void;
  data: GigData;
}
export default function GigStatusDialog({
  open,
  onClose,
  data,
}: GigStatusDialogProps) {

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center border-b px-6 py-4">
        <span className="text-lg font-semibold text-gray-800">{data.title}</span>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="p-0">
        <Box className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Side */}
          <Box className="px-6 py-6">
            <h2 className="text-sm font-semibold text-gray-600 mb-1">
              Description
            </h2>
            <Box className="text-sm text-gray-600 mb-4 leading-relaxed">
              {data.description}
            </Box>

            <Box className="flex gap-8 text-sm mb-6">
              <Box>
                <p className="text-gray-500 font-medium">Budget</p>
                <p className="text-black font-semibold">${data.price}</p>
              </Box>
              <Box>
                <p className="text-gray-500 font-medium">Created</p>
                <p className="text-black font-semibold">
                  {moment(data.createdAt).format("MMM DD, YYYY")}
                </p>
              </Box>
            </Box>

            {/* Gig Progress Box */}
            <Box className="bg-gray-100 p-4 rounded-xl border">
              <Box className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-gray-800">Gig Progress</p>
              </Box>

              <Box className="mt-4 space-y-3">
                {["Open", "Requested"].map((status) => (
                  <Box
                    key={status}
                    className="flex items-start gap-3 bg-white p-3 rounded-lg border shadow-sm"
                  >
                    <Box className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold mt-1">
                      ✓
                    </Box>
                    <Box>
                      <p className="text-sm font-semibold text-gray-800">
                        {status}
                      </p>
                      <p className="text-xs text-gray-500">
                        Status: {status} <br />
                        Last updated:{" "}
                        {moment(data.updatedAt).format("MMM DD, YYYY")}
                      </p>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right Side - Status History */}
         <Box className="bg-gray-50 p-6 border-l">
  <h3 className="text-base font-semibold text-gray-800 mb-6">
    Status History
  </h3>

  <StatusDropdown data={data} />

  <Timeline className="pl-0">
    {data.statusHistory.map((item, index) => {
      const { previousStatus, currentStatus, changedByRole, description, changedAt } = item;
     
      return (
        <TimelineItem
          key={index}
          sx={{
            "&::before": {
              display: "none",
            },
          }}
        >
          <TimelineSeparator>
            <TimelineDot style={{ background: getStatusDotColor(currentStatus) }} />
            {index !== data.statusHistory.length - 1 && <TimelineConnector />}
          </TimelineSeparator>

          <TimelineContent className="pb-6">
            <Box className="text-sm font-medium text-gray-800">
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs mr-1 ${getStatusColor(
                  currentStatus
                )}`}
              >
                {currentStatus}
              </span>

              {previousStatus && (
                <span className="text-gray-400 text-xs">
                  from {previousStatus}
                </span>
              )}
            </Box>

            <p className="text-xs text-gray-500 mt-1">
              {changedByRole} • {moment(changedAt).format("MMM DD, YYYY, hh:mm A")}
            </p>

            <Box className="mt-2 bg-white p-3 rounded-lg shadow text-sm text-gray-800">
              {description || "No description provided."}
            </Box>
          </TimelineContent>
        </TimelineItem>
      );
    })}
  </Timeline>
</Box>

        </Box>
      </DialogContent>
    </Dialog>
  );
}
