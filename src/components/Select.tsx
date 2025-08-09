import React from 'react';
import { Select as MUISelect, MenuItem, FormControl, InputLabel } from '@mui/material';

type SelectValue = string | string[];

interface SelectProps {
  value: SelectValue;
  onChange: (value: SelectValue) => void;
  options: { value: string; label: string }[];
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
  label?: string;
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
  ...rest
}) => {
  return (
    <FormControl fullWidth disabled={disabled} className={className} variant="outlined" size="small">
      {label && <InputLabel>{label}</InputLabel>}
      <MUISelect
        multiple={multiple}
        value={value as any}
        onChange={(e) => {
          const nextValue = multiple ? (e.target.value as string[]) : (e.target.value as string);
          onChange(nextValue);
        }}
        label={label}
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
    </FormControl>
  );
};

export default Select;
