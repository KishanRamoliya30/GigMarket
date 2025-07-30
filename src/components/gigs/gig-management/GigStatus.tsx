"use client";

import { apiRequest } from "@/app/lib/apiCall";
import { GigData } from "@/app/utils/interfaces";
import React, { useState } from "react";

interface StatusDropdownProps {
  data: GigData;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ data }) => {
  const [selectedStatus, setSelectedStatus] = useState(data.status);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStatusOptions = () => {
    const gigCreatorStatuses = ["Open", "Assigned", "Not-Assigned", "Approved", "Rejected"];
    const bidCreatorStatuses = ["Requested", "In-Progress", "Completed"];
    const options: string[] = [];

    if (data.createdByRole === "User") {
      options.push(...gigCreatorStatuses);
    } else if (data.createdByRole === "Provider") {
      options.push(...bidCreatorStatuses);
    }

    return [...new Set(options)];
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setPendingStatus(newStatus);
    setShowModal(true);
  };

const handleSubmit = async () => {
  if (!pendingStatus) return;
  setLoading(true);

  try {

await apiRequest(`gigs/${data._id}/changeStatus`, {
      method: "PATCH",
      data: JSON.stringify({
        status: pendingStatus,
        bidId: data.assignedToBid,
        description,
      }),
    });
    setSelectedStatus(pendingStatus);
    alert(`Status updated to ${pendingStatus}`);
  } catch (err: any) {
    alert(err.message || "Error updating status");
  } finally {
    setLoading(false);
    setShowModal(false);
    setDescription("");
    setPendingStatus(null);
  }
};

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
<label className="block text-sm font-semibold text-gray-700 mb-1">
  Status <span className="text-red-500">*</span>
</label>
<select
  className="w-full px-4 py-2 border border-green-500 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-600"
  value={selectedStatus}
  onChange={handleDropdownChange}
  disabled={loading}
>
  <option value="" disabled>
    Select status
  </option>
  {getStatusOptions().map((status) => (
    <option key={status} value={status}>
      {status}
    </option>
  ))}
</select>



      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-transparent flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-3">Add Description</h2>
            <textarea
              className="w-full border rounded px-3 py-2 mb-4"
              rows={4}
              placeholder="Enter description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-300 text-gray-800"
                onClick={() => {
                  setShowModal(false);
                  setPendingStatus(null);
                  setDescription("");
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Updating..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
