import { TextField, TextFieldProps, Typography } from '@mui/material';

type CustomTextFieldProps = TextFieldProps & {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  errorText?:string
};

export default function CustomTextField({
  name,
  label,
  value,
  onChange,
  errorText="",
  type = 'text',
 
  ...rest
}: CustomTextFieldProps) {
  return (
    <>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '16px',
          marginBottom: '6px',
          fontColor:"#222325"
        }}
      >
        {label}
      </Typography>

      <TextField
        name={name}
        type={type}
        fullWidth
        required
        value={value}
        onChange={onChange}
        variant="outlined"
        autoComplete="off"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
              borderColor: '#ccc', 
            },
            '&:hover fieldset': {
              borderColor: '#aaa', 
            },
            '&.Mui-focused fieldset': {
              borderColor: 'black',
              borderWidth: '1.5px',
            },
          },
        }}
        {...rest}
        slotProps={{
          input: {
            autoComplete: 'new-password',
          },
        }}
        helperText={errorText}
        error={errorText!=""}
      />
    </>
  );
}
