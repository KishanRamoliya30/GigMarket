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

interface StatusDropdownProps {
  data: GigData;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ data }) => {
  const [selectedStatus, setSelectedStatus] = useState(data.status);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const role = user?.role;

  const getStatusOptions = () => {
    const userStatuses = [
      "Open",
      "Not-Assigned",
      "Assigned",
      "Approved",
      "Rejected",
    ];
    const providerStatuses = ["Requested", "In-Progress", "Completed"];

    let options: string[] = [];

    if (role === "User") {
      options = [...userStatuses];

      // If the selectedStatus is not in user list but is part of provider list, include it
      if (
        selectedStatus &&
        !options.includes(selectedStatus) &&
        providerStatuses.includes(selectedStatus)
      ) {
        options.unshift(selectedStatus);
      }
    } else if (role === "Provider") {
      options = [...providerStatuses];

      // If the selectedStatus is not in provider list but is part of user list, include it
      if (
        selectedStatus &&
        !options.includes(selectedStatus) &&
        userStatuses.includes(selectedStatus)
      ) {
        options.unshift(selectedStatus);
      }
    }

    return options;
  };

  const handleDropdownChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newStatus = e.target.value;
    setPendingStatus(newStatus);
    setShowModal(true);
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
      if (res.message) {
        toast.error(res.message);
      } else {
        toast.success(`Status updated to ${pendingStatus}`);
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
        {getStatusOptions().map((status) => (
          <MenuItem key={status} value={status}>
            {status}
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
    </div>
  );
};

export default StatusDropdown;
