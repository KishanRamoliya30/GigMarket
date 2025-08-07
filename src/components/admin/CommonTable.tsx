/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Box,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { ReactNode } from 'react';

export interface Column {
  id: string;
  label: string;
  render?: (row: any) => ReactNode;
  align?: 'right' | 'left' | 'center';
}

interface CommonTableProps {
  columns: Column[];
  rows: any[];
  actions?: (row: any) => ReactNode;
  rowsPerPageOptions?: number[];
  pageChange: (newPage: number, rowsPerPage: number) => void;
  pagination: {
    total: number,
    limit: number,
    page: number,
    pages: number,
  };
  loading:boolean
}

const StyledWrapper = styled(Box)(({ theme }) => ({
  '& .table-container': {
    borderRadius: theme.spacing(1),
    overflow: 'hidden',
  },

  '& .table-paper': {
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[2],
  },

  '& .table-head-cell': {
    fontWeight: 600,
    fontSize: '15px',
    fontFamily: 'Inter, Roboto, sans-serif',
    backgroundColor: '#f0f0f0',
    color: '#222',
    padding: '14px 20px',
    borderBottom: '1px solid #ddd',
  },

  '& .table-row': {
    '&:hover': {
      backgroundColor: '#f9f9f9',
    },
    '&:nth-of-type(odd)': {
      backgroundColor: '#fafafa',
    },
  },

  '& .table-cell': {
    padding: '14px 20px',
    fontSize: '14px',
    fontFamily: 'Inter, Roboto, sans-serif',
    color: '#333',
  },
}));

export default function CommonTable({
  columns,
  rows,
  actions,
  rowsPerPageOptions = [5, 10, 25],
  pagination = { total: 0, limit: 10, page: 1, pages: 1},
  pageChange,
  loading = false
}: CommonTableProps) {
  
  return (
    <StyledWrapper>
      <TableContainer component={Paper} className="table-container table-paper">
        
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  className="table-head-cell"
                >
                  {column.label}
                </TableCell>
              ))}
              {actions && (
                <TableCell align="right" className="table-head-cell">
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          {loading ?
          <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  <Skeleton variant="text" width="100%" height={20} />
                </TableCell>
              ))}
              {actions && (
                <TableCell>
                  <Skeleton variant="text" width={60} height={20} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        :
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx} className="table-row">
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    className="table-cell"
                  >
                    {column.render ? column.render(row) : row[column.id]}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell align="right" className="table-cell">
                    {actions(row)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
}
        </Table>

        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page-1}
          onPageChange={(_, newPage) => pageChange(newPage+1,pagination.limit)}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={(e) => {
            pageChange(1,parseInt(e.target.value, 10))
          }}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </TableContainer>
    </StyledWrapper>
  );
}
