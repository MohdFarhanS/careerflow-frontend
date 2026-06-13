import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Select = forwardRef(function Select(
  { label, error, required, children, className, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-ink-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
          {!required && <span className="ml-1 text-xs font-normal text-ink-400">(Opsional)</span>}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink-900',
          'outline-none transition-colors',
          'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
            : 'border-ink-200 hover:border-ink-300',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
});

export default Select;