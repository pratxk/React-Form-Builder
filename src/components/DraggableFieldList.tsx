import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Card, Typography, IconButton } from '@mui/material';
import { GripVertical, Trash2, Settings } from 'lucide-react';
import { FieldConfiguration } from './FieldConfiguration';
import type { FormField } from '../types/types';

interface DraggableFieldProps {
  field: FormField;
  onDelete: (fieldId: string) => void;
  onEdit: (fieldId: string) => void;
}

const DraggableField: React.FC<DraggableFieldProps> = ({ field, onDelete, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        p: 2,
        mb: 2,
        cursor: 'grab',
        '&:active': { cursor: 'grabbing' },
        border: '1px solid #e5e7eb',
        '&:hover': {
          borderColor: '#3b82f6',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Box
            {...attributes}
            {...listeners}
            sx={{
              cursor: 'grab',
              mr: 2,
              color: '#6b7280',
              '&:hover': { color: '#3b82f6' },
            }}
          >
            <GripVertical size={20} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {field.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
              {field.required && ' • Required'}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => onEdit(field.id)}
            sx={{ color: '#6b7280', '&:hover': { color: '#3b82f6' } }}
          >
            <Settings size={16} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(field.id)}
            sx={{ color: '#ef4444', '&:hover': { color: '#dc2626' } }}
          >
            <Trash2 size={16} />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

interface DraggableFieldListProps {
  fields: FormField[];
  onFieldsReorder: (fields: FormField[]) => void;
  onDeleteField: (fieldId: string) => void;
  onEditField: (fieldId: string) => void;
  onUpdateField: (fieldId: string, updatedField: FormField) => void;
}

export const DraggableFieldList: React.FC<DraggableFieldListProps> = ({
  fields,
  onFieldsReorder,
  onDeleteField,
  onEditField,
  onUpdateField,
}) => {
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over?.id);

      const newFields = arrayMove(fields, oldIndex, newIndex);
      onFieldsReorder(newFields);
    }
  };

  const handleEditField = (fieldId: string) => {
    setEditingFieldId(fieldId);
    setExpandedFieldId(fieldId);
  };

  const handleUpdateField = (updatedField: FormField) => {
    onUpdateField(updatedField.id, updatedField);
    // Keep the field in edit mode after update
  };

  const handleCancelEdit = () => {
    setEditingFieldId(null);
    setExpandedFieldId(null);
  };

  const handleFieldUpdate = (updatedField: FormField) => {
    onUpdateField(updatedField.id, updatedField);
    // Don't close the editing mode when updating, only when explicitly cancelled
  };

  const handleFieldDelete = (fieldId: string) => {
    onDeleteField(fieldId);
    setEditingFieldId(null);
    setExpandedFieldId(null);
  };

  return (
    <Box>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={fields.map(field => field.id)} strategy={verticalListSortingStrategy}>
          {fields.map((field) => (
            <Box key={field.id}>
                             {editingFieldId === field.id ? (
                 <Box sx={{ mb: 3 }}>
                   <FieldConfiguration
                     field={field}
                     onUpdate={handleUpdateField}
                     onDelete={() => handleFieldDelete(field.id)}
                     allFields={fields}
                     onCancel={handleCancelEdit}
                     isExpanded={expandedFieldId === field.id}
                     onToggleExpanded={() => setExpandedFieldId(expandedFieldId === field.id ? null : field.id)}
                   />
                 </Box>
               ) : (
                <DraggableField
                  field={field}
                  onDelete={onDeleteField}
                  onEdit={handleEditField}
                />
              )}
            </Box>
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  );
};
