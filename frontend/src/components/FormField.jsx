const CONTROL_CLASSES =
  'block w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:bg-slate-50 disabled:text-slate-500';

// A label + control + error message. Use `as="textarea"` or `as="select"` for other controls.
export default function FormField({
  label,
  name,
  error,
  as: Control = 'input',
  className = '',
  children,
  ...props
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <Control
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`${CONTROL_CLASSES} ${error ? 'border-red-400' : 'border-slate-300'}`}
        {...props}
      >
        {children}
      </Control>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
