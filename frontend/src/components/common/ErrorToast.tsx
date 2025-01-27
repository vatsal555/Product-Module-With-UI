import React from 'react';

interface ErrorToastProps {
  title: string;
  messages: string[];
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ title, messages }) => (
  <div className="space-y-1 max-w-md">
    <p className="font-semibold text-red-800">{title}</p>
    {messages.length === 1 ? (
      <p className="text-sm text-red-700">{messages[0]}</p>
    ) : (
      <ul className="list-disc pl-4">
        {messages.map((msg, idx) => (
          <li key={idx} className="text-sm text-red-700">{msg}</li>
        ))}
      </ul>
    )}
  </div>
); 