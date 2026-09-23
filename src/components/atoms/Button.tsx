import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

const estilos = {
  primary: 'bg-green-700 text-white hover:bg-green-800 shadow-sm',
  secondary: 'bg-green-50 text-green-800 hover:bg-green-100 border border-green-200',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${estilos[variant]} ${className}`}
      {...props}
    />
  );
}