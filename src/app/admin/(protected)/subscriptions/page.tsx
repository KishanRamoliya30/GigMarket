"use client";

import { useState } from "react";
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDialog from "@/components/CustomDialog";

interface Plan {
  id: number;
  name: string;
  price: number;
  duration: string;
}

const initialPlans: Plan[] = [
  { id: 1, name: "Basic Plan", price: 10, duration: "Monthly" },
  { id: 2, name: "Pro Plan", price: 25, duration: "Monthly" },
  { id: 3, name: "Enterprise Plan", price: 99, duration: "Annually" },
];

export default function SubscriptionManagement() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleEdit = () => {
    if (selectedPlan) {
      setPlans((prev) =>
        prev.map((p) => (p.id === selectedPlan.id ? selectedPlan : p))
      );
    }
    setEditOpen(false);
    setSelectedPlan(null);
  };

  const handleDelete = () => {
    if (selectedPlan) {
      setPlans((prev) => prev.filter((p) => p.id !== selectedPlan.id));
    }
    setDeleteOpen(false);
    setSelectedPlan(null);
  };

  const paginatedPlans = plans.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Subscription Plan Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Plan Name</TableCell>
              <TableCell>Price ($)</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{plan.price}</TableCell>
                <TableCell>{plan.duration}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      setSelectedPlan({ ...plan });
                      setEditOpen(true);
                    }}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedPlan(plan);
                      setDeleteOpen(true);
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={plans.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Plan</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Plan Name"
            value={selectedPlan?.name || ""}
            onChange={(e) =>
              setSelectedPlan(
                (prev) => prev && { ...prev, name: e.target.value }
              )
            }
          />
          <TextField
            label="Price"
            type="number"
            value={selectedPlan?.price || ""}
            onChange={(e) =>
              setSelectedPlan((prev) =>
                prev ? { ...prev, price: parseFloat(e.target.value) } : prev
              )
            }
          />
          <TextField
            label="Duration"
            value={selectedPlan?.duration || ""}
            onChange={(e) =>
              setSelectedPlan(
                (prev) => prev && { ...prev, duration: e.target.value }
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <CustomDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Are you sure you want to delete plan ?"
        content={<strong>{selectedPlan?.name}</strong>}
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
}
