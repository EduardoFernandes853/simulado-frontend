import type { InputHTMLAttributes } from 'react';
import { Input } from '../atoms/Input';

export function Campo({ rotulo, ...props }: InputHTMLAttributes<HTMLInputElement> & { rotulo: string }) {
  return (
    <label className="block text-sm font-medium text-slate-600">
      {rotulo}
      <Input className="mt-1 font-normal" {...props} />
    </label>
  );
}