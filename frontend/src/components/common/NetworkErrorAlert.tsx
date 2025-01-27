import React from 'react';
import { ErrorAlert } from './ErrorAlert';

interface NetworkErrorAlertProps {
  onRetry: () => void;
}

export const NetworkErrorAlert = ({ onRetry }: NetworkErrorAlertProps) => {
  return (
    <ErrorAlert
      message="Unable to connect to the server. Please check your internet connection."
      onRetry={onRetry}
    />
  );
}; 