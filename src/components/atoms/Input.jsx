import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  className = '',
  type = 'text',
  ...props 
}, ref) => {
  const inputClasses = `
    w-full px-3 py-2
    border border-surface-300 rounded-md
    bg-white text-surface-900
    placeholder-surface-400
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    transition-all duration-200
    ${error ? 'border-error focus:ring-error' : ''}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;