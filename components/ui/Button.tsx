
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth = false, className = '', ...props }) => {
  // Guidelines: Rounded 12px (rounded-xl), Inter Medium (font-medium), Tracking 0.3px (tracking-wide), Padding 10px 16px (py-2.5 px-4)
  const baseClasses = 'px-4 py-2.5 rounded-xl font-medium text-[14px] tracking-[0.3px] shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transform active:scale-[0.98]';
  
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/25 focus:ring-indigo-500 border border-transparent',
    secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 focus:ring-gray-500 backdrop-blur-md',
    danger: 'bg-red-500/90 text-white hover:bg-red-600 focus:ring-red-500 border border-transparent',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
