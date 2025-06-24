import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DOMPurify from 'dompurify';

const TermsPopup = ({
  open,
  onClose,
  onAgree,
  termsHtml,
}: {
  open: boolean;
  onClose: () => void;
  onAgree: () => void;
  termsHtml: string;
}) => {
  const [agreed, setAgreed] = useState(false);

  const handleOk = () => {
    if (agreed) {
      onAgree();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Terms & Conditions
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(termsHtml),
          }}
        />
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              name="agree"
            />
          }
          label="I have read and agree to the latest terms and conditions."
        />
        <div style={{ alignSelf: 'flex-end' }}>
          <Button 
            onClick={handleOk} 
            disabled={!agreed} 
            sx={{
              backgroundColor: agreed ? '#222325' : '#F5F5F5',
              color: agreed ? '#fff' : '#333',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '16px',
              borderRadius: '8px',
              padding: '12px 0',
              border: agreed ? 'none' : '1px solid #ccc',
              '&:hover': {
                backgroundColor: agreed ? '#000' : '#E0E0E0',
              },
            }}
          >
            OK
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default TermsPopup;
