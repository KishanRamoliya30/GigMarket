"use client";

import { apiRequest } from "@/app/lib/apiCall";
import { GigData } from "@/app/utils/interfaces";
import CustomTextField from "@/components/customUi/CustomTextField";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "@/context/UserContext";
import PostGigReviewDialog from "./Ratings";

interface StatusDropdownProps {
  data: GigData;
  updateGigData: (data: GigData) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ data, updateGigData }) => {
  const [selectedStatus, setSelectedStatus] = useState(data.status);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const role = user?.role;

  type StatusOption = {
    label: string;
    disabled: boolean;
  };

  const getStatusOptions = (): StatusOption[] => {
    const userStatuses = [
      "Open",
      "Assigned",
      "Not-Assigned",
      "Approved",
      "Rejected",
    ];
    const providerStatuses = ["Requested", "In-Progress", "Completed"];

    const allStatuses = [...userStatuses, ...providerStatuses];

    const statusTransitions: Record<string, string[]> = {
      Open: ["Requested"],
      Requested: ["Assigned", "Not-Assigned"],
      Assigned: ["In-Progress"],
      "In-Progress": ["Completed"],
      Completed: ["Approved", "Rejected"],
      Approved: [],
      Rejected: [],
      "Not-Assigned": [],
    };

    const allowedNextStatuses = statusTransitions[selectedStatus || ""] || [];

    let baseOptions: string[] =
      role === "User" ? userStatuses : providerStatuses;

    if (
      selectedStatus &&
      !baseOptions.includes(selectedStatus) &&
      allStatuses.includes(selectedStatus)
    ) {
      baseOptions = [selectedStatus, ...baseOptions];
    }

    const seen = new Set<string>();
    return baseOptions
      .filter((status) => {
        if (seen.has(status)) return false;
        seen.add(status);
        return true;
      })
      .map((status) => ({
        label: status,
        disabled:
          status !== selectedStatus && !allowedNextStatuses.includes(status),
      }));
  };

  const handleDropdownChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newStatus = e.target.value;
    setPendingStatus(newStatus);
    setShowModal(true);

    if (newStatus === "Approved" || newStatus === "Rejected") {
    setOpen(true);
    setShowModal(false)
  }
  };

  const handleSubmit = async () => {
    if (!pendingStatus) return;
    setLoading(true);

    try {
      const res = await apiRequest(`gigs/${data._id}/changeStatus`, {
        method: "PATCH",
        data: JSON.stringify({
          status: pendingStatus,
          bidId: data.assignedToBid,
          description,
        }),
      });
      setSelectedStatus(pendingStatus);

      if (res.success) {
        toast.success(res?.data?.message);
        updateGigData(res.data.data.gig)
      } else {
        toast.error(res?.data?.message || "Something went wrong");
      }
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "message" in err) {
        toast.error(
          (err as { message?: string }).message || "Error updating status"
        );
      } else {
        toast.error("Error updating status");
      }
    } finally {
      handleClose();
    }
  };

  const handleClose = () => {
    setLoading(false);
    setShowModal(false);
    setDescription("");
    setPendingStatus(null);
  };
  return (
    <div>
      <CustomTextField
        select
        fullWidth
        name="status"
        value={selectedStatus || ""}
        onChange={handleDropdownChange}
        disabled={loading}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 250,
              },
            },
          },
        }}
      >
        <MenuItem value="" disabled>
          Select status
        </MenuItem>

        {getStatusOptions().map((option) => (
          <MenuItem
            key={option.label}
            value={option.label}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
      </CustomTextField>

      {/* Modal */}
      {showModal && (
        <Dialog open={showModal} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ m: 0, p: 2 }}>
            <Typography className="text-lg font-semibold mb-3">
              Add Description
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "#999",
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <CustomTextField
              fullWidth
              multiline
              rows={4}
              placeholder="Enter description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              {loading ? "Updating..." : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <PostGigReviewDialog
        open={open}
        onClose={() => setOpen(false)}
        data={data}
        pendingStatus={pendingStatus || ""}
      />
    </div>
  );
};

export default StatusDropdown;
