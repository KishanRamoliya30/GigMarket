"use client";

import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TablePagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import CustomDialog from '@/components/customUi/CustomDialog';
interface Post {
  id: number;
  title: string;
  category: string;
  flagged: boolean;
}

const postsData: Post[] = [
  { id: 1, title: 'Design like a Pro', category: 'Design', flagged: false },
  { id: 2, title: 'AI Gig Copying Warning', category: 'Writing', flagged: true },
  { id: 3, title: 'Pricing Strategy Tips', category: 'Marketing', flagged: false },
  { id: 4, title: 'Intro to Freelancing', category: 'General', flagged: false },
  { id: 5, title: 'Avoiding Scams', category: 'Security', flagged: true },
  { id: 6, title: 'Building Client Trust', category: 'Relationship', flagged: false },
  { id: 7, title: 'Portfolio Optimization', category: 'Design', flagged: false },
];

const StyledTableRow = styled(TableRow)(() => ({
  '&:hover': {
    backgroundColor: '#f9f9f9',
  },
}));

export default function ManagePost() {
  const [posts, setPosts] = useState<Post[]>(postsData);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleDelete = () => {
    if (selectedPost) {
      setPosts((prev) => prev.filter((p) => p.id !== selectedPost.id));
      setSelectedPost(null);
      setOpenDialog(false);
    }
  };

  const paginatedPosts = posts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Manage Posts
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPosts.map((post) => (
              <StyledTableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>
                  {post.flagged ? (
                    <Chip label="Flagged" color="error" />
                  ) : (
                    <Chip label="Clean" color="success" />
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => {
                      setSelectedPost(post);
                      setOpenDialog(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={posts.length}
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
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        content={<strong>{selectedPost?.title}</strong>}
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
}
