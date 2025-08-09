import { initialState, type FormSchema, type FormState } from "../types/types";
import {useState, useEffect} from 'react';

export const useFormStore = () => {
  const [state, setState] = useState<FormState>(initialState);

  useEffect(() => {
    const saved = localStorage.getItem('formBuilderData');
    if (saved) {
      setState(JSON.parse(saved));
    }
  }, []);

  const updateState = (next: Partial<FormState> | ((prev: FormState) => Partial<FormState>)) => {
    setState((prev) => {
      const partial = typeof next === 'function' ? (next as (p: FormState) => Partial<FormState>)(prev) : next;
      const updated = { ...prev, ...partial } as FormState;
      localStorage.setItem('formBuilderData', JSON.stringify(updated));
      return updated;
    });
  };

  return {
    state,
    updateCurrentForm: (form: FormSchema | null) => updateState({ currentForm: form }),
    addSavedForm: (form: FormSchema) => {
      setState(prev => {
        const updated: FormState = {
          ...prev,
          savedForms: [...prev.savedForms, form],
          currentForm: form,
        };
        localStorage.setItem('formBuilderData', JSON.stringify(updated));
        return updated;
      });
    },
    updateSavedForm: (form: FormSchema) => {
      setState(prev => {
        const exists = prev.savedForms.some(f => f.id === form.id);
        const nextSaved = exists
          ? prev.savedForms.map(f => f.id === form.id ? form : f)
          : [...prev.savedForms, form];
        const updated: FormState = {
          ...prev,
          savedForms: nextSaved,
          currentForm: form,
        };
        localStorage.setItem('formBuilderData', JSON.stringify(updated));
        return updated;
      });
    },
    deleteSavedForm: (id: string) => {
      setState(prev => {
        const updated: FormState = {
          ...prev,
          savedForms: prev.savedForms.filter(f => f.id !== id),
        };
        localStorage.setItem('formBuilderData', JSON.stringify(updated));
        return updated;
      });
    }
  };
};