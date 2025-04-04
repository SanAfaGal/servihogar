import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div
      className={`fixed bottom-4 right-4 max-w-sm w-full ${bgColor} border ${borderColor} rounded-lg shadow-lg p-4 flex items-start`}
    >
      <Icon className={`h-5 w-5 ${textColor} mr-3 flex-shrink-0`} />
      <p className={`${textColor} flex-1`}>{message}</p>
      <button
        onClick={onClose}
        className={`ml-4 ${textColor} hover:opacity-75 transition-opacity`}
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

export default Toast;