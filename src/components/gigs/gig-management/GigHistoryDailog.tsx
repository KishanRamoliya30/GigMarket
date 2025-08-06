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
import {
  capitalizeFirstLetter,
  getStatusColor,
  getStatusDotColor,
} from "../../../../utils/constants";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
interface GigStatusDialogProps {
  open: boolean;
  onClose: () => void;
  data: GigData;
  updateGigData: (data: GigData) => void;
}
export default function GigStatusDialog({
  open,
  onClose,
  data,
  updateGigData,
}: GigStatusDialogProps) {
  const router = useRouter();
  const {user} = useUser();

  const redirectToGigDetail = () => {
  let route = "";

  if (user?._id === data.createdBy) {
    route = `/myGigs/${data._id}`;
  } else {
    route = `/gigs/${data._id}`;
  }

  router.push(route);
};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center border-b px-6 py-4">
        <span className="text-lg font-semibold text-gray-800">
          {data.title}
        </span>

        <div className="flex gap-2 items-center">
          <button
            onClick={redirectToGigDetail}
            className="cursor-pointer text-sm bg-[#2e7d32] text-white px-3 py-1 rounded hover:bg-[#2e7d32]"
          >
            View Gig
          </button>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box className="p-6">
          {/* Description */}
          <h2 className="text-sm font-semibold text-gray-600 mb-1">
            Description
          </h2>
          <Box className="text-sm text-gray-600 mb-4 leading-relaxed">
            {data.description}
          </Box>

          {/* Budget & Created */}
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

          {/* Status History */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-semibold text-gray-800">
              Status History
            </h3>
            <div className="max-w-full overflow-x-auto">
              <StatusDropdown data={data} updateGigData={updateGigData} />
            </div>
          </div>

          <Timeline className="pl-0">
            {data?.statusHistory?.map((item, index) => {
              const { previousStatus, currentStatus, changedByName, description, changedAt } =
                item;

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
                    <TimelineDot
                      style={{ background: getStatusDotColor(currentStatus) }}
                    />
                    {index !== data?.statusHistory?.length - 1 && (
                      <TimelineConnector />
                    )}
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
                      {capitalizeFirstLetter(
                        changedByName
                      )}{" "}
                      • {moment(changedAt).format("MMM DD, YYYY, hh:mm A")}
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
      </DialogContent>
    </Dialog>
  );
}
