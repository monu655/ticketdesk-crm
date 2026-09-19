const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function SearchIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function PlusIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M19 12H5m6-6-6 6 6 6" />
    </svg>
  );
}

export function CheckCircleIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}

export function AlertIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5v.01" />
    </svg>
  );
}

export function InboxIcon({ className = 'h-6 w-6' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M3 13h5l1.5 3h5L16 13h5" />
      <path d="M5.5 5h13L21 13v6H3v-6z" />
    </svg>
  );
}

export function CloseIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function LifebuoyIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...baseProps} strokeWidth={2} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3" />
      <path d="m6 6 3.9 3.9M14.1 14.1 18 18M18 6l-3.9 3.9M9.9 14.1 6 18" />
    </svg>
  );
}
