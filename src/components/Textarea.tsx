import React from 'react';
import { TextField, Box, Typography } from '@mui/material';

interface TextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder,
  rows = 3,
  className = '',
  disabled,
  label,
  required,
  error,
  helperText,
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
        multiline
        minRows={rows}
        InputProps={{
          sx: {
            borderRadius: '8px',
            backgroundColor: disabled ? '#f3f4f6' : '#fff',
            transition: 'all 0.2s ease-in-out',
            '&:focus-within': {
              outline: 'none',
              boxShadow: '0 0 0 2px #3b82f6',
            },
          },
        }}
      />
    </Box>
  );
};

export default Textarea;
