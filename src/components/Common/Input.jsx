import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  autoComplete,
  className = '',
  helperText,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-xs font-semibold">
          <label htmlFor={id} className="text-slate-700">
            {label} {required && <span className="text-adventure-600">*</span>}
          </label>
          {helperText && <span className="text-slate-500">{helperText}</span>}
        </div>
      )}

      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full py-2.5 text-sm text-slate-900 placeholder:text-slate-400 rounded-xl bg-white border border-slate-300 outline-none transition-all focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15 shadow-xs ${
            Icon ? 'pl-10' : 'pl-3.5'
          } ${isPassword ? 'pr-10' : 'pr-3.5'} ${
            error
              ? '!border-red-500 !ring-3 !ring-red-500/15'
              : 'hover:border-slate-400'
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
