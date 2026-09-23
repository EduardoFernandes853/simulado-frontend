import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyle = "px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none";
  
  const variants = {
    primary: "bg-green-700 text-white hover:bg-green-800 shadow-sm",
    secondary: "bg-green-50 text-green-800 hover:bg-green-100 border border-green-200"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props} />
  );
}