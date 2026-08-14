import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FieldErrorProps {
  error?: string | null;
  touched?: boolean;
  successMessage?: string | null;
  className?: string;
}

export const FieldError: React.FC<FieldErrorProps> = ({
  error,
  touched = true,
  successMessage,
  className = '',
}) => {
  if (touched && error) {
    return (
      <p
        role="alert"
        className={`flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 mt-1 animate-in fade-in slide-in-from-top-1 duration-150 ${className}`}
      >
        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
        <span>{error}</span>
      </p>
    );
  }

  if (touched && !error && successMessage) {
    return (
      <p
        className={`flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 mt-1 animate-in fade-in slide-in-from-top-1 duration-150 ${className}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
        <span>{successMessage}</span>
      </p>
    );
  }

  return null;
};
