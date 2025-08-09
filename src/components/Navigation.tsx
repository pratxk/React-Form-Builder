import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Plus, Eye, List } from 'lucide-react';

interface NavigationProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentRoute, onNavigate }) => {
  const navItems = [
    { route: '/create', label: 'Create', icon: Plus },
    { route: '/preview', label: 'Preview', icon: Eye },
    { route: '/myforms', label: 'My Forms', icon: List },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', color: 'text.primary', top: 0 }}
    >
      <Toolbar sx={{ maxWidth: 1440, mx: 'auto', width: '100%', px: { xs: 1, sm: 2 }, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
        {/* Title */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2563eb' /* blue-600 */ }}>
          Dynamic Form Builder
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {navItems.map(({ route, label, icon: Icon }) => {
            const selected = currentRoute === route;
            return (
              <Button
                key={route}
                onClick={() => onNavigate(route)}
                startIcon={<Icon size={18} />}
                variant={selected ? 'contained' : 'text'}
                sx={{
                  textTransform: 'none',
                  fontWeight: selected ? '600' : '500',
                  bgcolor: selected ? '#2563eb' : 'transparent',
                  color: selected ? '#fff' : '#4b5563', // gray-600
                  '&:hover': {
                    bgcolor: selected ? '#1d4ed8' : '#eff6ff', // blue-700 or blue-50 hover
                    color: selected ? '#fff' : '#2563eb', // white or blue-600
                  },
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                }}
              >
                {label}
              </Button>
            );
          })}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
