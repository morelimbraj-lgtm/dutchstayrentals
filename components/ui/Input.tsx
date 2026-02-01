
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

const Input: React.FC<InputProps> = ({ id, label, className = '', ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <input
        id={id}
        className={`w-full bg-gray-900/50 border border-white/20 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2 transition ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
