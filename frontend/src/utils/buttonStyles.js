const VARIANTS = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-600 disabled:bg-indigo-300',
  secondary:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-indigo-600 disabled:text-slate-400 disabled:hover:bg-white',
};

// Shared by <Button> and by links that should look like buttons.
export function buttonClasses(variant = 'primary') {
  return `inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed ${VARIANTS[variant]}`;
}
