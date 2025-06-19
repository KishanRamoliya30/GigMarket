"use client";

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Term {
  id: number;
  text: string;
}

const initialTerms: Term[] = [
  { id: 1, text: 'Users must provide accurate information when registering.' },
  { id: 2, text: 'Gig providers must not violate community standards or copy others.' },
];

export default function TermsAndServicesPage() {
  const [terms, setTerms] = useState<Term[]>(initialTerms);
  const [newTerm, setNewTerm] = useState('');
  const [editTerm, setEditTerm] = useState<Term | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleAddTerm = () => {
    if (newTerm.trim()) {
      const newId = terms.length ? terms[terms.length - 1].id + 1 : 1;
      setTerms([...terms, { id: newId, text: newTerm.trim() }]);
      setNewTerm('');
    }
  };

  const handleUpdateTerm = () => {
    if (editTerm) {
      setTerms((prev) => prev.map((t) => (t.id === editTerm.id ? editTerm : t)));
      setEditDialogOpen(false);
      setEditTerm(null);
    }
  };

  const handleDelete = (id: number) => {
    setTerms((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Terms & Services
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Add New Term"
          value={newTerm}
          fullWidth
          onChange={(e) => setNewTerm(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddTerm}>
          Add
        </Button>
      </Box>

      <Paper>
        <List>
          {terms.map((term) => (
            <ListItem
              key={term.id}
              secondaryAction={
                <>
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setEditTerm(term);
                      setEditDialogOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(term.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </>
              }
            >
              <ListItemText primary={term.text} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Term</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            value={editTerm?.text || ''}
            onChange={(e) =>
              setEditTerm((prev) => prev && { ...prev, text: e.target.value })
            }
            autoFocus
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateTerm}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
