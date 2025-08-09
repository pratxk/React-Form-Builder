import React, { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { Eye, Save, Plus } from 'lucide-react';

import { Button } from './Button';
import Card from './Card';
import Input from './Input';
import type { useFormStore } from '../store/useFormStore';
import { FieldConfiguration } from './FieldConfiguration';
import { Modal } from './Modal';
import type { FormField, FormSchema } from '../types/types';

interface CreateFormProps {
  store: ReturnType<typeof useFormStore>;
  onNavigate: (route: string) => void;
}

export const CreateForm: React.FC<CreateFormProps> = ({ store, onNavigate }) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [formName, setFormName] = useState('');

  const currentForm: FormSchema =
    store.state.currentForm || {
      id: '',
      name: '',
      fields: [],
      createdAt: '',
    };

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      defaultValue: '',
      validations: [],
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined,
    };

    store.updateCurrentForm({
      ...currentForm,
      fields: [...currentForm.fields, newField],
    });
  };

  const updateField = (fieldId: string, updatedField: FormField) => {
    store.updateCurrentForm({
      ...currentForm,
      fields: currentForm.fields.map((f) => (f.id === fieldId ? updatedField : f)),
    });
  };

  const deleteField = (fieldId: string) => {
    store.updateCurrentForm({
      ...currentForm,
      fields: currentForm.fields.filter((f) => f.id !== fieldId),
    });
  };

  const saveForm = () => {
    if (!formName.trim()) return;

    const formToSave: FormSchema = {
      ...currentForm,
      id: currentForm.id || Date.now().toString(),
      name: formName,
      createdAt: new Date().toISOString(),
    };

    if (currentForm.id) {
      store.updateSavedForm(formToSave);
    } else {
      store.addSavedForm(formToSave);
    }

    setSaveDialogOpen(false);
    setFormName('');
    // Defer navigation very slightly to ensure state persistence has flushed
    setTimeout(() => onNavigate('/myforms'), 0);
  };

  const fieldTypes = [
    { type: 'text', label: 'Text Field' },
    { type: 'number', label: 'Number Field' },
    { type: 'textarea', label: 'Textarea Field' },
    { type: 'select', label: 'Select Field' },
    { type: 'radio', label: 'Radio Field' },
    { type: 'checkbox', label: 'Checkbox Field' },
    { type: 'date', label: 'Date Field' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', // blue-50 to indigo-100 gradient
        py: 8,
        px: { xs: 2, md: 4 },
      }}
    >
      <Box maxWidth="1440px" mx="auto">
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6} flexWrap="wrap" gap={2}>
          <Typography variant="h3" fontWeight="bold" color="text.primary">
            Form Builder
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              onClick={() => onNavigate('/preview')}
              variant="outline"
              disabled={currentForm.fields.length === 0}
              type="button"
            >
              <Eye size={18} style={{ marginRight: 8 }} />
              Preview
            </Button>
            <Button
              onClick={() => setSaveDialogOpen(true)}
              disabled={currentForm.fields.length === 0}
              type="button"
            >
              <Save size={18} style={{ marginRight: 8 }} />
              Save Form
            </Button>
          </Stack>
        </Box>

        {/* Content Grid */}
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', lg: '280px 1fr' }}
          gap={4}
        >
          {/* Left panel - Add Fields (sticky on large screens) */}
          <Card
            sx={{
              p: 3,
              position: { lg: 'sticky' },
              top: { lg: 88 },
              alignSelf: 'start',
              maxHeight: { lg: 'calc(100vh - 112px)' },
              overflowY: { lg: 'auto' },
            }}
          >
            <Typography variant="h5" fontWeight={600} mb={3}>
              Add Fields
            </Typography>
            <Stack spacing={2}>
              {fieldTypes.map(({ type, label }) => (
                <Button
                  key={type}
                  onClick={() => addField(type as FormField['type'])}
                  variant="outline"
                  className="w-full justify-start"
                  type="button"
                >
                  <Plus size={16} style={{ marginRight: 8 }} />
                  {label}
                </Button>
              ))}
            </Stack>
          </Card>

          {/* Right panel - Form Fields */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={600} mb={3}>
              Form Fields
            </Typography>

            {currentForm.fields.length === 0 ? (
              <Box
                textAlign="center"
                py={12}
                color="text.disabled"
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
              >
                <Plus size={64} />
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                  No fields added yet
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  Start by adding a field from the left panel
                </Typography>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" gap={3}>
                {currentForm.fields.map((field) => (
                  <FieldConfiguration
                    key={field.id}
                    field={field}
                    onUpdate={(updatedField) => updateField(field.id, updatedField)}
                    onDelete={() => deleteField(field.id)}
                    allFields={currentForm.fields}
                  />
                ))}
              </Box>
            )}
          </Card>
        </Box>

        {/* Save Form Modal */}
        <Modal
          isOpen={saveDialogOpen}
          onClose={() => setSaveDialogOpen(false)}
          title="Save Form"
        >
          <Box display="flex" flexDirection="column" gap={3}>
            <Box>
              <Typography variant="subtitle1" mb={1}>
                Form Name
              </Typography>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter form name"
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                onClick={() => setSaveDialogOpen(false)}
                variant="outline"
                type="button"
              >
                Cancel
              </Button>
              <Button onClick={saveForm} type="button">
                Save
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
