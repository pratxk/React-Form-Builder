import React from 'react';
import { TextField } from '@mui/material';

export const Input: React.FC<{
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  [key: string]: any;
}> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  disabled,
  required
}) => {
  return (
    <TextField
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      fullWidth
      variant="outlined"
      size="small"
      className={className}
      InputProps={{
        sx: {
          borderRadius: '8px',
          backgroundColor: disabled ? '#f3f4f6' : '#fff', // gray-100 equivalent
          transition: 'all 0.2s ease-in-out',
          '&:focus-within': {
            outline: 'none',
            boxShadow: '0 0 0 2px #3b82f6', // blue-500 ring
          }
        }
      }}
    />
  );
};

export default Input;
