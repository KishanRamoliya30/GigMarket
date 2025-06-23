"use client";

import { useState } from 'react';
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
  Chip,
  Button,
  TablePagination
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomDialog from '@/components/CustomDialog';
interface Provider {
  id: number;
  name: string;
  email: string;
  isApproved: boolean;
}

const initialProviders: Provider[] = [
  { id: 1, name: 'Minali Patel', email: 'minali@mail.com', isApproved: false },
  { id: 3, name: 'Nisha Patel', email: 'nisha@mail.com', isApproved: false },
  { id: 2, name: 'Kishan Patel', email: 'kishan@mail.com', isApproved: true },
];

export default function UserProviderManagementPage() {
  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleApprove = () => {
    if (selectedProvider) {
      setProviders((prev) =>
        prev.map((p) =>
          p.id === selectedProvider.id ? { ...p, isApproved: true } : p
        )
      );
    }
    setDialogOpen(false);
    setSelectedProvider(null);
  };

  const handleReject = (id: number) => {
    setProviders((prev) => prev.filter((p) => p.id !== id));
  };

  const paginated = providers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        User Provider Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell>{provider.name}</TableCell>
                <TableCell>{provider.email}</TableCell>
                <TableCell>
                  {provider.isApproved ? (
                    <Chip label="Approved" color="success" icon={<VerifiedIcon />} />
                  ) : (
                    <Chip label="Pending" color="warning" />
                  )}
                </TableCell>
                <TableCell align="right">
                  {!provider.isApproved && (
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setSelectedProvider(provider);
                        setDialogOpen(true);
                      }}
                    >
                      Approve
                    </Button>
                  )}{' '}
                  <IconButton color="error" onClick={() => handleReject(provider.id)}>
                    <CancelIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={providers.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

  
        <CustomDialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              onConfirm={handleApprove}
              title=" Are you sure you want to approve"
              content={<><strong>{selectedProvider?.name}</strong> as a service provider?</>}
              confirmText="Approve"
              confirmColor="success"
            />
    </Box>
  );
}
