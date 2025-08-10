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
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Paper
} from "@mui/material";
import { Eye, Send, Code, CheckCircle } from "lucide-react";
import type { useFormStore } from "../store/useFormStore";
import type { FormField, FormValidationState, FormSubmissionData } from "../types/types";
import { Button } from "./Button";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`form-tabpanel-${index}`}
      aria-labelledby={`form-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const EnhancedFormPreview: React.FC<{
  store: ReturnType<typeof useFormStore>;
}> = ({ store }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tabValue, setTabValue] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<FormSubmissionData | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

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
          formula = formula.replace(new RegExp(parentId, "g"), value.toString());
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
          const calculatedValue = calculateDerivedValue(field);
          if (newData[field.id] !== calculatedValue) {
            newData[field.id] = calculatedValue;
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
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = (): FormValidationState => {
    if (!currentForm) {
      return { isValid: false, errors: {} };
    }

    const newErrors: Record<string, string> = {};
    let isValid = true;

    currentForm.fields.forEach((field) => {
      const value = formData[field.id];
      const error = validateField(field, value);
      
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  };

  const handleSubmit = () => {
    const validation = validateForm();
    
    if (!validation.isValid) {
      return;
    }

    const submission: FormSubmissionData = {
      formId: currentForm!.id,
      formName: currentForm!.name,
      submittedAt: new Date().toISOString(),
      data: formData,
    };

    setSubmissionData(submission);
    setIsSubmitted(true);
    setShowSuccess(true);
    setTabValue(1); // Switch to JSON response tab
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id];
    const error = errors[field.id];

    switch (field.type) {
      case "text":
      case "number":
        return (
          <Input
            key={field.id}
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            type={field.type}
            required={field.required}
            error={!!error}
            helperText={error}
            disabled={field.isDerived}
          />
        );

      case "textarea":
        return (
          <Textarea
            key={field.id}
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            error={!!error}
            helperText={error}
            disabled={field.isDerived}
          />
        );

      case "select":
        return (
          <Select
            key={field.id}
            label={field.label}
            value={value}
            onChange={(newValue) => handleFieldChange(field.id, newValue)}
            options={(field.options || []).map(option => ({ value: option, label: option }))}
            required={field.required}
            error={!!error}
            helperText={error}
            disabled={field.isDerived}
          />
        );

      case "radio":
        return (
          <FormControl key={field.id} error={!!error} required={field.required}>
            <FormLabel>{field.label}</FormLabel>
            <RadioGroup
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case "checkbox":
        return (
          <FormControl key={field.id} error={!!error} required={field.required}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={value || false}
                  onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                />
              }
              label={field.label}
            />
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case "date":
        return (
          <Input
            key={field.id}
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            type="date"
            required={field.required}
            error={!!error}
            helperText={error}
            disabled={field.isDerived}
          />
        );

      default:
        return null;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!currentForm) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          No form selected for preview
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          {currentForm.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Form Preview - Test your form and see the submission data
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="form preview tabs">
            <Tab 
              icon={<Eye size={16} />} 
              label="Form Preview" 
              iconPosition="start"
            />
            <Tab 
              icon={<Code size={16} />} 
              label="JSON Response" 
              iconPosition="start"
              disabled={!isSubmitted}
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {currentForm.fields.map(renderField)}
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                onClick={handleSubmit}
                type="button"
                disabled={Object.keys(errors).length > 0}
              >
                <Send size={18} style={{ marginRight: 8 }} />
                Submit Form
              </Button>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {submissionData ? (
            <Box>
              <Typography variant="h6" mb={2}>
                Form Submission Data
              </Typography>
              <Paper sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <pre style={{ 
                  margin: 0, 
                  whiteSpace: 'pre-wrap', 
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {JSON.stringify(submissionData, null, 2)}
                </pre>
              </Paper>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Submit the form to see the JSON response data
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Card>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          icon={<CheckCircle />}
        >
          Form submitted successfully! Check the JSON Response tab.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EnhancedFormPreview;
