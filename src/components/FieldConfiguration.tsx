import React, { useState } from 'react';
import { Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { ChevronDown, ChevronRight, Trash2, Plus } from 'lucide-react';

import Card from './Card';
import Input from './Input';
import Select from './Select';
import { Button } from './Button';
import type { FormField, ValidationRule } from '../types/types';

interface Props {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: () => void;
  allFields: FormField[];
}

export const FieldConfiguration: React.FC<Props> = ({
  field,
  onUpdate,
  onDelete,
  allFields,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleValidationChange = (index: number, validation: ValidationRule) => {
    const newValidations = [...field.validations];
    newValidations[index] = validation;
    onUpdate({ ...field, validations: newValidations });
  };

  const addValidation = () => {
    onUpdate({
      ...field,
      validations: [...field.validations, { type: 'required', message: 'This field is required' }],
    });
  };

  const removeValidation = (index: number) => {
    onUpdate({
      ...field,
      validations: field.validations.filter((_, i) => i !== index),
    });
  };

  return (
    <Card sx={{ mb: 3, p: 2 }}>
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <Typography variant="h6" component="h3" sx={{ fontWeight: '600' }}>
            {field.label || `${field.type} field`}
          </Typography>
          <Box
            component="span"
            sx={{
              px: 1.2,
              py: 0.4,
              bgcolor: '#bfdbfe', // blue-100
              color: '#1e40af', // blue-800
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 600,
              userSelect: 'none',
            }}
          >
            {field.type}
          </Box>
        </Box>

        <Button
          onClick={() => {
            onDelete();
          }}
          variant="danger"
          size="small"
          type="button"
        >
          <Trash2 size={16} />
        </Button>
      </Box>

      {/* Expanded Content */}
      {expanded && (
        <Box mt={3} display="flex" flexDirection="column" gap={3}>
          {/* Label and Required */}
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
            <Box flex={1}>
              <Typography variant="subtitle2" gutterBottom>
                Label
              </Typography>
              <Input
                value={field.label}
                onChange={(e) => onUpdate({ ...field, label: e.target.value })}
                placeholder="Enter field label"
              />
            </Box>
            <Box display="flex" alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.required || false}
                    onChange={(e) => onUpdate({ ...field, required: e.target.checked })}
                    color="primary"
                  />
                }
                label="Required"
              />
            </Box>
          </Box>

          {/* Options for select/radio */}
          {(field.type === 'select' || field.type === 'radio') && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Options (comma separated)
              </Typography>
              <Input
                value={field.options?.join(', ') || ''}
                onChange={(e) =>
                  onUpdate({
                    ...field,
                    options: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter((Boolean as unknown) as (v: string) => v is string),
                  })
                }
                placeholder="Option 1, Option 2, Option 3"
              />
            </Box>
          )}

          {/* Default Value */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Default Value
            </Typography>
            <Input
              value={field.defaultValue || ''}
              onChange={(e) => onUpdate({ ...field, defaultValue: e.target.value })}
              placeholder="Enter default value"
            />
          </Box>

          {/* Derived Field Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={field.isDerived || false}
                onChange={(e) => onUpdate({ ...field, isDerived: e.target.checked })}
                color="primary"
              />
            }
            label="Derived Field"
          />

          {/* Derived Field Options */}
          {field.isDerived && (
            <Box display="flex" flexDirection="column" gap={3}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Parent Fields
                </Typography>
                <Select
                  multiple
                  value={field.parentFields || []}
                  onChange={(next) => {
                    onUpdate({ ...field, parentFields: next as string[] });
                  }}
                  options={allFields
                    .filter((f) => f.id !== field.id && !f.isDerived)
                    .map((f) => ({ value: f.id, label: f.label }))}
                  label="Parent Fields"
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Formula (e.g., field1 + field2)
                </Typography>
                <Input
                  value={field.derivedFormula || ''}
                  onChange={(e) => onUpdate({ ...field, derivedFormula: e.target.value })}
                  placeholder="Enter calculation formula"
                />
              </Box>
            </Box>
          )}

          {/* Validations */}
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle2">Validations</Typography>
              <Button onClick={addValidation} size="small" variant="outline" type="button">
                <Plus size={16} style={{ marginRight: 4 }} />
                Add Validation
              </Button>
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
              {field.validations.map((validation, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  gap={1.5}
                  sx={{
                    bgcolor: '#f9fafb', // gray-50
                    p: 1.5,
                    borderRadius: 1,
                    border: '1px solid #e5e7eb', // gray-200
                  }}
                >
                  <Select
                    value={validation.type}
                    onChange={(next) =>
                      handleValidationChange(index, {
                        ...validation,
                        type: next as ValidationRule['type'],
                      })
                    }
                    options={[
                      { value: 'required', label: 'Required' },
                      { value: 'notEmpty', label: 'Not Empty' },
                      { value: 'minLength', label: 'Min Length' },
                      { value: 'maxLength', label: 'Max Length' },
                      { value: 'email', label: 'Email' },
                      { value: 'password', label: 'Password' },
                    ]}
                    sx={{ width: 140 }}
                  />

                  {(validation.type === 'minLength' || validation.type === 'maxLength') && (
                    <Input
                      type="number"
                      value={validation.value?.toString() || ''}
                      onChange={(e) =>
                        handleValidationChange(index, {
                          ...validation,
                          value: parseInt(e.target.value),
                        })
                      }
                      placeholder="Value"
                      className=""
                      style={{ width: 80 }}
                    />
                  )}

                  <Input
                    value={validation.message}
                    onChange={(e) =>
                      handleValidationChange(index, { ...validation, message: e.target.value })
                    }
                    placeholder="Error message"
                    className=""
                    style={{ flexGrow: 1 }}
                  />

                  <Button
                    onClick={() => removeValidation(index)}
                    variant="danger"
                    size="small"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Card>
  );
};
