import { Button, ButtonProps } from '@mui/material';

type CustomButtonProps = ButtonProps & {
  label: string;
  btnType?: 'primary' | 'secondary';
  variant?: 'contained' | 'outlined';
};

export default function CustomButton({ label,variant, btnType = 'primary',sx, ...rest }: CustomButtonProps) {
    const isContinue = btnType === 'primary';
    return (
    <Button
      variant={variant}
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
        ...sx
      }}
    >
      {label}
    </Button>
  );
}
