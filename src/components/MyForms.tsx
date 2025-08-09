import React from 'react';
import { Box, Typography, Stack, Grid } from '@mui/material';
import { List, Plus, Eye, Edit, Trash2 } from 'lucide-react';

import Card from './Card';
import { Button } from './Button';
import type { useFormStore } from '../store/useFormStore';

interface FormSchema {
  id: string;
  name: string;
  fields: any[];
  createdAt: string;
}

interface MyFormsProps {
  store: ReturnType<typeof useFormStore>;
  onNavigate: (route: string) => void;
}

export const MyForms: React.FC<MyFormsProps> = ({ store, onNavigate }) => {
  const openForm = (form: FormSchema) => {
    store.updateCurrentForm(form);
    onNavigate('/preview');
  };

  const editForm = (form: FormSchema) => {
    store.updateCurrentForm(form);
    onNavigate('/create');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
        py: 8,
        px: { xs: 2, md: 4 },
      }}
    >
      <Box maxWidth="1440px" mx="auto">
        {/* Header */}
        <Box mb={6}>
          <Typography variant="h3" fontWeight="bold" color="text.primary">
            My Forms
          </Typography>
          <Typography variant="h6" color="text.secondary" mt={1}>
            Manage your saved forms
          </Typography>
        </Box>

        {/* No saved forms */}
        {store.state.savedForms.length === 0 ? (
          <Card>
            <Box p={8} textAlign="center" color="text.disabled">
              <List size={64} style={{ margin: '0 auto 16px' }} />
              <Typography variant="h5" fontWeight={600} mb={2} color="text.secondary">
                No forms saved yet
              </Typography>
              <Typography variant="body1" mb={4} color="text.secondary">
                Create your first form to get started
              </Typography>
              <Button onClick={() => onNavigate('/create')} type="button">
                <Plus size={18} style={{ marginRight: 8 }} />
                Create Your First Form
              </Button>
            </Box>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {store.state.savedForms.map((form) => (
              <Grid item xs={12} md={6} lg={4} key={form.id}>
                <Card
                  sx={{
                    transition: 'box-shadow 0.2s',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <Box p={3} display="flex" flexDirection="column" height="100%">
                    <Box mb={3}>
                      <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                        {form.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Created: {new Date(form.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fields: {form.fields.length}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} mt="auto">
                      <Button
                        onClick={() => openForm(form)}
                        variant="outline"
                        size="small"
                        className="flex-1"
                        type="button"
                      >
                        <Eye size={16} style={{ marginRight: 4 }} />
                        Preview
                      </Button>
                      <Button
                        onClick={() => editForm(form)}
                        variant="outline"
                        size="small"
                        className="flex-1"
                        type="button"
                      >
                        <Edit size={16} style={{ marginRight: 4 }} />
                        Edit
                      </Button>
                      <Button
                        onClick={() => store.deleteSavedForm(form.id)}
                        variant="danger"
                        size="small"
                        type="button"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};
