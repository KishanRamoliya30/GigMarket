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
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  SelectChangeEvent,
  TablePagination,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import UndoIcon from '@mui/icons-material/Undo';

interface User {
  id: number;
  name: string;
  role: 'User' | 'Provider';
  strikes: number;
  banned: boolean;
}

const initialUsers: User[] = [
  { id: 1, name: 'John Doe', role: 'User', strikes: 0, banned: false },
  { id: 2, name: 'Jane Smith', role: 'Provider', strikes: 1, banned: true },
  { id: 3, name: 'Alex Turner', role: 'User', strikes: 2, banned: true },
  { id: 4, name: 'Lara King', role: 'Provider', strikes: 0, banned: false },
  { id: 5, name: 'Mark Hill', role: 'User', strikes: 3, banned: true },
  { id: 6, name: 'Zara Lowe', role: 'Provider', strikes: 1, banned: true },
  { id: 7, name: 'Tom Reed', role: 'User', strikes: 0, banned: false },
  { id: 8, name: 'Ella Moss', role: 'Provider', strikes: 2, banned: true },
];

export default function UserBanPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<'strike' | 'unban' | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleFilterChange = (event: SelectChangeEvent) => {
    setRoleFilter(event.target.value);
    setPage(0);
  };

  const handleAddStrike = () => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((user) => {
          if (user.id === selectedUser.id) {
            const newStrikes = user.strikes + 1;
            return {
              ...user,
              strikes: newStrikes,
              banned: newStrikes >= 1,
            };
          }
          return user;
        })
      );
    }
    closeDialog();
  };

  const handleUnban = () => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? { ...user, banned: false, strikes: 0 } : user
        )
      );
    }
    closeDialog();
  };

  const closeDialog = () => {
    setSelectedUser(null);
    setDialogOpen(false);
    setConfirmType(null);
  };

  const filteredUsers =
    roleFilter === 'All' ? users : users.filter((u) => u.role === roleFilter);

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        User Ban Management
      </Typography>

      <Box mb={2} display="flex" gap={2} alignItems="center">
        <Typography variant="body1">Filter by Role:</Typography>
        <Select size="small" value={roleFilter} onChange={handleFilterChange}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="User">User</MenuItem>
          <MenuItem value="Provider">Provider</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Strikes</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.strikes}</TableCell>
                <TableCell>
                  {user.banned ? (
                    <Chip
                      label={
                        user.strikes >= 3 ? 'Permanently Banned' : 'Temporarily Banned'
                      }
                      color="error"
                    />
                  ) : (
                    <Chip label="Active" color="success" />
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      setSelectedUser(user);
                      setConfirmType('strike');
                      setDialogOpen(true);
                    }}
                    color="warning"
                    disabled={user.strikes >= 3}
                  >
                    <GavelIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedUser(user);
                      setConfirmType('unban');
                      setDialogOpen(true);
                    }}
                    color="primary"
                    disabled={!user.banned && user.strikes === 0}
                  >
                    <UndoIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>
          {confirmType === 'strike' ? 'Add Strike?' : 'Remove Ban?'}
        </DialogTitle>
        <DialogContent>
          Are you sure you want to
          {confirmType === 'strike'
            ? ` add a strike to ${selectedUser?.name}?`
            : ` remove the ban for ${selectedUser?.name}?`}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            onClick={confirmType === 'strike' ? handleAddStrike : handleUnban}
            color={confirmType === 'strike' ? 'warning' : 'primary'}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}