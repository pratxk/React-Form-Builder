export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password' | 'notEmpty';
  value?: number;
  message: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  required: boolean;
  defaultValue: any;
  validations: ValidationRule[];
  options?: string[]; // for select, radio
  isDerived?: boolean;
  derivedFormula?: string;
  parentFields?: string[];
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
}

export interface FormState {
  currentForm: FormSchema | null;
  savedForms: FormSchema[];
}

// Initial state
export const initialState: FormState = {
  currentForm: null,
  savedForms: []
};