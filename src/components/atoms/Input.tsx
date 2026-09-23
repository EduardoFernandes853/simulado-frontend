import type { InputHTMLAttributes } from 'react';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-md border border-slate-300 px-4 py-2 transition-colors focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 ${className}`}
      {...props}
    />
  );
}