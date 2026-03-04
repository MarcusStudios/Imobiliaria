// src/components/form/FormErrorAlert.tsx
import { AlertCircle } from 'lucide-react';

interface FormErrorAlertProps {
  errors: string[];
}

export const FormErrorAlert = ({ errors }: FormErrorAlertProps) => {
  if (errors.length === 0) return null;

  return (
    <div className="error-alert">
      <div className="error-header">
        <AlertCircle size={20} color="#ef4444" />
        <strong className="error-title">Corrija os seguintes erros:</strong>
      </div>
      <ul className="error-list">
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
    </div>
  );
};
