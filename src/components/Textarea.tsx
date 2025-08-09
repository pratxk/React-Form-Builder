import React from 'react';
import { TextField } from '@mui/material';

interface TextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder,
  rows = 3,
  className = '',
  disabled,
}) => {
  return (
    <TextField
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
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
  );
};

export default Textarea;
