const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-soft',
    secondary: 'bg-ink-100 hover:bg-ink-200 text-ink-700',
    outline: 'border border-ink-200 hover:bg-ink-50 text-ink-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'hover:bg-ink-100 text-ink-600',
  };
  
  export default function Button({
    children,
    variant = 'primary',
    className = '',
    isLoading = false,
    ...props
  }) {
    return (
      <button
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }