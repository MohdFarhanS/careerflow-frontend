import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, required, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-ink-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
          {!required && <span className="ml-1 text-xs font-normal text-ink-400">(Opsional)</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 outline-none transition-all duration-150 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${
          error ? 'border-red-400' : 'border-ink-200'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;