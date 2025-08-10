import React from 'react';
import { Select as MUISelect, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';

type SelectValue = string | string[];

interface SelectProps {
  value: SelectValue;
  onChange: (value: SelectValue) => void;
  options: { value: string; label: string }[];
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  [key: string]: any;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  multiple = false,
  className = '',
  disabled,
  label,
  required,
  error,
  helperText,
  ...rest
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
      <FormControl fullWidth disabled={disabled} className={className} variant="outlined" size="small" error={error} required={false}>
        <MUISelect
          multiple={multiple}
          value={value as any}
          onChange={(e) => {
            const nextValue = multiple ? (e.target.value as string[]) : (e.target.value as string);
            onChange(nextValue);
          }}
          displayEmpty
          sx={{
            borderRadius: 2,
            bgcolor: disabled ? '#f3f4f6' : '#fff',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3b82f6',
              boxShadow: '0 0 0 2px #3b82f6',
            },
          }}
          {...rest}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </MUISelect>
        {helperText && (
          <div style={{ 
            color: error ? '#d32f2f' : '#666', 
            fontSize: '0.75rem', 
            marginTop: '3px',
            marginLeft: '14px'
          }}>
            {helperText}
          </div>
        )}
      </FormControl>
    </Box>
  );
};

export default Select;
