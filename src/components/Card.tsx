import React from 'react';
import { Paper, type SxProps } from '@mui/material';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  sx?: SxProps;
  [key: string]: any;
}

const Card: React.FC<CardProps> = ({ children, className = '', sx, ...rest }) => {
  return (
    <Paper
      elevation={3}
      className={className}
      sx={{
        borderRadius: 2,
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        backgroundColor: '#fff',
        ...(sx as object),
      }}
      {...rest}
    >
      {children}
    </Paper>
  );
};

export default Card;
