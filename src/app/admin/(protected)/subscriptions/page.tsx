"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { apiRequest } from "@/app/lib/apiCall";
import { toast } from "react-toastify";
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import { Plan } from "@/app/utils/interfaces";

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const fetchPlans = async () => {
    const res = await apiRequest<{ success: boolean; data: Plan[] }>("plans");
    if (res.ok && res.data?.success) {
      setPlans(res.data.data);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleUpdate = async () => {
    if (selectedPlan) {
      const res = await apiRequest("admin/plans", {
        method: "PATCH",
        data: {
          ...selectedPlan,
          benefits:selectedPlan.benefits.filter((benefit)=> (benefit.trim()!==""))
        },
      });
      if (res.ok) {
        fetchPlans();
        setEditOpen(false);
        setSelectedPlan(null);
        toast.success("Plan updated successfully!");
      }
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Available Plans
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price ($)</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Benefits</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan._id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{plan.price}</TableCell>
                <TableCell>{plan.description}</TableCell>
                <TableCell>
                  <ul style={{ paddingLeft: "20px" }}>
                    {plan.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedPlan({ ...plan });
                      setEditOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper:{sx: { borderRadius: 3, p: 2, backgroundColor: "#fff" }}
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, mb: 1 }}>Edit Subscription Plan</DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, pt:"10px !important" }}>
          <TextField
            label="Plan Name"
            fullWidth
            variant="outlined"
            value={selectedPlan?.name ?? ""}
            onChange={(e) =>
              setSelectedPlan((prev) => (prev ? { ...prev, name: e.target.value } : prev))
            }
            sx={{
              "& label.Mui-focused": { color: "#000" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#000" },
                "&:hover fieldset": { borderColor: "#000" },
                "&.Mui-focused fieldset": { borderColor: "#000" },
              },
            }}
          />

          <TextField
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            value={selectedPlan?.price ?? ""}
            onChange={(e) =>
              setSelectedPlan((prev) =>
                prev ? { ...prev, price: parseFloat(e.target.value) } : prev
              )
            }
            sx={{
              "& label.Mui-focused": { color: "#000" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#000" },
                "&:hover fieldset": { borderColor: "#000" },
                "&.Mui-focused fieldset": { borderColor: "#000" },
              },
            }}
            disabled={selectedPlan?.type === 1}
          />

          <TextField
            label="Description"
            fullWidth
            variant="outlined"
            value={selectedPlan?.description ?? ""}
            onChange={(e) =>
              setSelectedPlan((prev) =>
                prev ? { ...prev, description: e.target.value } : prev
              )
            }
            sx={{
              "& label.Mui-focused": { color: "#000" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#000" },
                "&:hover fieldset": { borderColor: "#000" },
                "&.Mui-focused fieldset": { borderColor: "#000" },
              },
            }}
          />

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Benefits</Typography>

            {selectedPlan?.benefits?.map((benefit, index) => (
              <Box key={index} display="flex" alignItems="center" mb={1}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={benefit}
                  onChange={(e) => {
                    const newBenefits = [...selectedPlan.benefits];
                    newBenefits[index] = e.target.value;
                    setSelectedPlan(prev => prev ? { ...prev, benefits: newBenefits } : prev);
                  }}
                  sx={{
                    "& label.Mui-focused": { color: "#000" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#000" },
                      "&:hover fieldset": { borderColor: "#000" },
                      "&.Mui-focused fieldset": { borderColor: "#000" },
                    },
                  }}
                />
                <IconButton
                  onClick={() => {
                    const newBenefits = selectedPlan.benefits.filter((_, i) => i !== index);
                    setSelectedPlan(prev => prev ? { ...prev, benefits: newBenefits } : prev);
                  }}
                  sx={{ ml: 1 }}
                  aria-label="remove-benefit"
                >
                  <Delete />
                </IconButton>
              </Box>
            ))}

            <IconButton
              onClick={() => {
                const newBenefits = [...(selectedPlan?.benefits || []), ""];
                setSelectedPlan((prev) =>
                  prev ? { ...prev, benefits: newBenefits } : prev
                )
              }}
              aria-label="add-benefit"
              sx={{ mt: 1 }}
            >
              <Add />
            </IconButton>
          </Box>
          {/* <TextField
            label="Benefits (comma separated)"
            fullWidth
            variant="outlined"
            value={selectedPlan?.benefits?.join(", ") ?? ""}
            onChange={(e) =>
              setSelectedPlan((prev) =>
                prev ? { ...prev, benefits: e.target.value.split(",").map((b) => b.trim()) } : prev
              )
            }
            sx={{
              "& label.Mui-focused": { color: "#000" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#000" },
                "&:hover fieldset": { borderColor: "#000" },
                "&.Mui-focused fieldset": { borderColor: "#000" },
              },
            }}
          /> */}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, mt: 1 }}>
          <Button
            onClick={() => setEditOpen(false)}
            variant="outlined"
            sx={{
              color: "#000",
              borderColor: "#000",
              "&:hover": { backgroundColor: "#f5f5f5", borderColor: "#000" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              "&:hover": { backgroundColor: "#222" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
