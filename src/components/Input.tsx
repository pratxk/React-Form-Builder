import React from 'react';
import { TextField, Box, Typography } from '@mui/material';

export const Input: React.FC<{
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  [key: string]: any;
}> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  disabled,
  required,
  label,
  error,
  helperText
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {label && (
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 500, 
            color: error ? '#d32f2f' : '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          {label}
          {required && <span style={{ color: '#d32f2f' }}>*</span>}
        </Typography>
      )}
      <TextField
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={false} // We handle required indicator in the label
        error={error}
        helperText={helperText}
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
    </Box>
  );
};

export default Input;
