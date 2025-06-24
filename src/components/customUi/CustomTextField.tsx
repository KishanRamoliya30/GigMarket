import {
  TextField,
  TextFieldProps,
  Typography,
  Box,
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
    <div style={{ marginBottom: "16px" }}>
      {label && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: "6px",
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "14px",
              color: "text.secondary",
            }}
          >
            {label}
          </Typography>
          {isPassword && (
            <Box
              onClick={handleToggleVisibility}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "13px",
                color: "#6a6a6a",
                fontWeight: 500,
              }}
            >
              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              <span style={{ marginLeft: "6px" }}>
                {showPassword ? "Hide" : "Show"}
              </span>
            </Box>
          )}
        </Box>
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
          sx: {
            pr: isPassword ? 0 : undefined,
          },
        }}
        sx={{
          marginTop:"0",
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
