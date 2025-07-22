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

interface GigStatusDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function GigStatusDialog({
  open,
  onClose,
}: GigStatusDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center border-b px-6 py-4">
        <span className="text-lg font-semibold text-gray-800">
          React Developer for E-commerce Website
        </span>
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
              Need an experienced React developer to build a modern e-commerce
              platform with payment integration and user authentication.
            </Box>

            <Box className="flex gap-8 text-sm mb-6">
              <Box>
                <p className="text-gray-500 font-medium">Budget</p>
                <p className="text-black font-semibold">$5,000</p>
              </Box>
              <Box>
                <p className="text-gray-500 font-medium">Created</p>
                <p className="text-black font-semibold">1/15/2024</p>
              </Box>
            </Box>

            {/* Gig Progress Box */}
            <Box className="bg-gray-100 p-4 rounded-xl border">
              <Box className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-gray-800">
                  Gig Progress
                </p>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                  In Progress
                </span>
              </Box>

              <Box className="relative w-full h-2 bg-gray-200 rounded overflow-hidden">
                <Box
                  className="absolute top-0 left-0 h-full bg-gray-900"
                  style={{ width: "75%" }}
                />
              </Box>
              <p className="text-xs mt-2 text-gray-500">Progress: 75%</p>

              <Box className="mt-4 space-y-3">
                {/* Open */}
                <Box className="flex items-start gap-3 bg-white p-3 rounded-lg border shadow-sm">
                  <Box className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold mt-1">
                    ✓
                  </Box>
                  <Box>
                    <p className="text-sm font-semibold text-gray-800">Open</p>
                    <p className="text-xs text-gray-500">
                      Gig is available for proposals <br /> Last updated:
                      1/15/2024
                    </p>
                  </Box>
                </Box>

                {/* Requested */}
                <Box className="flex items-start gap-3 bg-white p-3 rounded-lg border shadow-sm">
                  <Box className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold mt-1">
                    ✓
                  </Box>
                  <Box>
                    <p className="text-sm font-semibold text-gray-800">
                      Requested
                    </p>
                    <p className="text-xs text-gray-500">
                      Provider has submitted a proposal <br /> Last updated:
                      1/16/2024
                    </p>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Side - Status History */}
          <Box className="bg-gray-50 p-6 border-l">
            <h3 className="text-base font-semibold text-gray-800 mb-6">
              Status History
            </h3>

            <Timeline className="pl-0">
              {/* In Progress */}
              <TimelineItem
                sx={{
                  "&::before": {
                    display: "none",
                  },
                }}
              >
                <TimelineSeparator>
                  <TimelineDot style={{ background: "#facc15" }} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className="pb-6">
                  <Box className="text-sm font-medium text-gray-800">
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs mr-1">
                      In Progress
                    </span>
                    <span className="text-gray-400 text-xs">
                      from Requested
                    </span>
                  </Box>
                  <p className="text-xs text-gray-500 mt-1">
                    John Smith •{" "}
                    <span className="bg-gray-200 text-gray-800 rounded px-1">
                      client
                    </span>{" "}
                    • Jan 17, 2024, 09:15 AM
                  </p>
                  <Box className="mt-2 bg-white p-3 rounded-lg shadow text-sm text-gray-800">
                    Proposal accepted. Looking forward to working together!
                  </Box>
                </TimelineContent>
              </TimelineItem>

              {/* Requested */}
              <TimelineItem
                sx={{
                  "&::before": {
                    display: "none",
                  },
                }}
              >
                <TimelineSeparator>
                  <TimelineDot style={{ background: "#3b82f6" }} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className="pb-6">
                  <Box className="text-sm font-medium text-gray-800">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs mr-1">
                      Requested
                    </span>
                    <span className="text-gray-400 text-xs">from Open</span>
                  </Box>
                  <p className="text-xs text-gray-500 mt-1">
                    Sarah Wilson •{" "}
                    <span className="bg-gray-200 text-gray-800 rounded px-1">
                      provider
                    </span>{" "}
                    • Jan 16, 2024, 02:30 PM
                  </p>
                  <Box className="mt-2 bg-white p-3 rounded-lg shadow text-sm text-gray-800">
                    Submitted proposal with detailed timeline and portfolio
                  </Box>
                </TimelineContent>
              </TimelineItem>

              {/* Open */}
              <TimelineItem
                sx={{
                  "&::before": {
                    display: "none",
                  },
                }}
              >
                <TimelineSeparator>
                  <TimelineDot style={{ background: "#000000" }} />
                </TimelineSeparator>
                <TimelineContent>
                  <Box className="text-sm font-medium text-gray-800">
                    <span className="inline-block bg-gray-200 text-black px-2 py-0.5 rounded-full text-xs mr-1">
                      Open
                    </span>
                  </Box>
                  <p className="text-xs text-gray-500 mt-1">
                    John Smith •{" "}
                    <span className="bg-gray-200 text-gray-800 rounded px-1">
                      client
                    </span>{" "}
                    • Jan 15, 2024, 10:00 AM
                  </p>
                  <Box className="mt-2 bg-white p-3 rounded-lg shadow text-sm text-gray-800">
                    Initial gig posting
                  </Box>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
