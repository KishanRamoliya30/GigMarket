"use client";

import { useEffect, useState } from 'react';
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
import CustomDialog from '@/components/customUi/CustomDialog';
import { apiRequest } from '@/app/lib/apiCall';

interface IUser {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  termsAccepted: boolean;
  termsAcceptedAt?: Date | null;
  subscriptionCompleted: boolean;
  profileCompleted: boolean;
  createdAt?: Date;
  isAdmin: boolean;
  isActive: boolean;
}

export default function UserProviderManagementPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [total, setTotal] = useState<number>(0);
  // const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  // const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleApprove = () => {
    // if (selectedProvider) {
    //   setProviders((prev) =>
    //     prev.map((p) =>
    //       p.id === selectedProvider.id ? { ...p, isApproved: true } : p
    //     )
    //   );
    // }
    // setDialogOpen(false);
    // setSelectedProvider(null);
  };

  const handleReject = (id: number) => {
    // setProviders((prev) => prev.filter((p) => p.id !== id));
  };
  
  async function getAllUsers() {
    const resp = await apiRequest("admin/users",{
      method:"GET",
      params:{
        page:page,
        limit:rowsPerPage
      }
    })
    setUsers(resp.data.users)
    setTotal(resp.data.total)
  }
  useEffect(()=>{
    getAllUsers()
  },[page,rowsPerPage])
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
              <TableCell>Subscription Status</TableCell>
              {/* <TableCell align="right">Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.subscriptionCompleted ? (
                    <Chip label="Subscribed" color="success" icon={<VerifiedIcon />} />
                  ) : (
                    <Chip label="Not Subscribed" color="warning" />
                  )}
                </TableCell>
                <TableCell align="right">
                  {/* {!user.isApproved && (
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
                  </IconButton> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5,10,15,20,50]}

        />
      </TableContainer>

  
        {/* <CustomDialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              onConfirm={handleApprove}
              title=" Are you sure you want to approve"
              content={<><strong>{selectedProvider?.name}</strong> as a service provider?</>}
              confirmText="Approve"
              confirmColor="success"
            /> */}
    </Box>
  );
}
