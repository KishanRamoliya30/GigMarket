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
  isWithoutMargin?: boolean;
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
  isWithoutMargin = false,
  sx,
  required = false,
  ...rest
}: CustomTextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div style={{ marginBottom: isWithoutMargin ? "0px" : "16px" }}>
      {label && (
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "14px",
            color: "text.secondary",
            mb: "4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {label}
          {(isAstrick || required) && (
            <Typography component="span" color="error" ml={0.5}>
              *
            </Typography>
          )}
        </Typography>
      )}

      <TextField
        name={name}
        id={name}
        type={isPassword ? (showPassword ? "text" : "password") : type}
        fullWidth
        value={value}
        onChange={onChange}
        variant="outlined"
        autoComplete="off"
        required={required}
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
            // height: "44px",
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
          "& .MuiInputBase-root": {
            height: "44px",
          },
          "& .Mui-error": {
            color: "#d32f2f !important",
          },
          "& .MuiInputBase-multiline": {
            height: "auto",
          },
          "& .MuiAutocomplete-inputRoot": {
            paddingTop: "3px !important",
            paddingBottom: "3px !important",
            minHeight: "44px",
            height: "auto",
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
