import React from "react";
import { Button as MUIButton, type SxProps } from "@mui/material";

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
  [key:string]: any;
}> = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled,
  className = "",
  type = "button",
}) => {
  // Map your custom variants to MUI's styles
  const variantStyles: Record<string, SxProps> = {
    primary: {
      backgroundColor: "#2563eb", // blue-600
      color: "#fff",
      "&:hover": { backgroundColor: "#1d4ed8" },
    },
    secondary: {
      backgroundColor: "#e5e7eb", // gray-200
      color: "#111827",
      "&:hover": { backgroundColor: "#d1d5db" },
    },
    danger: {
      backgroundColor: "#dc2626", // red-600
      color: "#fff",
      "&:hover": { backgroundColor: "#b91c1c" },
    },
    outline: {
      backgroundColor: "#fff",
      color: "#374151",
      border: "1px solid #d1d5db",
      "&:hover": { backgroundColor: "#f9fafb" },
    },
  };

  return (
    <MUIButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      size={size}
      sx={variantStyles[variant]}
      className={className}
    >
      {children}
    </MUIButton>
  );
};
