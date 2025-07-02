import {
  TextField,
  TextFieldProps,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

type CustomTextFieldProps = TextFieldProps & {
  name?: string;
  errorText?: string;
  isPassword?: boolean;
isAstrick?: boolean; 
};

export default function CustomTextField({
  name,
  label,
  value,
  onChange,
  errorText = "",
  type = "text",
  isPassword = false,
 isAstrick = false, 
  sx,
  ...rest
}: CustomTextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  return (
    <div style={{ marginBottom: "16px" }}>
      {label && (
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "14px",
            color: "text.secondary",
            mb: "6px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {label}
          {isAstrick && (
            <Typography component="span" color="error" ml={0.5}>
              *
            </Typography>
          )}
        </Typography>
      )}

      <TextField
        name={name}
        type={isPassword ? (showPassword ? "text" : "password") : type}
        fullWidth
        value={value}
        onChange={onChange}
        variant="outlined"
        autoComplete="off"
        // required
        InputProps={{
          endAdornment: isPassword && (
            <InputAdornment position="end">
              <IconButton onClick={handleToggleVisibility} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          ...rest.InputProps,
        }}
        sx={{
          marginTop: "0",
          backgroundColor: "#fff",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            fontSize: "14px",
            "& input": {
              padding: "12px 14px",
            },
            "& fieldset": {
              borderColor: "#dadbdd",
              borderWidth: "1px",
            },
            "&:hover fieldset": {
              borderColor: "#b5b6ba",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2e7d32",
              borderWidth: "1px",
            },
          },
          ...sx,
        }}
        helperText={errorText}
        error={!!errorText}
        {...rest}
      />
    </div>
  );
}
