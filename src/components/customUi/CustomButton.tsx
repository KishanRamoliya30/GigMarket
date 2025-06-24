import { Button, ButtonProps } from '@mui/material';

type CustomButtonProps = ButtonProps & {
  label: string;
  btnType?: 'primary' | 'secondary';
};

export default function CustomButton({ label, btnType = 'primary', ...rest }: CustomButtonProps) {
    const isContinue = btnType === 'primary';
    return (
    <Button
      variant="contained"
      fullWidth
      disableElevation
      {...rest}
      sx={{
        backgroundColor: isContinue ? '#222325' : '#F5F5F5',
        color: isContinue ? '#fff' : '#333',
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '16px',
        borderRadius: '8px',
        padding: '12px 0',
        border: isContinue ? 'none' : '1px solid #ccc',
        '&:hover': {
          backgroundColor: isContinue ? '#000' : '#E0E0E0',
        },
      }}
    >
      {label}
    </Button>
  );
}
