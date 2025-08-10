import React, { useEffect, useState } from "react";
import Card from "./Card";
import Input from "./Input";
import Textarea from "./Textarea";
import Select from "./Select";
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import { Eye } from "lucide-react"; // assuming you keep lucide icons
import type { useFormStore } from "../store/useFormStore";
import type { FormField } from "../types/types";
import { Button } from "./Button";

const FormPreview: React.FC<{
  store: ReturnType<typeof useFormStore>;
}> = ({ store }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentForm = store.state.currentForm;

  const validateField = (field: FormField, value: any): string | null => {
    for (const validation of field.validations) {
      switch (validation.type) {
        case "required":
          if (!value || (Array.isArray(value) && value.length === 0)) {
            return validation.message;
          }
          break;
        case "notEmpty":
          if (!value || value.toString().trim() === "") {
            return validation.message;
          }
          break;
        case "minLength":
          if (value && value.toString().length < (validation.value || 0)) {
            return validation.message;
          }
          break;
        case "maxLength":
          if (value && value.toString().length > (validation.value || 0)) {
            return validation.message;
          }
          break;
        case "email":
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return validation.message;
          }
          break;
        case "password":
          if (value && (value.length < 8 || !/\d/.test(value))) {
            return validation.message;
          }
          break;
      }
    }
    return null;
  };

  const calculateDerivedValue = (field: FormField): any => {
    if (!field.isDerived || !field.derivedFormula || !field.parentFields) {
      return field.defaultValue;
    }

    try {
      let formula = field.derivedFormula;
      field.parentFields.forEach((parentId) => {
        const parentField = currentForm?.fields.find((f) => f.id === parentId);
        if (parentField) {
          const value = formData[parentId] || 0;
          formula = formula.replace(
            new RegExp(parentId, "g"),
            value.toString()
          );
        }
      });

      // Simple formula evaluation - in production use a proper expression parser
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + formula + ")")();
      return result;
    } catch {
      return field.defaultValue;
    }
  };

  useEffect(() => {
    if (currentForm) {
      const initialData: Record<string, any> = {};
      currentForm.fields.forEach((field) => {
        if (field.isDerived) {
          initialData[field.id] = calculateDerivedValue(field);
        } else {
          initialData[field.id] = field.defaultValue || "";
        }
      });
      setFormData(initialData);
    }
  }, [currentForm]);

  useEffect(() => {
    if (currentForm) {
      const newData = { ...formData };
      let hasChanges = false;

      currentForm.fields.forEach((field) => {
        if (field.isDerived) {
          const newValue = calculateDerivedValue(field);
          if (newData[field.id] !== newValue) {
            newData[field.id] = newValue;
            hasChanges = true;
          }
        }
      });

      if (hasChanges) {
        setFormData(newData);
      }
    }
  }, [formData, currentForm]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));

    const field = currentForm?.fields.find((f) => f.id === fieldId);
    if (field) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [fieldId]: error || "" }));
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] ?? "";
    const error = errors[field.id] || "";

    return (
      <Box key={field.id} mb={4}>
        <FormControl fullWidth error={!!error} disabled={field.isDerived}>
          <FormLabel
            sx={{
              mb: 1,
              fontWeight: 500,
              fontSize: "1rem",
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {field.label}
            {field.required && (
              <Typography component="span" color="error">
                *
              </Typography>
            )}
            {field.isDerived && (
              <Typography
                component="span"
                color="primary"
                fontSize="0.75rem"
                ml={1}
              >
                (auto-calculated)
              </Typography>
            )}
          </FormLabel>

          {(() => {
            switch (field.type) {
              case "text":
                return (
                  <Input
                    value={value}
                    onChange={(e) =>
                      handleFieldChange(field.id, e.target.value)
                    }
                    disabled={field.isDerived}
                  />
                );
              case "number":
                return (
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handleFieldChange(field.id, e.target.value)
                    }
                    disabled={field.isDerived}
                  />
                );
              case "textarea":
                return (
                  <Textarea
                    value={value}
                    onChange={(e) =>
                      handleFieldChange(field.id, e.target.value)
                    }
                    disabled={field.isDerived}
                  />
                );
              case "select":
                return (
                  <Select
                    value={value}
                    onChange={(next) =>
                      handleFieldChange(field.id, next as string)
                    }
                    options={[
                      { value: "", label: "Select an option" },
                      ...(field.options?.map((option) => ({
                        value: option,
                        label: option,
                      })) || []),
                    ]}
                    disabled={field.isDerived}
                  />
                );
              case "radio":
                return (
                  <RadioGroup
                    value={value}
                    onChange={(e) =>
                      handleFieldChange(field.id, e.target.value)
                    }
                    row={false}
                  >
                    {field.options?.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio disabled={field.isDerived} />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                );
              case "checkbox":
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!value}
                        onChange={(e) =>
                          handleFieldChange(field.id, e.target.checked)
                        }
                        disabled={field.isDerived}
                      />
                    }
                    label={field.label}
                  />
                );
              case "date":
                return (
                  <Input
                    type="date"
                    value={value}
                    onChange={(e) =>
                      handleFieldChange(field.id, e.target.value)
                    }
                    disabled={field.isDerived}
                  />
                );
              default:
                return null;
            }
          })()}

          {!!error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
      </Box>
    );
  };

  if (!currentForm || currentForm.fields.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Card>
          <Box sx={{ p: 8, textAlign: "center" }}>
            <Eye size={64} className="mx-auto" color="#9ca3af" />
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ mt: 2, mb: 1 }}
            >
              No form to preview
            </Typography>
            <Typography color="text.secondary">
              Create a form first to see the preview
            </Typography>
          </Box>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        p: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 960, mx: "auto" }}>
        <Box mb={4}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Form Preview
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {currentForm.name || "Untitled Form"}
          </Typography>
        </Box>

        <Card>
          <Box p={6}>
            {currentForm.fields.map((field) => (
              <React.Fragment key={field.id}>
                {renderField(field)}
              </React.Fragment>
            ))}

            <Box mt={8} pt={3} borderTop="1px solid" borderColor="divider">
              <Button type="submit" size="large">
                Submit Form
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default FormPreview;
