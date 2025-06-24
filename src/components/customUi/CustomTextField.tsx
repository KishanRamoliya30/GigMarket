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
};

export default function CustomTextField({
  name,
  label,
  value,
  onChange,
  errorText = "",
  type = "text",
  isPassword = false,
  sx,
  ...rest
}: CustomTextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      {label && (
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "16px",
            marginBottom: "6px",
            color: "#404145",
          }}
        >
          {label}
        </Typography>
      )}

      <TextField
        name={name}
        type={isPassword ? (showPassword ? "text" : "password") : type}
        fullWidth
        required
        value={value}
        onChange={onChange}
        variant="outlined"
        autoComplete="off"
        InputProps={{
          endAdornment: isPassword && (
            <InputAdornment position="end" sx={{ pr: 1 }}>
              <IconButton
                onClick={handleToggleVisibility}
                edge="end"
                size="small"
                sx={{
                  padding: 0,
                  color: "#6a6a6a",
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            paddingRight: 0,
            fontSize: "14px",
            "& input": {
              padding: "12px",
              paddingRight: isPassword ? "36px" : "12px",
            },
            "& fieldset": {
              borderColor: "#dadbdd",
              borderWidth: "1px",
            },
            "&:hover fieldset": {
              borderColor: "#b5b6ba",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#222325",
              borderWidth: "2px",
            },
            "&MuiInputAdornment-root": {
              marginRight: "12px",
            },
          },
          ...sx
        }}
        helperText={errorText}
        error={!!errorText}
        {...rest}
      />
    </>
  );
}
