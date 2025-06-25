import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography
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
      <DialogTitle sx={{ padding: '16px', fontWeight: 600 }}>
        Terms & Conditions
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#333',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {open && termsHtml!=="" && <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(termsHtml),
          }}
          style={{
            padding: '12px',
            backgroundColor: '#f9f9f9',
            borderRadius: '6px',
            boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
          }}
        />}
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              name="agree"
              sx={{
                '& .MuiSvgIcon-root': {
                  color: agreed ? '#000' : '#ccc',
                  '&.Mui-checked': {
                    color: '#000', 
                  },
                },
              }}
            />
          }
          label={
            <Typography variant="body2" sx={{ fontSize: '14px', color: '#333' }}>
              I have read and agree to the latest terms and conditions.
            </Typography>
          }
        />
        <div style={{ width: '100%', textAlign: 'right' }}>
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
              padding: '12px 24px',
              width: 'auto',
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
